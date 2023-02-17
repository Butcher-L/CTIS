const makeAccessRightEntity = ({}) => {
    return function makeAccessRight({action, role, isActive}){
        if(!action){
            throw new Error('action should not be empty');
        };

        if(!role){
            throw new Error('role should not be empty');
        };

        if(isNaN(action)){
            throw new Error('action id should be an integer');
        };

        if(isNaN(role)){
            throw new Error('role id should be an integer');
        };

        if(isActive == null){
            isActive = true;
        }

        return Object.freeze({
            getAction : () => action,
            getRole : () => role,
            getIsActive: () => isActive
        });
    };
};

module.exports = makeAccessRightEntity;