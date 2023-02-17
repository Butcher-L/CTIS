const getTransmitReportUseCases = ({ transactionsDb, transactions, checks, moment }) => {
    return async function fetch(info, SessionId) {
        if (!info.id || !info.company) { throw new Error(`Must have id and company name.`) };

        const transmitReportChecks = await checks.getTransmitChecks(
            info.id,
            info.company, SessionId);


        const transmitReportTransactions = await transactions.getTransmitTransReport(info.id,
            info.company, SessionId);


        let transaction = [];
        const cheque = [];
        for await (transmitCheck of transmitReportChecks) {
            const dataValue = {}
            dataValue.id = { DocEntry: transmitCheck.DocEntry, LineNum: transmitCheck.LineID };
            dataValue.checkNumber = transmitCheck.CheckNum;
            dataValue.creationDate = transmitCheck.CreateDate;
            dataValue.paymentDate = transmitCheck.DocDate;
            dataValue.maturityDate = transmitCheck.DueDate;
            dataValue.checkAmount = transmitCheck.CheckSum;
            dataValue.bankCode = transmitCheck.BankCode;
            dataValue.acctNum = transmitCheck.AcctNum;
            dataValue.createdBy = transmitCheck.createdBy;
            dataValue.cheque_status = transmitCheck.U_CHK_STATUS;
            dataValue.transmittalId = transmitCheck.transmittalId;
            dataValue.transmit_number = transmitCheck.U_TRANSMIT_NUM;
            dataValue.transmit_date = transmitCheck.U_TRANSMIT_DATE;
            dataValue.description = transmitCheck.description;
            dataValue.specificReleaser = transmitCheck.specificReleaser;
            dataValue.transmittedByName = transmitCheck.transmittedByName;
            dataValue.voucherDate = transmitCheck.VOUCHERDATE;
            dataValue.cardName = transmitCheck.CardName;
            dataValue.U_APP_PayeeName = transmitCheck.U_APP_PayeeName;
            dataValue.vouchers = transmitCheck.Vouchers;
            dataValue.transactionId = transmitCheck.transactionId;
            dataValue.comments = transmitCheck.Comments;
            dataValue.companyName = transmitCheck.CompanyName;

            cheque.push(dataValue);
        }

        for await (transmitReportTransact of transmitReportTransactions) {
            const dataValue = {}
            dataValue.id = transmitReportTransact.TRANSMITCODE;
            dataValue.transmittalNumber = transmitReportTransact.TRANSMITNUM;
            dataValue.specificReleaser = transmitReportTransact.SPECIFICRELEASER;
            dataValue.transmitedName = transmitReportTransact.TRANSMITEDBY;
            dataValue.description = transmitReportTransact.TRANSMITDESC;
            dataValue.receivedBy = transmitReportTransact.RECEIVEDBY;
            dataValue.transmitedBy = transmitReportTransact.TRANSMITEDBY_CODE;
            dataValue.transmitedDate = transmitReportTransact.TRANSMIT_DATE;
            dataValue.isPosted = transmitReportTransact.ISPOSTED == 1 ? true : false;
            dataValue.controlCount = transmitReportTransact.CONTROLCOUNT;
            dataValue.controlAmount = transmitReportTransact.CONTROLAMOUNT;
            dataValue.isDenied = transmitReportTransact.IS_DENIED == 1 ? true : false;
            dataValue.releasingLocationName = transmitReportTransact.RELEASING_LOCATION;
            dataValue.transmittingGroupName = transmitReportTransact.TRANSMITTING_GROUP_NAME;
            dataValue.transmitingGroupCode = transmitReportTransact.TRANSMITTING_GROUP_CODE;
            dataValue.companyName = transmitReportTransact.COMPANY_NAME;
            dataValue.actualAmount = transmitReportTransact.ACTUALAMOUNT;
            dataValue.actualCount = transmitReportTransact.ACTUALCOUNT;
            dataValue.vouchers = transmitReportTransact.VOUCHERS;
            dataValue.chequeNum = transmitReportTransact.ACTUAL_CHECKNUM;

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
module.exports = getTransmitReportUseCases;