const getDocsReturnTransactionUseCase = ({ checks, transactions }) => {
    return async function get(id, SessionId, data) {

        const fetchedTransaction = await transactions.getDocsReturnTransaction(id, data.company, SessionId);
        if (!fetchedTransaction.length) {
            throw new Error('Transaction not found.')
        }


        let transaction = [];

        for await (transactionss of fetchedTransaction) {
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.returnNumber = transactionss.U_RETURN_NUM;
            dataValue.returnedBy = transactionss.U_RETURNED_BY;
            dataValue.returnTo = transactionss.U_RETURNED_TO;
            dataValue.description = transactionss.U_DESC;
            dataValue.returnDate = transactionss.U_RETURN_DATE;
            dataValue.isPosted = transactionss.U_IS_POSTED;
            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.actualCount = transactionss.actualCount;
            dataValue.actualAmount = transactionss.actualAmount;
            dataValue.returnedByName = transactionss.returnedByName;
            dataValue.returnToName = transactionss.returnToName;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
            dataValue.receiptNumber = transactionss.U_RCPT_NUM;
            dataValue.releaserGroup = transactionss.releaserGroup;
            dataValue.CompanyName = transactionss.CompanyName;

            transaction.push(dataValue)
        }

        const fetchedChecks = await checks.getReturnedDocsByTransaction(id, SessionId, data)

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
            dataValue.description = checkss.Comments;
            dataValue.returnDate = checkss.U_RETURN_DATE;
            dataValue.isPosted = checkss.U_IS_POSTED;
            dataValue.voucherNo = checkss.Vouchers;
            dataValue.payee = checkss.U_APP_PayeeName != null ? checkss.U_APP_PayeeName : checkss.CardName;
            dataValue.CompanyName = checkss.CompanyName;

            checksss.push(dataValue)
        }
        return {
            transaction: {
                details: transaction[0],
                checks: checksss
            },
        };
    };
};

module.exports = getDocsReturnTransactionUseCase;