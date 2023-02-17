const addUserSAP = ({ makeUser, usersDb, encrypt, users,cma }) => {
    return async function add(info,SessionId){
       
        const userEntity = makeUser.makeUserAccountSAP(info);
 
        const _slFetchUser = await cma.validateUser(info.ExtEmpNo);

        if(!_slFetchUser.length==0){
            throw new Error('account already exists')
        };

        const maxCode = await users.getMaxCode();
        const max = maxCode.data.castmax + 1;
       

        
        const posted = await users.addUser({
            Code: max,
            Name: max,
            U_EMPLOYEE_ID: userEntity.getExtEmpNo(),
            U_FIRSTNAME: userEntity.getFirstname(),
            U_LASTNAME: userEntity.getLastname(),
            U_MIDDLENAME: info.middleName,
            U_PASSWORD: encrypt(userEntity.getExtEmpNo()),
            U_ORG:info.COMPANYNAME,
            U_SAP:info.userId,
            U_ROLE:userEntity.getRole(),
            U_IS_ACTIVE:1,
            U_USER_GROUP:userEntity.getUserGroup(),
            U_CREATED_BY: info.user_id
        }, SessionId);


        return {
            msg: `user ${userEntity.getEmployeeId()} added successfully`,
        };
    };
};

module.exports = addUserSAP;