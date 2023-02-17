
const makeRoleUseCase = ({ makeRole, makeAccessRights, roles, accessRights }) => {
    return async function insert(info, user_id, SessionId){

        //check if values are valid
        await checkValues(roles, info, SessionId);

        //create role entity
        const roleEntity = makeRole(info);

        const maxCode = await roles.getMaxCode();   
        const max = maxCode.data.castmax + 1;

        const infos = {
            Code: max,
            Name: max,
            U_ROLE_NAME: roleEntity.getName(),
            U_IS_ACTIVE: roleEntity.getIsActive() == true || roleEntity.getIsActive() == "true" ? 1 : 0,
            U_CREATED_BY: user_id.toString()
         }

        const newRole  = await roles.addRole(infos, SessionId);
        const addRole = {};
        addRole.id = newRole.Code;
        addRole.name = newRole.U_ROLE_NAME;
        addRole.isActive = newRole.U_IS_ACTIVE == 1 ? true : false;

        if(!addRole){
            throw new Error('Unable to insert role')
        };
        

        //add access right to role
        addRole.actions = [];
        const role = addRole.id;

        for await (action of info.actions){
            const accessRightEntity = await makeAccessRights({role, action: action.id});

            const maxCode = await accessRights.getMaxCode();
            let max = 0;

            if(maxCode.data.castmax !== null){
                max =  maxCode.data.castmax + 1;
            }

            const addAccessRights = await accessRights.addAccessRight({
                Code: max,
                Name: max,
                U_ROLE_ID: accessRightEntity.getRole(),
                U_ROLE_ACTION: accessRightEntity.getAction(),
                U_IS_ACTIVE: accessRightEntity.getIsActive() == true || accessRightEntity.getIsActive() == "true" ? 1 : 0,
                U_CREATED_BY: user_id
            },SessionId);

            // console.log(addAccessRights)
            const accessRight = {};
            accessRight.id = addAccessRights.Code;
            accessRight.action = addAccessRights.U_CTIS_Action;
            accessRight.isActive = addAccessRights.U_IS_ACTIVE == 1 ? true : false;

            addRole.actions.push(accessRight);
        };

        // return values
        return {
            msg: `Created`,
            role: addRole
        }
    };

    async function checkValues(roles, info, SessionId){
        if(!info.actions){
            throw new Error('Actions must be provided');
        };

        if(!Array.isArray(info.actions)){
            throw new Error('Invalid action format');
        };

        const exists = await roles.getRoleByName(info.name, SessionId);
        if(exists.value.length){
            throw new Error('Role name already exists');
        }

        if(!info.actions.length){
            throw new Error('No actions selected');
        }
    }
};

module.exports = makeRoleUseCase;