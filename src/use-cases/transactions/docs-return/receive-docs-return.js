const receiveDocsReturnTransactionUseCase = ({ transactions, checks }) => {
    return async function patch(transaction, SessionId, data) {
        //assign received by to transaction

        const returnTransaction = await transactions.receiveDocsReturnTransaction(transaction, SessionId)
        const fetchedChecks = await checks.getReturnedByTransaction(transaction.id, SessionId, data);

        let checksss = [];
        for await (checkss of fetchedChecks) {
            const dataValue = {}

            dataValue.id = { DocEntry: checkss.DocEntry, LineNum: checkss.LineID };
            dataValue.checkNumber = checkss.CheckNum;
            dataValue.creationDate = checkss.CreateDate;
            dataValue.paymentDate = checkss.DocDate;
            dataValue.maturityDate = checkss.DueDate;
            dataValue.checkAmount = checkss.CheckSum;
            dataValue.checkStatus = checkss.U_CHK_STATUS;
            dataValue.releaseDate = checkss.U_RELEASE_DATE;
            dataValue.releasedTo = checkss.U_RELEASED_TO;
            dataValue.releasedToEmail = checkss.U_RELEASES_TO_EMAIL;
            dataValue.releasedToContactNumber = checkss.U_RELEASED_CONTACT_NUM;
            dataValue.releasedById = checkss.releasedById;
            dataValue.releasedBy = checkss.releasedBy;
            dataValue.accountName = checkss.BankCode;
            dataValue.accountNumber = checkss.AcctNum;
            dataValue.createdBy = checkss.createdBy;
            dataValue.returnNumber = checkss.returnNumber;
            dataValue.returnReceipt = checkss.returnReceipt;
            dataValue.docsReturnId = checkss.docsReturnId;
            dataValue.checkReturnNumber = checkss.checkReturnNumber;
            dataValue.returnedByName = checkss.returnedByName;
            dataValue.returnToName = checkss.returnToName;
            dataValue.description = checkss.U_DESC;
            dataValue.returnDate = checkss.U_RETURN_DATE;
            dataValue.isPosted = checkss.U_IS_POSTED;
            dataValue.voucherNo = checkss.Vouchers;
            dataValue.payee = checksss.U_APP_PayeeName != null ? checksss.U_APP_PayeeName : checksss.CardName;
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

module.exports = receiveDocsReturnTransactionUseCase;