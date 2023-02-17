const makeActionEntity = ({}) => {
    return function makeAction({module, description, isActive}){
        
        if(!module){
            throw new Error('Please select module');
        };

        if(isNaN(module)){
            throw new Error('Module id should be an integer')
        }
        
        if(!description){
            throw new Error('Please enter action description');
        };

        if(isActive == null){
            isActive = true;
        }

        return Object.freeze({
            getModule: () => module,
            getDescription: () => description,
            getIsActive: () => isActive
        });
    };
};

module.exports = makeActionEntity;