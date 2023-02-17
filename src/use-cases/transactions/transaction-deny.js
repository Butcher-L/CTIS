const denyTransactionUseCase = ({ transactions }) => {
    return async function patch(transaction,SessionId){

        switch(transaction.transaction){
            case 'transfer':
                transaction.transaction = 'U_CHK_TRANSFER';
                break;
            case 'transmit':
                transaction.transaction = 'U_CHK_TRANSMIT';
                break;
            case 'receive':
                transaction.transaction = 'U_CHK_RECEIVE';
                break;
            case 'return':
                transaction.transaction = 'U_CHK_RETURN';
        }

        const denyTransaction = await transactions.denyTransaction(transaction,SessionId);
        // const denied = denyTransaction.rows;
        
        if(denyTransaction.success == false){
            throw new Error('Unable to deny transaction');
        };

        return {
            msg: `transaction has been denied`
        }
    }
}

module.exports = denyTransactionUseCase;