const moment = require("moment")
const getAllReleasedUseCase = ({ checks }) => {
    return async function get(dateRange, groupDesc, SessionId) {

        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await checks.getReleasedChecks(dateRange, groupDesc, SessionId);

        let data = [];

        for await (checksss of fetched) {
            const dataValue = {}
            dataValue.id = { DocEntry: checksss.DocEntry, LineNum: checksss.LineID, CompanyName: checksss.CompanyName };
            dataValue.checkNumber = checksss.CheckNum;
            dataValue.creationDate = checksss.CreateDate;
            dataValue.paymentDate = checksss.DocDate;
            dataValue.maturityDate = checksss.DueDate;
            dataValue.checkAmount = checksss.CheckSum;
            dataValue.checkStatus = checksss.U_CHK_STATUS;
            dataValue.releaseDate = checksss.U_RELEASE_DATE;
            dataValue.releasedTo = checksss.U_RELEASED_TO;
            dataValue.releasedToEmail = checksss.U_RELEASES_TO_EMAIL;
            dataValue.releasedToContactNumber = checksss.U_RELEASED_CONTACT_NUM;
            dataValue.releasedBy = checksss.releasedBy;
            dataValue.releasedById = checksss.releasedById;
            dataValue.accountName = checksss.BankCode;
            dataValue.accountNumber = checksss.AcctNum;
            dataValue.createdBy = checksss.createdBy;
            dataValue.returnNumber = checksss.returnNumber;
            dataValue.returnReceipt = checksss.returnReceipt;
            dataValue.releaserGroup = checksss.releaserGroup;
            dataValue.payee = checksss.U_APP_PayeeName != null ? checksss.U_APP_PayeeName : checksss.CardName;
            dataValue.voucherNo = checksss.Vouchers;
            dataValue.CompanyName = checksss.CompanyName;
            dataValue.U_TRANSMIT_NUM = checksss.U_TRANSMIT_NUM;
            dataValue.defaultTrnsGrp = checksss.defaultTrnsGrp;
            dataValue.TrnsGrpCode = checksss.TrnsGrpCode;

            dataValue.status = 'released'
            data.push(dataValue)
        }
        return data;
    };
};

module.exports = getAllReleasedUseCase;