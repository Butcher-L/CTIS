const getPulledoutCheckReceiptsUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getPulledoutCheckReceiptsDetails(id);
        return fetched.rows;
    };
};

module.exports = getPulledoutCheckReceiptsUseCase;