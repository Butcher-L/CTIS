const moment = require('moment')
const getAllReceivedUseCase = ({ checks }) => {
    return async function get(dateRange, groupCode, SessionId) {

        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };
        const fetched = await checks.getAllReceivedChecks(dateRange, groupCode, SessionId);

        let data = [];

        for await (checksss of fetched) {
            const dataValue = {}
            // dataValue.id = {DocEntry: checksss.DocEntry, LineNum: checksss.LineID};
            dataValue.id = { DocEntry: checksss.DocEntry, LineNum: checksss.LineID, CompanyName: checksss.CompanyName };
            dataValue.checkNumber = checksss.CheckNum;
            dataValue.creationDate = checksss.CreateDate;
            dataValue.paymentDate = checksss.DocDate;
            dataValue.maturityDate = checksss.DueDate;
            dataValue.checkAmount = checksss.CheckSum;
            dataValue.accountName = checksss.BankCode;
            dataValue.accountNumber = checksss.AcctNum;
            dataValue.createdBy = checksss.createdBy;
            dataValue.checkStatus = checksss.U_CHK_STATUS;
            dataValue.receivedId = checksss.receivedId;
            dataValue.receiveNumber = checksss.U_RCV_NUM;
            dataValue.receiveDate = checksss.U_RCV_DATE;
            dataValue.receivedByName = checksss.receivedByName;
            dataValue.releaserName = checksss.releaserName;
            dataValue.voucherNo = checksss.Vouchers;
            dataValue.payee = checksss.U_APP_PayeeName != null ? checksss.U_APP_PayeeName : checksss.CardName;
            dataValue.CompanyName = checksss.CompanyName;
            dataValue.status = 'received'
            data.push(dataValue)
        }
        return data
    };
};

module.exports = getAllReceivedUseCase;