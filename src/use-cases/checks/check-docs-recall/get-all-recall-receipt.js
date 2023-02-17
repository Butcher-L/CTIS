const getAllRecalledCheckReceiptsUseCase = ({ checksDb }) => {
    return async function get(){
        const fetched = await checksDb.getAllRecalledCheckReceiptsChecks();
        return fetched.rows;
    };
};

module.exports = getAllRecalledCheckReceiptsUseCase;