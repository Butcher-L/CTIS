const getRoleAccessRightsUseCase = ({ accessRightsDb }) => {
    return async function getRoleAccessRights(id){
        const fetched = await accessRightsDb.getRoleAccessRights(id);
        return fetched.rows;
    }
}

module.exports = getRoleAccessRightsUseCase;
