const getDocsPulloutTransactionUseCase = ({ transactions, checks}) => {
    return async function get(id,SessionId){
        const fetchedTransaction = await transactions.getDocsPulloutTransaction(id,SessionId);

        if(!fetchedTransaction.length){
            throw new Error('Transaction not found.')
        }
        
        let transaction = [];
        for await(transactionss of fetchedTransaction){
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.pullOutNumber = transactionss.U_PULLOUT_NUM;
            dataValue.pullOutTo = transactionss.U_PULLOUT_TO;
            dataValue.description = transactionss.U_DESC;
            dataValue.pullOutDate = transactionss.U_PULLOUT_DATE;
            dataValue.pullOutBy =  transactionss.U_PULLOUT_BY;
            dataValue.isPosted =  transactionss.U_IS_POSTED  == 1 ? true : false;
            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.actualCount =  transactionss.actualCount;
            dataValue.actualAmount = transactionss.actualAmount;
            dataValue.pullOutToName = transactionss.pullOutToName;
            dataValue.pullOutByName = transactionss.pullOutByName;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.receiptNumber = transactionss.U_RCPT_NUM;
            dataValue.releasingGroup = transactionss.releasingGroup;
            dataValue.CompanyName = transactionss.CompanyName;

            transaction.push(dataValue)
        }

        const fetchedChecks = await checks.getPulledoutByTransaction(id,SessionId);
        let check = [];
        for await(checkss of fetchedChecks){
            const dataValue = {}
            dataValue.id ={DocEntry:checkss.DocEntry, LineNum:checkss.LineID} ;
            dataValue.checkNumber = checkss.CheckNum;
            dataValue.creationDate = checkss.CreateDate;
            dataValue.paymentDate =  checkss.DocDate;
            dataValue.maturityDate = checkss.DueDate;
            dataValue.checkAmount = checkss.CheckSum;
            dataValue.accountName = checkss.BankCode;
            dataValue.accountNumber =  checkss.AcctNum;
            dataValue.createdBy =  checkss.U_NAME;
            dataValue.checkStatus = checkss.U_CHK_STATUS;
            dataValue.pulloutId = checkss.pulloutId;
            dataValue.pullOutNumber =  checkss.U_PULLOUT_NUM;
            dataValue.description=checkss.Comments;
            dataValue.pullOutDate = checkss.U_PULLOUT_DATE;
            dataValue.isPostedPullOut = checkss.isPostedPullOut == 1 ? true : false;
            dataValue.releasingLocation = checkss.U_RELEASING_LOC;
            dataValue.pullOutBy=checkss.pullOutBy;
            dataValue.pullOutTo = checkss.pullOutTo;
            dataValue.pulloutReceiptId = checkss.pulloutReceiptId;
            dataValue.receiptNumber = checkss.U_PULLOUT_RCPT_NUM;
            dataValue.receiptDesc=checkss.receiptDesc;
            dataValue.receiptDate = checkss.U_RCPT_DATE;
            dataValue.isPostedReceipt = checkss.isPostedReceipt;
            dataValue.receivedById = checkss.receivedById;
            dataValue.receivedBy = checkss.receivedBy;
            dataValue.payee =  checkss.U_APP_PayeeName!=null ? checkss.U_APP_PayeeName : checkss.CardName;
            dataValue.voucherNo = checkss.Vouchers;
            dataValue.CompanyName = checkss.CompanyName;

            check.push(dataValue)
        }

        return {
            transaction: {
                details: transaction[0],
                checks: check        
            },
        };

    };
};

module.exports = getDocsPulloutTransactionUseCase;