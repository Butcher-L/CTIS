const getAllReturnedUseCase = ({ checksDb }) => {
    return async function get(){
        const fetched = await checksDb.getAllReturnedChecks();
        return fetched.rows;
    };
};

module.exports = getAllReturnedUseCase;