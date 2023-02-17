const makeRole = require('../../entities/role/app');
const makeAccessRights = require('../../entities/access-rights/app')
const rolesDb = require('../../data-access/role/app');
const accessRightsDb = require('../../data-access/access-right/app');
//sl
const {roles} = require('../../sl-access/roles/roles');
const {accessRights} = require('../../sl-access/access-rights/access-rights')

const addRole = require('./role-add');
const getAllRoles = require('./role-get-all');
const getRole = require('./role-get-one');
const updateRole = require('./role-update');

const makeRoleUseCase = addRole({ makeRole, makeAccessRights, roles, accessRights });
const getAllRolesUseCase = getAllRoles({ accessRights, roles });
const getRoleUseCase = getRole({ roles });
const updateRoleUseCase = updateRole({ makeRole, makeAccessRights, roles, accessRights});

const rolesService = Object.freeze({
    makeRoleUseCase,
    getAllRolesUseCase,
    getRoleUseCase,
    updateRoleUseCase
});

module.exports = rolesService;
module.exports = {
    makeRoleUseCase,
    getAllRolesUseCase,
    getRoleUseCase,
    updateRoleUseCase
};