const addUserGroupUseCase = ({ userGroupsDb, makeUserGroup ,userGroups}) => {
    return async function add(info,SessionId){

        const a = await userGroups.fix()
        const maxCode = parseInt(a.castmax) + 1

        const userGroupEntity = makeUserGroup(info);

        const posted = await userGroups.addUserGroups({
            Code:maxCode,
            Name:maxCode,
            U_GROUP_CODE: userGroupEntity.getGroupCode(),
            U_GROUP_DESC: userGroupEntity.getGroupDesc(),
            U_LOCATION_ID: userGroupEntity.getLocationId(),
            U_ACCTG_GROUP: userGroupEntity.getAcctgGroup(),
            U_IS_ACTIVE: userGroupEntity.getIsActive() == true || userGroupEntity.getIsActive() == "true" ? 1 : 0,
            U_CREATED_BY: info.user_id
        },SessionId)
        
        return {
            msg:"Created Successfully",
            posted :{
                id: posted.Code,
                Name: posted.Code,
                groupCode:posted.U_GROUP_CODE,
                groupDesc: posted.U_GROUP_DESC,
                locationId: posted.U_LOCATION_ID,
                acctgGroup: posted.U_ACCTG_GROUP,
                isActive: posted.U_IS_ACTIVE
            }
        }

    };
};

module.exports = addUserGroupUseCase;