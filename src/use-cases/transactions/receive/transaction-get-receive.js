const getReceiveTransactionUseCase = ({ transactions ,checks }) => {
    return async function get(id,SessionId,data){

        const fetchedTransaction = await transactions.getReceiveTransaction(id,SessionId)
        
        if(!fetchedTransaction.length){
            throw new Error('Transaction not found.')
        }
        
        let transaction = [];
        
        for await(transactionss of fetchedTransaction){
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.receiveNumber = transactionss.U_RCV_NUM;
            dataValue.receiveDescription = transactionss.U_DESC;
            dataValue.receiveDate =  transactionss.U_RCV_DATE;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.releaser = transactionss.U_RELEASER;
            dataValue.isPosted =  transactionss.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount =  transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.actualCount = transactionss.actualCount;
            dataValue.actualAmount =  transactionss.actualAmount;
            dataValue.receiveByName = transactionss.receiveByName;
            dataValue.releaserName = transactionss.releaserName;
            dataValue.releaserGroup = transactionss.releaserGroup;
            dataValue.CheckNum = transactionss.CheckNum;
            dataValue.CompanyName = transactionss.CompanyName;

            transaction.push(dataValue)
        }

        const fetchedChecks = await checks.getReceivedByTransaction(id,SessionId,data)

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
            dataValue.createdBy =  checkss.createdBy;
            dataValue.checkStatus = checkss.U_CHK_STATUS;
            dataValue.receivedId = checkss.receivedId;
            dataValue.receiveNumber =  checkss.U_RCV_NUM;
            dataValue.receiveDate = checkss.U_RCV_DATE;
            dataValue.receivedByName = checkss.receivedByName;
            dataValue.releaserName = checkss.releaserName;
            dataValue.payee =  checkss.U_APP_PayeeName!=null ? checkss.U_APP_PayeeName : checkss.CardName;
            dataValue.voucher = checkss.Vouchers;
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

module.exports = getReceiveTransactionUseCase;