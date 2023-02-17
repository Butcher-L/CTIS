const addLocationUseCase = ({ locationsDb, makeLocation, locations }) => {
    return async function add(info,SessionId){
        const locationEntity = makeLocation(info);

        const a = await locations.fix()

        const maxCode = parseInt(a.castmax)+1

        const locationExist = await locations.checkIfExist(locationEntity.getLocation(),SessionId)
        if(locationExist.value.length != 0){
            throw new Error('Location already exists');
        }

        
        const posted = await locations.addLocations({
            Code:maxCode,
            Name:maxCode,
            U_LOCATION_CODE: locationEntity.getLocationCode(),
            U_LOCATION: locationEntity.getLocation(),
            U_IS_ACTIVE: locationEntity.getIsActive() == true ? 1 : 0,
            U_CREATED_BY: info.user_id,
            U_IS_AUTO_RELEASE:info.isAutoRelease
         },SessionId);

         return {
            msg:"Created Successfully",
            id: posted.Code,
            Name: posted.Code,
            locationCode:posted.U_LOCATION_CODE,
            location: posted.U_LOCATION,
            isActive: posted.U_IS_ACTIVE,
            isAutoRelease: posted.U_IS_AUTO_RELEASE
        }
    };
};

module.exports = addLocationUseCase;