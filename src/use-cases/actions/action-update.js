const updateActionUseCase = ({ actionsDb, makeAction, actions }) => {
  return async function update(id, info,SessionId) {
    const actionEntity = await makeAction(info);
    const patch = await actions.updateActions({
      Code: id,
      U_ACTION_DESC: actionEntity.getDescription(),
      U_IS_ACTIVE: actionEntity.getIsActive() == true || actionEntity.getIsActive() == "true" ? 1 : 0,
      U_ACTION_MODULE: actionEntity.getModule(),
      U_UPDATE_BY: info.user_id
    }, SessionId);

    const fetched = await actions.selectActions(id,SessionId);


    let data = [];

    for await (action of fetched.value) {
      const dataValue = {};
      dataValue.id = action.U_USER_ACTIONS.Code;
      dataValue.module = action.U_USER_ACTIONS.U_ACTION_MODULE;
      dataValue.description = action.U_USER_ACTIONS.U_ACTION_DESC;
      dataValue.isActive = action.U_USER_ACTIONS.U_IS_ACTIVE == 1 ? true : false;
      dataValue.moduleName = action.U_MODULES.U_MODULE_DESC;
      data.push(dataValue);
    }

    return {
      msg: "action updated successfully",
      data
    };
  };
};

module.exports = updateActionUseCase;
