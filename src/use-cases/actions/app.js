const makeAction = require('../../entities/actions/app');
const actionsDb = require('../../data-access/actions/app');
//SL
const {actions}= require("../../sl-access/action/actions")

const addAction = require('./action-add');
const getAction = require('./action-get-one');
const getAllActions = require('./action-get-all');
const updateAction = require('./action-update');

const addActionUseCase = addAction({ actionsDb, makeAction ,actions});
const getActionUseCase = getAction({ actionsDb, actions });
const getAllActionsUseCase = getAllActions({ actionsDb, actions });
const updateActionUseCase = updateAction({ actionsDb, makeAction, actions });

const actionsService = Object.freeze({
    addActionUseCase,
    getAllActionsUseCase,
    getActionUseCase,
    updateActionUseCase
});

module.exports = actionsService;
module.exports = {
    addActionUseCase,
    getAllActionsUseCase,
    getActionUseCase,
    updateActionUseCase
};