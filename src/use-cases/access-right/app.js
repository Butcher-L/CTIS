const makeAccessRight = require('../../entities/access-rights/app');
const accessRightsDb = require('../../data-access/access-right/app');

const addAccessRight = require('./add-access-right');
const getRoleAccessRight = require('./access-right-get-by-role');

const addAccessRightUseCase = addAccessRight({ accessRightsDb, makeAccessRight });
const getRoleAccessRightsUseCase = getRoleAccessRight({ accessRightsDb });

const accessRightsService = Object.freeze({
    addAccessRightUseCase,
    getRoleAccessRightsUseCase
});

module.exports = accessRightsService;
module.exports = {
    addAccessRightUseCase,
    getRoleAccessRightsUseCase
} 
