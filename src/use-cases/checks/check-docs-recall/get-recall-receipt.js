const getRecalledCheckReceiptsUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getRecalledCheckReceiptsDetails(id);
        return fetched.rows;
    };
};

module.exports = getRecalledCheckReceiptsUseCase;