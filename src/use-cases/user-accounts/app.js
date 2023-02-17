const makeUser = require('../../entities/user-accounts/app');
const usersDb = require('../../data-access/user-account/app');
const accessRightsDb = require('../../data-access/access-right/app');
const userGroupsDb = require('../../data-access/user-groups/app');
const jwt = require('../../infra/jwt/app');
const {encrypt, decrypt, checkMatch} = require('../../infra/crypting/app')
//SL
const {users} = require('../../sl-access/users/user');
const {accessRights} = require('../../sl-access/access-rights/access-rights');
const {checks} = require("../../sl-access/checks/checks")

const {cma} = require("../../hdb-query/hdb")

const addUser = require('./user-account-add');
const authenticateUser = require('./user-account-authenticate');
const getUserByUserGroup = require('./user-get-by-user-group');
const getAllUserAccounts = require('./user-accounts-get-all');
const updateUserAccount = require('./user-accounts-update');
const getUserAccount = require('./user-account-get');
const selectAllUserSAP = require("./selectAllUserSAP");
const resetPassword = require("./reset-password");
const editPassword = require("./edit-password")
const addUserSAP = require("./user-account-add-SAP")

const addUserUseCase = addUser({ makeUser, users, encrypt, users });
const authenticateUserUseCase = authenticateUser({ jwt, checkMatch, users, accessRights, cma, checks});
const getUserByUserGroupUseCase = getUserByUserGroup({ users });
const getAllUserAccountsUseCase = getAllUserAccounts({ users,cma });
const updateUserAccountUseCase = updateUserAccount({ makeUser, users, encrypt,cma  });
const getUserAccountUseCase = getUserAccount({ users });
const selectAllUserSAPUseCase = selectAllUserSAP({cma});
const resetPasswordUseCase = resetPassword({ users, encrypt,decrypt});
const editPasswordUseCase = editPassword({ users, encrypt});
const addUserSAPUseCase = addUserSAP({makeUser, users, encrypt, users,cma})

const usersService = Object.freeze({
    addUserUseCase,
    authenticateUserUseCase,
    getUserByUserGroupUseCase,
    getAllUserAccountsUseCase,
    updateUserAccountUseCase,
    getUserAccountUseCase,
    selectAllUserSAPUseCase,
    resetPasswordUseCase,
    editPasswordUseCase,
    addUserSAPUseCase
});

module.exports = usersService;
module.exports = {
    addUserUseCase,
    authenticateUserUseCase,
    getUserByUserGroupUseCase,
    getAllUserAccountsUseCase,
    updateUserAccountUseCase,
    getUserAccountUseCase,
    selectAllUserSAPUseCase,
    resetPasswordUseCase,
    editPasswordUseCase,
    addUserSAPUseCase
};