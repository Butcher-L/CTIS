const makeModule = require('../../entities/module/app');
const modulesDb = require('../../data-access/module/app');

//SL
const {modules}= require("../../sl-access/module/module")

const addModule = require('./module-add');
const getModule = require('./module-get-one');
const getAllModules = require('./module-get-all');
const updateModule = require('./module-update');

const addModuleUseCase = addModule({ modulesDb, makeModule ,modules});
const getModuleUseCase = getModule({ modulesDb , modules});
const getAllModulesUseCase = getAllModules({ modulesDb, modules });
const updateModuleUseCase = updateModule({ modulesDb, makeModule, modules });

const modulesService = Object.freeze({
    addModuleUseCase,
    getAllModulesUseCase,
    getModuleUseCase,
    updateModuleUseCase
});

module.exports = modulesService;
module.exports = {
    addModuleUseCase,
    getAllModulesUseCase,
    getModuleUseCase,
    updateModuleUseCase
};