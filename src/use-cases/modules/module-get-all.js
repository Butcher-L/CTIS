const getAllModulesUseCase = ({ modulesDb, modules }) => {
    return async function getAll(SessionId){

        const sl_getAllModule = await modules.selectAllModules(SessionId);

        let data = [];

        for await(module of sl_getAllModule){
            const dataValue = {}
            dataValue.id = module.Code;
            dataValue.description = module.U_MODULE_DESC;
            dataValue.isActive = module.U_IS_ACTIVE == 1 ? true : false;
            data.push(dataValue)
        }

        return data

        // const fetched = await modulesDb.getAllModules();
        // return fetched.rows
    };
};

module.exports = getAllModulesUseCase;