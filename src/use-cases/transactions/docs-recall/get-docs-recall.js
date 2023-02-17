const getDocsRecallTransactionUseCase = ({ transactions, checks }) => {
    return async function get(id,SessionId){
        
        const fetchedTransaction = await transactions.getDocsRecallTransaction(id,SessionId);
    
        if(!fetchedTransaction.length){
            throw new Error('Transaction not found.')
        }


        let transaction = [];
        
        for await(transactionss of fetchedTransaction){
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.recallNumber = transactionss.U_RECALL_NUM;
            dataValue.recallTo = transactionss.U_RECALL_TO;
            dataValue.description =  transactionss.U_DESC;
            dataValue.receiptDate = transactionss.U_RECALL_DATE;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.isPosted =  transactionss.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount =  transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.actualCount =  transactionss.U_CONTROL_COUNT;
            dataValue.actualAmount = transactionss.actualCount;
            dataValue.recallToName = transactionss.recallToName;
            dataValue.receivedByName =  transactionss.receivedByName;
            dataValue.recallBy = transactionss.U_RECALLED_BY;
            dataValue.recallByName = transactionss.recallByName;
            dataValue.receiptNumber = transactionss.U_RCPT_NUM;
            dataValue.cmtGroup = transactionss.cmtGroup;
            dataValue.CompanyName = transactionss.CompanyName;




            transaction.push(dataValue)
        }

        const fetchedChecks = await checks.getRecalledByTransaction(id,SessionId);

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
            dataValue.recallId = checkss.recallId;
            dataValue.recallNumber =  checkss.U_RECALL_NUM;
            dataValue.description = check.Comments;
            dataValue.receiptDate = checkss.U_RECALL_DATE;
            dataValue.isPosted = checkss.U_IS_POSTED == 1 ? true : false;
            dataValue.recallTo = checkss.U_RECALL_TO;
            dataValue.recallToName =  checkss.recallToName;
            dataValue.receivedBy = checkss.U_RCVD_BY;
            dataValue.receivedByName = checkss.receivedByName;
            dataValue.recallReceiptId = checkss.recallReceiptId;
            dataValue.recallReceiptNumber = checkss.U_RECALL_RCPT_NUM;
            dataValue.recallReceiptDesc =  checkss.recallReceiptDesc;
            dataValue.recallReceiptDate = checkss.recallReceiptDate;
            dataValue.isPostedRecallReceipt = checkss.isPostedRecallReceipt;
            dataValue.recallReceivedFrom = checkss.recallReceivedFrom;
            dataValue.recallReceivedBy = checkss.recallReceivedBy;
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

module.exports = getDocsRecallTransactionUseCase;