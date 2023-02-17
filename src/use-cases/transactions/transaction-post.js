const postTransactionUseCase = ({ transactionsDb }) => {
    return async function update(info){
        const postTransaction = await transactionsDb.postTransaction({
            transaction: info.transaction,
            id: info.id
        });
        return {
            msg: 'transaction has been saved and posted'
        };
    }
};

module.exports = postTransactionUseCase;