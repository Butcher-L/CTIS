
const authenticateUserUseCase = ({ jwt, checkMatch, users, accessRights, cma,checks}) => {
    return async function authenticate(info){

        if(!info.employeeId){
            throw new Error('Employee id not provided');
        };

        if(!info.password){
            throw new Error('Password not provided');
        }
        // const val = await cma.validateUser(info.employeeId)
        // console.log(val[0].CompanyName);

        let SessionId;
        // if(!val[0].CompanyName){
            const _slLogin = await users.userLogin();
            try{
                SessionId = _slLogin.SessionId;
            } catch(e){
                throw new Error('Unable to login to SAP');
            }
        // }
        // else{
        //     const masterDataLogin = await checks.masterDataDBLogin(val[0].CompanyName);
        //     try{
        //         console.log(masterDataLogin);
        //         SessionId = masterDataLogin.SessionId;
        //     } catch(e){
        //         throw new Error('Unable to login to SAP');
        //     }
        // }


        

        const _slFetchUser = await users.getUser(info.employeeId, SessionId);

        const fetched = _slFetchUser.value;

        if(!fetched.length){
            throw new Error('Account does not exist');
        };

        const accountDetails = fetched[0].U_USER_ACCOUNTS;
        
        const roleDetails = fetched[0].U_ROLES;
        const userGroup = {};
        userGroup.id = fetched[0].U_USER_GROUPS.Code;
        userGroup.groupCode = fetched[0].U_USER_GROUPS.U_GROUP_CODE;
        userGroup.groupDesc = fetched[0].U_USER_GROUPS.U_GROUP_DESC;
        userGroup.locationId = fetched[0].U_USER_GROUPS.U_LOCATION_ID;
        userGroup.acctgGroup = fetched[0].U_USER_GROUPS.U_ACCTG_GROUP;
        userGroup.locationCode = fetched[0].U_LOCATIONS.U_LOCATION_CODE;
        userGroup.location = fetched[0].U_LOCATIONS.U_LOCATION;
        userGroup.acctgGroupName = fetched[0].U_ACCTG_GROUPS.U_ACCTG_GROUP;
        userGroup.isActive = fetched[0].U_USER_GROUPS.U_IS_ACTIVE == 1 ? true : false;;

        if(userGroup.isActive){
            throw new Error('User\'s accounting group is inactive.');
        }

        if(!checkMatch(info.password, accountDetails.U_PASSWORD)){
            throw new Error('Incorrect password');
        }

        token = await jwt.generateToken(fetched[0]);
        const user = {
            id: accountDetails.Code,
            employeeId: accountDetails.U_EMPLOYEE_ID,
            firstname: accountDetails.U_FIRSTNAME,
            lastname: accountDetails.U_LASTNAME,
            middlename: accountDetails.U_MIDDLENAME,
            role: accountDetails.U_ROLE,
            userGroup: accountDetails.U_USER_GROUP,
            company:accountDetails.U_ORG,
            roleName: roleDetails.U_ROLE_NAME,
        };
        const company = accountDetails.U_ORG

        // const getUserGroup = await userGroupsDb.getUserGroup(user.userGroup);
        // const userGroup = getUserGroup.rows[0];

        const accessRightsList = await accessRights.listAccessRightsByRole(user.role, SessionId);

        adminModule = [];
        transactionModule = [];
        reportsModule = [];
        checksModule = [];

        for await(acs of accessRightsList.value){

            const value = {};
            switch(acs.U_USER_ACTIONS.U_ACTION_MODULE){
                case '0':
                    value.role = acs.U_ROLES.U_ROLE_NAME;
                    value.accessRightId = acs.U_ROLES_ACCESS.Code;
                    value.description = acs.U_USER_ACTIONS.U_ACTION_DESC;
                    transactionModule.push(value);
                    break;
                case '1':
                    value.role = acs.U_ROLES.U_ROLE_NAME;
                    value.accessRightId = acs.U_ROLES_ACCESS.Code;
                    value.description = acs.U_USER_ACTIONS.U_ACTION_DESC;
                    adminModule.push(value);
                    break;
                case '2':
                    value.role = acs.U_ROLES.U_ROLE_NAME;
                    value.accessRightId = acs.U_ROLES_ACCESS.Code;
                    value.description = acs.U_USER_ACTIONS.U_ACTION_DESC;
                    reportsModule.push(value);
                    break;
                case '5':
                    value.role = acs.U_ROLES.U_ROLE_NAME;
                    value.accessRightId = acs.U_ROLES_ACCESS.Code;
                    value.description = acs.U_USER_ACTIONS.U_ACTION_DESC;
                    checksModule.push(value);
                    break;
            };
        };


        return {
            message : 'Login successful',
            token: token,
            SessionId: SessionId,
            user: {
                details: user,
                accessRights:{
                    adminModule,
                    transactionModule,
                    reportsModule,
                    checksModule
                },
                userGroup,
                company
            }
        };
    };
};

module.exports = authenticateUserUseCase