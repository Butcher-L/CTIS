const updateModuleUseCase = ({ modulesDb, makeModule, modules }) => {
    return async function update(id, info, SessionId){
        const moduleEntity = await makeModule(info);

        const patch = await modules.updateModule({
            Code: id,
            U_MODULE_DESC: moduleEntity.getDescription(),
            U_IS_ACTIVE: moduleEntity.getIsActive()  == "true" ? 1 : 0,
            U_UPDATED_BY: info.user_id
        }, SessionId);

        const select = await modules.selectModules(id, SessionId)

        let data = [];

        for await(module of select.value){
            const dataValue = {}
            dataValue.id = module.Code;
            dataValue.description = module.U_MODULE_DESC;
            dataValue.isActive = module.U_IS_ACTIVE == 1 ? true : false;
            data.push(dataValue)
        }

        return {
            msg: "Updated successfully",
            data
        }
        

        // const patch = await modulesDb.updateModule(
        //     moduleEntity.getDescription(),
        //     moduleEntity.getIsActive(),
        //     id,
        //     info.user_id
        // );

        // return {
        //     ...patch.rows[0]
        // };
    };
};

module.exports = updateModuleUseCase;