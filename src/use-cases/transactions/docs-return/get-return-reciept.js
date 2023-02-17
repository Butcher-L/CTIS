const getReturnReceiptUseCase = ({ transactions, checks }) => {
    return async function get(info,SessionId){
        const fetchedTransaction = await transactions.getReturnReceipt(info,SessionId);

        if(!fetchedTransaction.length){
            throw new Error('Transaction not found.')
        }

        let transaction = [];
        for await(transactionss of fetchedTransaction){
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.returnReceiptNumber = transactionss.U_RETURN_RCPT_NUM;
            dataValue.receivedFrom = transactionss.U_RCVD_FROM;
            dataValue.description = transactionss.U_DESC;
            dataValue.receiptDate =  transactionss.U_RCPT_DATE;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false ;
            dataValue.controlCount =  transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount =  transactionss.U_CONTROL_AMT;
            dataValue.actualCount = transactionss.actualCount;
            dataValue.actualAmount = transactionss.actualAmount;
            dataValue.receivedFromName =  transactionss.receivedFromName;
            dataValue.receivedByName = transactionss.receivedByName;
            dataValue.transmittingGroup = transactionss.transmittingGroup;
            dataValue.CheckNum=transactionss.CheckNum;
            dataValue.CompanyName = transactionss.CompanyName;
            
            transaction.push(dataValue)
        }
        
        const fetchedChecks = await checks.getReturnCheckReceiptsByTransaction(info,SessionId);

         let check = [];

        for await(checksss of fetchedChecks){
            const dataValue = {}
            dataValue.id = {DocEntry:checksss.DocEntry, LineNuM:checksss.LineID}
            dataValue.checkNumber = checksss.CheckNum;
            dataValue.creationDate = checksss.CreateDate;
            dataValue.paymentDate = checksss.DocDate;
            dataValue.maturityDate =  checksss.DueDate;
            dataValue.checkAmount = checksss.CheckSum;
            dataValue.checkStatus = checksss.U_CHK_STATUS ;
            dataValue.releaseDate =  checksss.U_RELEASE_DATE;
            dataValue.releasedTo =  checksss.U_RELEASED_TO;
            dataValue.releasedToEmail = checksss.U_RELEASES_TO_EMAIL;
            dataValue.releasedToContactNumber = checksss.U_RELEASED_CONTACT_NUM;
            dataValue.releasedById =  checksss.releasedById;
            dataValue.releasedBy = checksss.releasedBy;
            dataValue.accountName = checksss.BankCode;
            dataValue.accountNumber =  checksss.AcctNum;
            dataValue.createdBy = checksss.createdBy;
            dataValue.returnNumber =  checksss.returnNumber;
            dataValue.returnReceipt = checksss.returnReceipt;
            dataValue.description =  checksss.Comments;
            dataValue.isPosted = checksss.U_IS_POSTED == 1 ? true : false ;
            dataValue.payee =  checksss.U_APP_PayeeName!=null ? checksss.U_APP_PayeeName : checksss.CardName;
            dataValue.voucherNo = checksss.Vouchers;
            dataValue.CompanyName = checksss.CompanyName;
            
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

module.exports = getReturnReceiptUseCase;