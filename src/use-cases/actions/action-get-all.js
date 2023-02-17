const getAllActionsUseCase = ({ actionsDb, actions }) => {
    return async function getAll(SessionId){

        const fetched = await actions.selectAllActions(SessionId);

        let data = [];
        
        for await(action of fetched){
            const dataValue = {}
            dataValue.id = action.U_USER_ACTIONS.Code;
            dataValue.module = action.U_USER_ACTIONS.U_ACTION_MODULE;
            dataValue.description = action.U_USER_ACTIONS.U_ACTION_DESC;
            dataValue.isActive = action.U_USER_ACTIONS.U_IS_ACTIVE == 1 ? true : false ;
            dataValue.moduleName =  action.U_MODULES.U_MODULE_DESC.toLowerCase();
            data.push(dataValue)
        }

        return data;
    };
};

module.exports = getAllActionsUseCase;