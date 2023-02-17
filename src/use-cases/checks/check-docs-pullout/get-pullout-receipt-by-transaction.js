const getPulledoutReceiptsByTransactionUseCase = ({ checksDb }) => {
    return async function get(transmittalId){
        const fetched = await checksDb.getPulledoutReceiptsByTransaction(transmittalId);
        return fetched.rows;
    };
};

module.exports = getPulledoutReceiptsByTransactionUseCase;