const getVoidedCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getVoidedCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getVoidedCheckUseCase;