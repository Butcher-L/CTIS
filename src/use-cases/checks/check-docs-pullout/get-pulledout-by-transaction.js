const getPulledoutByTransactionUseCase = ({ checksDb }) => {
    return async function get(transmittalId){
        const fetched = await checksDb.getPulledoutByTransaction(transmittalId);
        return fetched.rows;
    };
};

module.exports = getPulledoutByTransactionUseCase;