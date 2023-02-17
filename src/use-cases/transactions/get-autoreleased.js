const getAutoReleased = ({ transactionsDb, transactions, checks, moment }) => {
    return async function fetch(info, SessionId) {
        if (!info.id || !info.company) { throw new Error(`Must have id and company name.`) };

        const AutoReleasedCheck = await checks.getAutoReleaseChecks(
            info.id,
            info.company, SessionId);


        const AutoReleasedTransaction = await transactions.getAutoReleaseTrans(info.id,
            info.company, SessionId);


        let transaction = [];
        const cheque = [];
        for await (AutoReleasedChecks of AutoReleasedCheck) {
            const dataValue = {}
            dataValue.id = { DocEntry: AutoReleasedChecks.DocEntry, LineNum: AutoReleasedChecks.LineID };
            dataValue.checkNumber = AutoReleasedChecks.CheckNum;
            dataValue.createdBy = AutoReleasedChecks.createdBy;
            dataValue.creationDate = AutoReleasedChecks.CreateDate;
            dataValue.paymentDate = AutoReleasedChecks.DocDate;
            dataValue.maturityDate = AutoReleasedChecks.DueDate;
            dataValue.checkAmount = AutoReleasedChecks.CheckSum;
            dataValue.payee = AutoReleasedChecks.U_APP_PayeeName != null ? AutoReleasedChecks.U_APP_PayeeName : AutoReleasedChecks.CardName;
            dataValue.accountName = AutoReleasedChecks.BankCode;
            dataValue.accountNumber = AutoReleasedChecks.AcctNum;
            dataValue.voucherNo = AutoReleasedChecks.Vouchers;
            dataValue.transferId = AutoReleasedChecks.transferId;
            dataValue.transferNumber = AutoReleasedChecks.U_TRANSFER_NUM;
            dataValue.transferDate = AutoReleasedChecks.U_TRANSFER_DATE;
            dataValue.transmitter = AutoReleasedChecks.TRANSMITTER;
            dataValue.transferredBy = AutoReleasedChecks.transferredBy;
            dataValue.receivedBy = AutoReleasedChecks.receivedBy;
            dataValue.description = AutoReleasedChecks.Comments;
            dataValue.companyName = AutoReleasedChecks.CompanyName;
            dataValue.voucherDate = AutoReleasedChecks.VoucherDate;
            cheque.push(dataValue);
        }

        for await (AutoReleasedTransactions of AutoReleasedTransaction) {
            const dataValue = {}
            dataValue.autoReleasedCode = AutoReleasedTransactions.U_TRANSMIT_NUM;
            dataValue.id = AutoReleasedTransactions.Code;
            dataValue.transmittalNumber = AutoReleasedTransactions.U_TRANSMIT_NUM;
            dataValue.specificReleaser = AutoReleasedTransactions.U_SPCFC_RELEASER;
            dataValue.autoReceiveBy = AutoReleasedTransactions.U_AUTO_RCVD_BY;
            dataValue.autoReleaseBy = AutoReleasedTransactions.transmittedByName;
            dataValue.transmittalDate = AutoReleasedTransactions.U_TRANSMIT_DATE;
            dataValue.transmittedBy = AutoReleasedTransactions.U_TRANSMIT_BY;
            dataValue.isPosted = AutoReleasedTransactions.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = AutoReleasedTransactions.U_CONTROL_COUNT;
            dataValue.controlAmount = AutoReleasedTransactions.U_CONTROL_AMT;
            dataValue.description = AutoReleasedTransactions.U_DESC;
            dataValue.denied = AutoReleasedTransactions.U_DENIED == 1 ? true : false;
            dataValue.actualCount = AutoReleasedTransactions.actualCount;
            dataValue.actualAmount = AutoReleasedTransactions.actualAmount;
            dataValue.specificReleaserName = AutoReleasedTransactions.specificReleaserName;
            dataValue.autoReceiveByName = AutoReleasedTransactions.autoReceiveByName;
            dataValue.autoReleaseByName = AutoReleasedTransactions.autoReleaseByName;
            dataValue.transmittedByName = AutoReleasedTransactions.transmittedByName;
            dataValue.receivedBy = AutoReleasedTransactions.U_RCVD_BY;
            dataValue.receivedByName = AutoReleasedTransactions.receivedByName;
            dataValue.releasingLocationName = AutoReleasedTransactions.U_LOCATION;
            dataValue.transmittingGroup = AutoReleasedTransactions.U_GROUP_CODE;
            dataValue.companyName = AutoReleasedTransactions.CompanyName;

            transaction.push(dataValue)
        }
        return {
            transaction: {
                details: transaction[0],
                checks: cheque
            },
        }
    }
}
module.exports = getAutoReleased;