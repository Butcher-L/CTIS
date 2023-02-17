const getReturnedReceiptsByTransactionUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getReturnCheckReceiptsByTransaction(id);
        return fetched.rows;
    };
};

module.exports = getReturnedReceiptsByTransactionUseCase;