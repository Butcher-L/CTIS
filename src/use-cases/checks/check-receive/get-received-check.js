const getReceivedCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getReceivedCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getReceivedCheckUseCase;