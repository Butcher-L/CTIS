const userGroupsDb = require('../../data-access/user-groups/app');
const makeUserGroup = require('../../entities/user-groups/app');

const {userGroups} = require("../../sl-access/user-group/user-group")

const getAllCmtGroups = require('./get-all-cmt-groups');
const getAllTransmitterGroups = require('./get-all-transmitter-groups');
const getUserGroup = require('./get-user-group');
const getAllUserGroups = require('./get-all-user-groups');
const addUserGroup = require('./user-group-add');
const updateUserGroup = require('./user-group-update');
const getAllAcctgGroups = require('./acctg-groups-get-all');
const getByAcctgGroup = require('./get-by-acctg-group');

const getAllTransmitterGroupsUseCase = getAllTransmitterGroups({ userGroupsDb ,userGroups});
const getUserGroupUseCase = getUserGroup({ userGroupsDb ,userGroups});
const getAllCmtGroupsUserCase = getAllCmtGroups({ userGroupsDb ,userGroups});
const getAllUserGroupsUseCase = getAllUserGroups({ userGroupsDb,userGroups });
const addUserGroupUseCase = addUserGroup({ userGroupsDb, makeUserGroup,userGroups });
const updateUserGroupUseCase = updateUserGroup({ userGroupsDb, makeUserGroup ,userGroups});
const getAllAcctgGroupsUseCase = getAllAcctgGroups({ userGroupsDb ,userGroups});
const getByAcctgGroupUseCase = getByAcctgGroup({ userGroupsDb ,userGroups});

const userGroupsService = {
    getAllTransmitterGroupsUseCase,
    getUserGroupUseCase,
    getAllCmtGroupsUserCase,    
    getAllUserGroupsUseCase,
    addUserGroupUseCase,
    updateUserGroupUseCase,
    getAllAcctgGroupsUseCase,
    getByAcctgGroupUseCase
};

module.exports = userGroupsService;
module.exports = {
    getAllTransmitterGroupsUseCase,
    getUserGroupUseCase,
    getAllCmtGroupsUserCase,
    getAllUserGroupsUseCase,
    addUserGroupUseCase,
    updateUserGroupUseCase,
    getAllAcctgGroupsUseCase,
    getByAcctgGroupUseCase
};
