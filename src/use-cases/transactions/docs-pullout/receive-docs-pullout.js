const receiveDocsReturnTransactionUseCase = ({ transactionsDb, checksDb }) => {
    return async function patch(transaction){
        //assign received by to transaction
        const returnTransaction = await transactionsDb.receiveDocsRecallTransaction(transaction);


        const fetchedChecks = await checksDb.getRecalledByTransaction(transaction.id);
        checks = fetchedChecks.rows;

        return {
            received: {
                checks: checks
            },
        };
    };
};

module.exports = receiveDocsReturnTransactionUseCase