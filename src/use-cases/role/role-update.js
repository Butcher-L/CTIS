const updateRoleUseCase = ({ rolesDb, accessRightsDb, makeRole, makeAccessRights, roles, accessRights }) => {
    return async function update(info, user_id,SessionId){

        //check if values are valid
        await checkValues(roles, info,SessionId);

        //create role entity
        const roleEntity = await makeRole(info);

        //update role

        const slPatch = await roles.updateRole({
            U_ROLE_NAME: roleEntity.getName(),
            U_IS_ACTIVE: roleEntity.getIsActive() == true || roleEntity.getIsActive() == "true" ? 1 : 0,
            U_UPDATED_BY: user_id
        }, info.id,SessionId);

        if(slPatch.status !== 204){
            throw new Error('Unable to update role');
        };

        const updatedRole = {};
        const fetch = await roles.getRole(info.id,SessionId);
        
        updatedRole.id = fetch.Code;
        updatedRole.name = fetch.U_ROLE_NAME;
        updatedRole.isActive = fetch.U_IS_ACTIVE == 1 ? true : false;
     

        for await (action of info.actions){
            const accessRightEntity = await makeAccessRights({role: info.id, action: action.action, isActive: action.isActive});

            //check if access right exists
            //if exists, update
            //else, add access right
            if(action.accessRightsId){
                await accessRights.editAccessRight({
                    U_ROLE_ID: accessRightEntity.getRole(),
                    U_ROLE_ACTION: accessRightEntity.getAction(),
                    U_IS_ACTIVE: accessRightEntity.getIsActive() == true || accessRightEntity.getIsActive() == "true" ? 1 : 0,
                    U_UPDATED_BY: user_id
                }, action.accessRightsId,SessionId);
               
            }else{
                const maxCode = await accessRights.getMaxCode();
                let max = 0;
                if(maxCode.data.castmax !== null){
                    max =  maxCode.data.castmax + 1;
                }

                await accessRights.addAccessRight({
                    Code: max,
                    Name: max,
                    U_ROLE_ID: accessRightEntity.getRole(),
                    U_ROLE_ACTION: accessRightEntity.getAction(),
                    U_IS_ACTIVE: accessRightEntity.getIsActive() == true || accessRightEntity.getIsActive() == "true" ? 1 : 0,
                    U_CREATED_BY: user_id
                },SessionId);
            }
        };

        //return new values

        const patchedAR = await accessRights.listAccessRightsByRole(updatedRole.id,SessionId);
        updatedRole.actions = [];
        
        for await(ar of patchedAR.value){
            const values = {};
            values.id = ar.U_ROLES_ACCESS.Code;
            values.action = ar.U_USER_ACTIONS.Code;
            values.role = ar.U_ROLES.Code;
            values.isActive = ar.U_ROLES_ACCESS.U_IS_ACTIVE;

            updatedRole.actions.push(values);
        };

        
        
        return {
            msg: 'role updated successfully',
            role: updatedRole
        }
        
    };

    async function checkValues(roles, info,SessionId){
        if(!info.actions){
            throw new Error('Actions must be provided');
        };

        if(!Array.isArray(info.actions)){
            throw new Error('Invalid action format');
        };

        const exists = await roles.getRoleByName(info.roleName, SessionId);
        if(exists.value.length){
            throw new Error('Role name already exists');
        }

        if(!info.actions.length){
            throw new Error('No actions selected')
        }
    };
};

module.exports = updateRoleUseCase;