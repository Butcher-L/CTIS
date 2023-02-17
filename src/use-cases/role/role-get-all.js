const getAllRolesUseCase = ({ accessRights, roles }) => {
    return async function getAll(SessionId){
        // const fetched = await rolesDb.getAllRoles();

        const _slFetched = await roles.getRoles(SessionId);
        // console.log(_slFetched);
        const data = [];

        // return fetched.rows
        for await(role of _slFetched.value){

            const dataValue = {};
            dataValue.id = role.Code;
            dataValue.name = role.U_ROLE_NAME;
            dataValue.isActive = role.U_IS_ACTIVE == 1 ? true : false;

            
            const fetchAccessRights = await accessRights.listAccessRightsByRole(dataValue.id,SessionId);
            // dataValue.actions = fetchAccessRights.rows;
            actions = [];
            for await (ar of fetchAccessRights.value){
                arVals = {
                    action: ar.U_USER_ACTIONS.Code,
                    id: ar.U_ROLES_ACCESS.Code,
                    isActive: ar.U_ROLES_ACCESS.U_IS_ACTIVE == 1? true: false,
                    role: ar.U_ROLES.Code
                };
                actions.push(arVals);
            }
            dataValue.actions = actions;
            data.push(dataValue);
        };

        if(!data.length){
            throw new Error('No roles found');
        }

        return data;

    };
};

module.exports = getAllRolesUseCase;