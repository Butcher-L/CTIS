const getUserByUserGroupUseCase = ({ users }) => {
    return async function get(id,SessionId,company){
        let data = '';
        if(company.company=='undefined' || company.company=='null'){
            data =false
        }else{
            data=company.company
        }


        const _slFetch = await users.getUserByUserGroup(id,SessionId,data);


        const fetchedAccount = [];

        for await (account of _slFetch){
            const value = {};
            
            value.id = account.Code;
            value.employeeId = account.U_EMPLOYEE_ID;
            value.firstname = account.U_FIRSTNAME;
            value.middlename = account.U_MIDDLENAME;
            value.lastname = account.U_LASTNAME;
            value.username = account.U_USERNAME;
            value.role = account.U_ROLE;
            value.userGroup = account.U_USER_GROUP;
            value.roleName = account.U_ROLE_NAME;
            value.userGroupName = account.U_GROUP_CODE;
            value.groupCode = account.U_GROUP_CODE;
            value.isActive = account.U_IS_ACTIVE == 1 ? true : false;
            

            fetchedAccount.push(value);
        }

   

        return fetchedAccount;
    };
};

module.exports = getUserByUserGroupUseCase;