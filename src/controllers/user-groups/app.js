const {
    getAllTransmitterGroupsUseCase,
    getUserGroupUseCase,
    getAllCmtGroupsUserCase,
    getAllUserGroupsUseCase,
    addUserGroupUseCase,
    updateUserGroupUseCase,
    getAllAcctgGroupsUseCase,
    getByAcctgGroupUseCase
} = require('../../use-cases/user-groups/app');

const getAllTransmitterGroups = require('./get-all-transmitter-groups');
const getUserGroup = require('./get-user-group');
const getAllCmtGroups = require('./get-all-cmt-groups');
const getAllUserGroups = require('./get-all-user-groups');
const addUserGroup = require('./user-group-add');
const updateUserGroup = require('./user-group-update');
const getAllAcctgGroups = require('./acctg-groups-get-all');
const getByAcctgGroup = require('./get-by-acctg-group');

const getAllTransmitterGroupsController = getAllTransmitterGroups({ getAllTransmitterGroupsUseCase });
const getUserGroupController = getUserGroup({ getUserGroupUseCase });
const getAllCmtGroupsController = getAllCmtGroups({ getAllCmtGroupsUserCase });
const getAllUserGroupsController = getAllUserGroups({ getAllUserGroupsUseCase });
const addUserGroupController = addUserGroup({ addUserGroupUseCase });
const updateUserGroupController = updateUserGroup({ updateUserGroupUseCase });
const getAllAcctgGroupsController = getAllAcctgGroups({ getAllAcctgGroupsUseCase });
const getByAcctgGroupController = getByAcctgGroup({ getByAcctgGroupUseCase });

const userGroupsController = Object.freeze({
    getAllTransmitterGroupsController,
    getUserGroupController,
    getAllCmtGroupsController,
    getAllUserGroupsController,
    addUserGroupController,
    updateUserGroupController,
    getAllAcctgGroupsController,
    getByAcctgGroupController
});

module.exports = userGroupsController;
module.exports = {
    getAllTransmitterGroupsController,
    getUserGroupController,
    getAllCmtGroupsController,
    getAllUserGroupsController,
    addUserGroupController,
    updateUserGroupController,
    getAllAcctgGroupsController,
    getByAcctgGroupController
};