const getUserGroupUseCase = ({ userGroupsDb ,userGroups}) => {
    return async function get(id,SessionId){

        const fetched = await userGroups.selectUserGroups(id,SessionId)

        let data = [];

        for await(groups of fetched.value){
            const dataValue = {}
            dataValue.id = groups.U_USER_GROUPS.Code;
            dataValue.groupCode = groups.U_USER_GROUPS.U_GROUP_CODE;
            dataValue.groupDesc = groups.U_USER_GROUPS.U_GROUP_DESC;
            dataValue.locationId = groups.U_USER_GROUPS.U_LOCATION_ID;
            dataValue.acctgGroup = groups.U_USER_GROUPS.U_ACCTG_GROUP;
            dataValue.isActive = groups.U_USER_GROUPS.U_IS_ACTIVE == 1 ? true : false ;
            dataValue.locationCode = groups.U_LOCATIONS.U_LOCATION_CODE;
            dataValue.location = groups.U_LOCATIONS.U_LOCATION;
            dataValue.acctgGroupName = groups.U_ACCTG_GROUPS.U_ACCTG_GROUP;
            data.push(dataValue)
        }

        return data
        // const fetched = await userGroupsDb.getUserGroup(id);
        // return fetched.rows[0];
    };
};

module.exports = getUserGroupUseCase;