const getLocationUseCase = ({ locationsDb , locations}) => {
    return async function getOne(id,SessionId){

        const fetched = await locations.selectLocations(id,SessionId)

        let data = [];  
        const dataValue = {}
        dataValue.id = fetched.Code;
        dataValue.Name = fetched.Name;
        dataValue.locationCode = fetched.U_LOCATION_CODE;
        dataValue.location = fetched.U_LOCATION;
        dataValue.isActive = fetched.U_IS_ACTIVE == 1 ? true : false ;
        dataValue.isAutoRelease = fetched.U_IS_AUTO_RELEASE;
        data.push(dataValue)


        return data
    };
};

module.exports = getLocationUseCase;