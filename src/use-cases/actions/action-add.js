const addActionUseCase = ({ actionsDb, makeAction, actions}) => {
    return async function add(info, SessionId){

        const actionEntity = makeAction(info);


        const a = await actions.fix()


        const maxCode = parseInt(a.castmax)+1
        
        const actionExists = await actions.checkIfExist(actionEntity.getDescription(), SessionId);

        if(actionExists.value.length != 0){
            throw new Error('Action already exists');
        }

        const posted = await actions.addActions({
            Code:maxCode,
            Name:maxCode,
            U_ACTION_MODULE:actionEntity.getModule(),
            U_ACTION_DESC:actionEntity.getDescription(),
            U_IS_ACTIVE: actionEntity.getIsActive() == "true" || actionEntity.getIsActive() == true ? 1 : 0,
            U_CREATED_BY:info.user_id
         }, SessionId);

         if(!posted){
             throw new Error('Error creating action.')  
         }

         return {
            msg:"Created Successfully",
            id: posted.Code,
            module:posted.U_ACTION_MODULE,
            description: posted.U_ACTION_DESC,
            isActive: posted.U_IS_ACTIVE,
            createdBy: posted.U_CREATED_BY,
            updatedBy: posted.U_UPDATE_BY,
            createdDateAt: posted.U_DATE_CREATED,
            updatedTimeAt:posted.U_TIME_CREATED,
            updatedAt: posted.U_DATE_UPDATED
        }
    };
};

module.exports = addActionUseCase;