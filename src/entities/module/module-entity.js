const makeModuleEntity = ({}) => {
    return function makeModule({description, isActive}){
        if(!description){
            throw new Error('Please enter module description');
        };
        
        if(isActive == null){
            isActive = true;
        }

        return Object.freeze({
            getDescription: () => description,
            getIsActive: () => isActive
        });
    };
};

module.exports = makeModuleEntity;

