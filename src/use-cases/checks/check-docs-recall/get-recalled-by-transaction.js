const getRecalledByTransactionUseCase = ({ checksDb }) => {
    return async function get(transmittalId){
        const fetched = await checksDb.getRecalledByTransaction(transmittalId);
        return fetched.rows;
    };
};

module.exports = getRecalledByTransactionUseCase;