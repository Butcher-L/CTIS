const updateUserGroupUseCase = ({
  userGroupsDb,
  makeUserGroup,
  userGroups
}) => {
  return async function update(id, info,SessionId) {
    const userGroupEntity = await makeUserGroup(info);

    const patch = await userGroups.updateUserGroups({
      Code: id,
      Name: id,
      U_GROUP_CODE: userGroupEntity.getGroupCode(),
      U_GROUP_DESC: userGroupEntity.getGroupDesc(),
      U_LOCATION_ID: userGroupEntity.getLocationId(),
      U_ACCTG_GROUP: userGroupEntity.getAcctgGroup(),
      U_IS_ACTIVE: userGroupEntity.getIsActive() == true || userGroupEntity.getIsActive() == "true" ? 1 : 0,
      U_UPDATED_BY: info.user_id
    },SessionId);

    const fetched = await userGroups.selectUserGroups(id, SessionId);

    let data = [];
    // console.log(fetched);

    for await (groups of fetched.value) {
      const dataValue = {};
      dataValue.id = groups.U_USER_GROUPS.Code;
      dataValue.groupCode = groups.U_USER_GROUPS.U_GROUP_CODE;
      dataValue.groupDesc = groups.U_USER_GROUPS.U_GROUP_DESC;
      dataValue.locationId = groups.U_USER_GROUPS.U_LOCATION_ID;
      dataValue.acctgGroup = groups.U_USER_GROUPS.U_ACCTG_GROUP;
      dataValue.isActive = groups.U_USER_GROUPS.U_IS_ACTIVE == 1 ? true : false;
      dataValue.createdBy = groups.U_USER_GROUPS.U_CREATED_BY;
      dataValue.updatedBy = groups.U_USER_GROUPS.U_UPDATED_BY;
      dataValue.locationCode = groups.U_LOCATIONS.U_LOCATION_CODE;
      dataValue.location = groups.U_LOCATIONS.U_LOCATION;
      dataValue.acctgGroupName = groups.U_ACCTG_GROUPS.U_ACCTG_GROUP;
      data.push(dataValue);
    }

    return {
        msg: "User group updated successfully",
        data
      };
    // const patch = await userGroupsDb.updateUserGroup({
    //     groupCode: userGroupEntity.getGroupCode(),
    //     groupDesc: userGroupEntity.getGroupDesc(),
    //     locationId: userGroupEntity.getLocationId(),
    //     acctgGroup: userGroupEntity.getAcctgGroup(),
    //     isActive: userGroupEntity.getIsActive(),
    //     id,
    //     user_id: info.user_id
    //  });

    
  };
};

module.exports = updateUserGroupUseCase;
