const updateActionUseCase = ({ locationsDb, makeLocation, locations }) => {
  return async function update(id, info,SessionId) {
    const locationEntity = await makeLocation(info);

    const patch = await locations.updateLocations({
      Code: id,
      Name: id,
      U_LOCATION_CODE: locationEntity.getLocationCode(),
      U_LOCATION: locationEntity.getLocation(),
      U_IS_ACTIVE: locationEntity.getIsActive() == true || locationEntity.getIsActive() == "true" ? 1 : 0,
      U_UPDATED_BY: info.user_id,
      U_IS_AUTO_RELEASE:info.isAutoRelease,
    },SessionId);
    const fetched = await locations.selectLocations(id,SessionId);

    let data = [];
    
    const dataValue = {};
    dataValue.id = fetched.Code;
    dataValue.Name = fetched.Name;
    dataValue.locationCode = fetched.U_LOCATION_CODE;
    dataValue.location = fetched.U_LOCATION;
    dataValue.isActive = fetched.U_IS_ACTIVE == 1 ? true : false;
    dataValue.isAutoRelease = fetched.U_IS_AUTO_RELEASE
    data.push(dataValue);

    return {
      msg: "Location updated successfully",
      data
    };
  };
};

module.exports = updateActionUseCase;
