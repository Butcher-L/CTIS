const makeLocationEntity = ({}) => {
    return function makeModule({locationCode, location, isActive}){
        if(!locationCode){
            throw new Error('Please enter location code');
        };

        if(!location){
            throw new Error('Please enter location description');
        };

        if(isActive == null){
            isActive = true;
        }

        return Object.freeze({
            getLocationCode: () => locationCode,
            getLocation: () => location,
            getIsActive: () => isActive
        });
    };
};

module.exports = makeLocationEntity;