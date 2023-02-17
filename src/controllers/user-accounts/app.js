const {
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
} = require('../../use-cases/user-accounts/app');

const addUser = require('./user-account-add');
const authenticateUser = require('./user-account-authenticate');
const getUserByUserGroup = require('./user-get-by-user-group');
const getAllUserAccounts = require('./user-accounts-get-all');
const updateUserAccount = require('./user-account-update');
const getUserAccount = require('./user-account-get');
const selectAllUserSAP = require("./selectAllUserSAP");
const resetPassword = require("./reset-password");
const editPassword = require("./edit-password");
const addUserSAP = require("./user-account-add-SAP")

const addUserController = addUser({ addUserUseCase });
const authenticateUserController = authenticateUser({ authenticateUserUseCase });
const getUserByUserGroupController = getUserByUserGroup({ getUserByUserGroupUseCase });
const getAllUserAccountsController = getAllUserAccounts({ getAllUserAccountsUseCase });
const updateUserAccountController = updateUserAccount({ updateUserAccountUseCase });
const getUserAccountController = getUserAccount({ getUserAccountUseCase });
const selectAllUserSAPController = selectAllUserSAP({selectAllUserSAPUseCase});
const resetPasswordController = resetPassword({resetPasswordUseCase});
const editPasswordController = editPassword({editPasswordUseCase})
const addUserSAPController = addUserSAP({addUserSAPUseCase})

const usersController = Object.freeze({
    addUserController,
    authenticateUserController,
    getUserByUserGroupController,
    getAllUserAccountsController,
    updateUserAccountController,
    getUserAccountController,
    selectAllUserSAPController,
    resetPasswordController,
    editPasswordController,
    addUserSAPController
});

module.exports = usersController;
module.exports = {
    addUserController,
    authenticateUserController,
    getUserByUserGroupController,
    getAllUserAccountsController,
    updateUserAccountController,
    getUserAccountController,
    selectAllUserSAPController,
    resetPasswordController,
    editPasswordController,
    addUserSAPController
}