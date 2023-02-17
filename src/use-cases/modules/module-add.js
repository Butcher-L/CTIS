const addModuleUseCase = ({ modulesDb, makeModule, modules }) => {
    return async function add(info, SessionId){
        const moduleEntity = makeModule(info);

        const a = await modules.fix()
        const maxCode = parseInt(a.castmax)+1
        
        
        const posted = await modules.addModule({
            Code:maxCode,
            Name:maxCode,
            U_MODULE_DESC:moduleEntity.getDescription(),
            U_IS_ACTIVE: moduleEntity.getIsActive() == true || moduleEntity.getIsActive() == "true" ? 1 : 0,
            U_CREATED_BY:info.user_id,
        }, SessionId
        );

        return {
            msg:"Created Successfully",
            posted :{
                id: posted.Code,
                Name: posted.Code,
                description: posted.U_DESC,
                isActive: posted.U_IS_ACTIVE,
                createdBy: posted.U_CREATED_BY,
                updatedBy: posted.U_UPDATED_BY,
                createdDateAt: posted.U_DATE_CREATED,
                updatedTimeAt:posted.U_TIME_CREATED,
                updatedAt: posted.U_DATE_UPDATED
            }
        }
    };
};

module.exports = addModuleUseCase;