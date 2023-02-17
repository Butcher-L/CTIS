const getRoleUseCase = ({ roles }) => {
    return async function getOne(id,SessionId){
        // const fetched = await rolesDb.getRole(id);

        const updatedRole = {};
        const fetch = await roles.getRole(id,SessionId);
        
        updatedRole.id = fetch.Code;
        updatedRole.name = fetch.U_ROLE_NAME;
        updatedRole.isActive = fetch.U_IS_ACTIVE == 1 ? true : false;

        return updatedRole;
    };
};

module.exports = getRoleUseCase;