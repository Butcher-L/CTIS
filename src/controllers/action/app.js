const {
    addActionUseCase,
    getAllActionsUseCase,
    getActionUseCase,
    updateActionUseCase
} = require('../../use-cases/actions/app');

const makeAction = require('./action-add');
const getAllActions = require('./action-get-all');
const getAction = require('./action-get-one');
const updateAction = require('./action-update');

const makeActionController = makeAction({ addActionUseCase });
const getAllActionsController = getAllActions({ getAllActionsUseCase });
const getActionController = getAction({ getActionUseCase });
const updateActionController = updateAction({ updateActionUseCase });

const actionsController = Object.freeze({
    makeActionController,
    getAllActionsController,
    getActionController,
    updateActionController
});

module.exports = actionsController;
module.exports = {
    makeActionController,
    getAllActionsController,
    getActionController,
    updateActionController
};