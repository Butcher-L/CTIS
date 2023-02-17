const getLocationsUseCase = ({ locationsDb , locations}) => {
    return async function getAll(SessionId){

        const fetch = await locations.selectAllLocation(SessionId);

        let data = [];  

        for await(location of fetch.value){
            const dataValue = {}
            dataValue.id = location.Code;
            dataValue.Name = location.Name;
            dataValue.locationCode = location.U_LOCATION_CODE;
            dataValue.location = location.U_LOCATION;
            dataValue.isActive = location.U_IS_ACTIVE == 1 ? true : false;
            dataValue.createdBy = location.U_CREATED_BY;
            dataValue.updatedBy = location.U_UPDATED_BY;
            dataValue.createdAtDate = location.U_DATE_CREATED;
            dataValue.createdAtTime = location.U_TIME_CREATED;
            dataValue.isAutoRelease = location.U_IS_AUTO_RELEASE;
            data.push(dataValue)
        }

        return data
    };
};

module.exports = getLocationsUseCase;