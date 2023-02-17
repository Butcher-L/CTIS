const getRecalledReceiptsByTransactionUseCase = ({ checksDb }) => {
    return async function get(transmittalId){
        const fetched = await checksDb.getRecalledReceiptsByTransaction(transmittalId);
        return fetched.rows;
    };
};

module.exports = getRecalledReceiptsByTransactionUseCase;