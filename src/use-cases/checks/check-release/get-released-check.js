const getReleasedCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getReleasedCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getReleasedCheckUseCase;