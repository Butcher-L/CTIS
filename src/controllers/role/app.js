const {
    makeRoleUseCase,
    getAllRolesUseCase,
    getRoleUseCase,
    updateRoleUseCase
} = require('../../use-cases/role/app');

const makeRole = require('./role-add');
const getAllRoles = require('./role-get-all');
const getRole = require('./role-get-one');
const updateRole = require('./role-update');

const makeRoleController = makeRole({ makeRoleUseCase });
const getAllRolesController = getAllRoles({ getAllRolesUseCase });
const getRoleController = getRole({ getRoleUseCase });
const updateRoleController = updateRole({ updateRoleUseCase });

const rolesController = Object.freeze({
    makeRoleController,
    getAllRolesController,
    getRoleController,
    updateRoleController
});

module.exports = rolesController;
module.exports = {
    makeRoleController,
    getAllRolesController,
    getRoleController,
    updateRoleController
};