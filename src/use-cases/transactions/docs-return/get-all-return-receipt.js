const moment = require("moment")
const getAllReturnReceiptsUseCase = ({ transactions }) => {
    return async function get(dateRange, SessionId) {
        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };
        const fetched = await transactions.getReturnReceipts(dateRange, SessionId)
        let data = [];
        for await (transactionss of fetched) {
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.returnReceiptNumber = transactionss.U_RETURN_RCPT_NUM;
            dataValue.receivedFrom = transactionss.U_RCVD_FROM;
            dataValue.description = transactionss.U_DESC;
            dataValue.receiptDate = transactionss.U_RCPT_DATE;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.actualCount = transactionss.actualCount;
            dataValue.actualAmount = transactionss.actualAmount;
            dataValue.receivedFromName = transactionss.receivedFromName;
            dataValue.receivedByName = transactionss.receivedByName;
            dataValue.transmittingGroup = transactionss.transmittingGroup;
            dataValue.CheckNum = transactionss.CheckNum;
            dataValue.CompanyName = transactionss.CompanyName;


            data.push(dataValue)
        }
        return data
    };
};

module.exports = getAllReturnReceiptsUseCase;