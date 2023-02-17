const getRecalledCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getRecalledCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getRecalledCheckUseCase;