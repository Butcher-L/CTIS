const getUserAccountUseCase = ({ users }) => {
    return async function getOne(id,SessionId){
        const _slFetch = await users.getUserByCode(id,SessionId);

        const fetchedAccount = [];

        for await (account of _slFetch.value){
            const value = {};

            value.id = account.U_USER_ACCOUNTS.Code;
            value.employeeId = account.U_USER_ACCOUNTS.U_EMPLOYEE_ID;
            value.firstname = account.U_USER_ACCOUNTS.U_FIRSTNAME;
            value.middlename = account.U_USER_ACCOUNTS.U_MIDDLENAME;
            value.lastname = account.U_USER_ACCOUNTS.U_LASTNAME;
            value.username = account.U_USER_ACCOUNTS.U_USERNAME;
            value.role = account.U_USER_ACCOUNTS.U_CTIS_role;
            value.userGroup = account.U_USER_ACCOUNTS.U_USER_GROUP;
            value.roleName = account.U_ROLES.U_ROLE_NAME;
            value.userGroupName = account.U_USER_GROUPS.U_GROUP_CODE;
            value.groupCode = account.U_USER_GROUPS.U_GROUP_CODE;
            value.isActive = account.U_USER_ACCOUNTS.U_IS_ACTIVE == 1 ? true : false;

            fetchedAccount.push(value);
        }
        
        return fetchedAccount;
    };
};

module.exports = getUserAccountUseCase;