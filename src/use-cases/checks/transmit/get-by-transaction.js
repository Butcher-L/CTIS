const getTransmittedByTransactionUseCase = ({ checksDb }) => {
    return async function get(transmittalId, datefilter){
        const fetched = await checksDb.getTransmittedByTransaction(transmittalId, datefilter);
        return fetched.rows;
    };
};

module.exports = getTransmittedByTransactionUseCase;