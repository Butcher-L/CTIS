const getAllAcctgGroupsUseCase = ({ userGroupsDb,  userGroups}) => {
    return async function get(SessionId){

        const fetched = await userGroups.selectAllAcctgGroups(SessionId);
        let data = [];
        
        for await(groups of fetched.value){
            const dataValue = {}
            dataValue.id = groups.Code;
            dataValue.acctgGroup = groups.U_ACCTG_GROUP;
            dataValue.isActive = groups.U_IS_ACTIVE == 1 ? true : false ;
            data.push(dataValue)
        }

        return data;
    };
};

module.exports = getAllAcctgGroupsUseCase;