const getAllUserAccountsUseCase = ({ usersDb, users,cma }) => {
    return async function getAll(SessionId){
        // const _slFetch = await users.getAllUserAccounts(SessionId);
        const view = await cma.selectAllUserSAP();

        const fetchedAccounts = [];
        for await (account of view){
            const value = {};

            value.id = account.Code;
            value.employeeId = account.U_EMPLOYEE_ID;
            value.firstname = account.U_FIRSTNAME;
            value.middlename = account.U_MIDDLENAME;
            value.lastname = account.U_LASTNAME;
            value.username = account.U_USERNAME;
            value.role = account.U_ROLE;
            value.userGroup = account.U_USER_GROUP;
            value.roleName = account.roleName;
            value.userGroupName = account.U_GROUP_CODE;
            value.groupCode = account.U_GROUP_CODE;
            value.isActive = account.U_IS_ACTIVE == 1 ? true : false;
            value.SAP = account.SAP;
            value.CompanyName=account.CompanyName;
            value.U_ACCTG_GROUP=account.U_ACCTG_GROUP;

            fetchedAccounts.push(value);
        }

        return fetchedAccounts;
    };
};

module.exports = getAllUserAccountsUseCase;