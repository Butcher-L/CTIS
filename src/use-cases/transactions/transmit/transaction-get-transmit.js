const getTransmitTransactionUseCase = ({ transactions, checks }) => {
    return async function get(id, SessionId, data) {

        const fetchedTransaction = await transactions.getTransmitTransaction(id, SessionId)
        const fetchedChecks = await checks.getTransmittedByTransaction(id, SessionId, data)

        if (!fetchedTransaction.length) {
            throw new Error('Transaction not found.')
        }
        let transaction = [];
        for await (transactionss of fetchedTransaction) {
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.transmittalNumber = transactionss.U_TRANSMIT_NUM;
            dataValue.specificReleaser = transactionss.U_SPCFC_RELEASER;
            dataValue.autoReceiveBy = transactionss.U_AUTO_RCVD_BY;
            dataValue.autoReleaseBy = transactionss.U_AUTO_RLSD_BY;
            dataValue.transmittalDate = transactionss.U_TRANSMIT_DATE;
            dataValue.transmittedBy = transactionss.U_TRANSMIT_BY;
            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.releasingLocation = transactionss.U_RELEASING_LOC;
            dataValue.description = transactionss.U_DESC;
            dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
            dataValue.actualCount = transactionss.actualCount;
            dataValue.actualAmount = transactionss.actualAmount;
            dataValue.specificReleaserName = transactionss.specificReleaserName;
            dataValue.autoReceiveByName = transactionss.autoReceiveByName;
            dataValue.autoReleaseByName = transactionss.autoReleaseByName;
            dataValue.transmittedByName = transactionss.transmittedByName;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.receivedByName = transactionss.receivedByName;
            dataValue.releasingLocationName = transactionss.releasingLocationName;
            dataValue.transmittingGroup = transactionss.transmittingGroup;
            dataValue.CompanyName = transactionss.CompanyName;

            transaction.push(dataValue)
        }

        let checksss = [];
        for await (checkss of fetchedChecks) {
            const dataValue = {}

            dataValue.id = { DocEntry: checkss.DocEntry, LineNum: checkss.LineID };
            dataValue.checkNumber = checkss.CheckNum;
            dataValue.creationDate = checkss.CreateDate;
            dataValue.paymentDate = checkss.DocDate;
            dataValue.maturityDate = checkss.DueDate;
            dataValue.checkAmount = checkss.CheckSum;
            dataValue.accountName = checkss.BankCode;
            dataValue.accountNumber = checkss.AcctNum;
            dataValue.createdBy = checkss.createdBy;
            dataValue.checkStatus = checkss.U_CHK_STATUS;
            dataValue.transferId = checkss.transferId;//
            dataValue.transmittalNumber = checkss.U_TRANSMIT_NUM;
            dataValue.transmittalDate = checkss.U_TRANSMIT_DATE;
            dataValue.specificReleaser = checkss.specificReleaser;
            dataValue.autoReceiveByName = checkss.autoReceiveByName;
            dataValue.autoReleaseByName = checkss.autoReleaseByName;
            dataValue.transmittedByName = checkss.transmittedByName;
            dataValue.voucherNo = checkss.Vouchers;
            dataValue.payee = checkss.U_APP_PayeeName != null ? checkss.U_APP_PayeeName : checkss.CardName;
            dataValue.transmittalId = checkss.transmittalId
            dataValue.description = checkss.Comments;
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

module.exports = getTransmitTransactionUseCase;