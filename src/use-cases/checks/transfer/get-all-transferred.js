const getAllTransferredUseCase = ({ checksDb, checks }) => {
    return async function get() {

        // const fetched = await checks.
        const fetched = await checksDb.getAllTransferredChecks();
        return fetched.rows;
    };
};

module.exports = getAllTransferredUseCase;