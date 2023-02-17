const unpostReceiveTransaction = ({ transactions }) => {
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

        console.log(transaction);
        // throw new Error("WE")
        const denyTransaction = await transactions.unpostReceiveTransaction(transaction,SessionId);
        // const denied = denyTransaction.rows;
        
        if(denyTransaction.success == false){
            throw new Error('Unable to unpost-receive transaction');
        };

        return {
            msg: `transaction has been unpost-receive`
        }
    }
}

module.exports = unpostReceiveTransaction;