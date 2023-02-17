const makeRoleEntity = ({}) => {
    return function makeRole({ name, isActive }){
        if(!name){
            throw new Error('Please enter role name');
        };

        if(isActive == null){
            isActive = true;
        }

        
        return Object.freeze({
            getName: () => name,
            getIsActive: () => isActive
        });
    };
};

module.exports = makeRoleEntity;