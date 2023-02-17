const {
    addModuleUseCase,
    getAllModulesUseCase,
    getModuleUseCase,
    updateModuleUseCase
} = require('../../use-cases/modules/app');

const makeModule = require('./module-add');
const getAllModules = require('./module-get-all');
const getModule = require('./module-get-one');
const updateModule = require('./module-update');

const makeModuleController = makeModule({ addModuleUseCase });
const getAllModulesController = getAllModules({ getAllModulesUseCase });
const getModuleController = getModule({ getModuleUseCase });
const updateModuleController = updateModule({ updateModuleUseCase });

const modulesController = Object.freeze({
    makeModuleController,
    getAllModulesController,
    getModuleController,
    updateModuleController
});

module.exports = modulesController;
module.exports = {
    makeModuleController,
    getAllModulesController,
    getModuleController,
    updateModuleController
};