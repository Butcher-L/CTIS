const getModuleUseCase = ({ modulesDb, modules }) => {
    return async function getOne(id, SessionId){

        const sl_getModule = await modules.selectModules(id, SessionId)

        let data = [];

        for await(module of sl_getModule.value){
            const dataValue = {}
            dataValue.id = module.Code;
            dataValue.description = module.U_MODULE_DESC;
            dataValue.isActive = module.U_IS_ACTIVE == 1 ? true : false;
            data.push(dataValue)
        }
        
        return data
        // const fetched = await modulesDb.getModule(id);
        // return fetched.rows;
    };
};

module.exports = getModuleUseCase;