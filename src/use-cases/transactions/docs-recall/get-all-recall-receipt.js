const moment = require('moment')
const getAllRecallReceiptsUseCase = ({ transactions }) => {
    return async function get(dateRange, SessionId) {

        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await transactions.getAllRecallReceipts(dateRange, SessionId)
        let data = [];

        for await (transactionsss of fetched) {

            const dataValue = {}
            dataValue.id = transactionsss.Code;
            dataValue.recallReceiptNumber = transactionsss.U_RECALL_RCPT_NUM;
            dataValue.receivedFrom = transactionsss.U_RCVD_FROM;
            dataValue.description = transactionsss.U_DESC;
            dataValue.receiptDate = transactionsss.U_RCPT_DATE;
            dataValue.receivedBy = transactionsss.U_RCVD_BY;
            dataValue.isPosted = transactionsss.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = transactionsss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionsss.U_CONTROL_AMT;
            dataValue.actualCount = transactionsss.actualCount;
            dataValue.actualAmount = transactionsss.actualAmount;
            dataValue.receivedFromName = transactionsss.receivedFromName;
            dataValue.receivedByName = transactionsss.receivedByName;
            dataValue.recalledReceiptBy = transactionsss.receivedByName;
            dataValue.transmittingGroup = transactionsss.transmittingGroup;
            dataValue.CheckNum = transactionsss.CheckNum;
            dataValue.CompanyName = transactionsss.CompanyName;

            data.push(dataValue)
        }

        return data
    };
};

module.exports = getAllRecallReceiptsUseCase;