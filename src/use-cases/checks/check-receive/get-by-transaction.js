const getReceivedByTransactionUseCase = ({ checksDb }) => {
    return async function get(receiveId){
        const fetched = await checksDb.getReceivedByTransaction(receiveId);
        return fetched.rows;
    };
};

module.exports = getReceivedByTransactionUseCase;