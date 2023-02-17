const {
    addAccessRightUseCase,
    getRoleAccessRightsUseCase
} = require('../../use-cases/access-right/app');

const addAccessRight = require('./add-access-right');
const getRoleAccessRights = require('./access-rights-get-by-role');

const addAccessRightController = addAccessRight({ addAccessRightUseCase });
const getRoleAccessRightsController = getRoleAccessRights({ getRoleAccessRightsUseCase })


const accessRightsController = Object.freeze({
    addAccessRightController,
    getRoleAccessRightsController
});

module.exports = accessRightsController;
module.exports = {
    addAccessRightController,
    getRoleAccessRightsController
}