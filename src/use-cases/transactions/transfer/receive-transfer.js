const receiveTransferTransactionUseCase = ({ checks, transactions}) => {
    return async function patch(transaction,SessionId){
        //assign received by to transaction
        const receiveTransaction = await transactions.receiveTransferTransaction(transaction,SessionId)

        const fetchedChecks = await checks.getTransferredByTransactionCT(transaction.id,SessionId)
    
        let checksss = [];
        
        for await(checkss of fetchedChecks){
            const dataValue = {}
            dataValue.id = checkss.DocEntry;
            dataValue.checkNumber = checkss.LineID;
            dataValue.creationDate = checkss.CreateDate;
            dataValue.paymentDate = checkss.DueDate;
            dataValue.maturityDate =  checkss.DocDate;
            dataValue.checkAmount = checkss.CheckSum;//
            dataValue.accountName = checkss.BankCode;
            dataValue.accountNumber = checkss.AcctNum;
            dataValue.createdBy =  checkss.createdBy;
            dataValue.checkStatus = checkss.U_CHK_STATUS
            dataValue.transferId = checkss.transferId;
            dataValue.transferNumber =  checkss.U_TRANSFER_NUM;
            dataValue.transferDate = checkss.U_TRANSFER_DATE;
            dataValue.transmitter = checkss.TRANSMITTER;
            dataValue.transferredBy = checkss.transferredBy;
            dataValue.receivedBy = checkss.receivedBy;
            dataValue.CompanyName = checkss.CompanyName;


            checksss.push(dataValue)
        }
        return {
            received: {
                checks: checksss
            },
        };
    };
};

module.exports = receiveTransferTransactionUseCase;