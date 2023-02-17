const getAllTransmittedUseCase = ({ checksDb }) => {
    return async function get(){
        const fetched = await checksDb.getAllTransmittedChecks();
        return fetched.rows;
    };
};

module.exports = getAllTransmittedUseCase;