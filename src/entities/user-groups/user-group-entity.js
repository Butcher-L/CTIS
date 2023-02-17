const makeUserGroupEntity = ({}) => {
    return function makeUserGroup({
        groupCode, groupDesc, locationId, acctgGroup, isActive
    }){

        if(!groupCode){
            throw new Error('Group code should be specified');
        }

        if(!locationId){
            throw new Error('Location should be specified');
        }

        if(!groupDesc){
            throw new Error('Group description should specified');
        }

        if(!acctgGroup){
            throw new Error('Group should belong to an accounting group');
        }

        if(isActive == null){
            isActive = true;
        }

        return Object.freeze({
            getGroupCode: () => groupCode,
            getGroupDesc: () => groupDesc,
            getLocationId: () => locationId,
            getAcctgGroup: () => acctgGroup,
            getIsActive: () => isActive
        })

    }
};

module.exports = makeUserGroupEntity;