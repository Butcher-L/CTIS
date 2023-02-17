const moment = require('moment')
const getAllDocsRecallTransactionsUseCase = ({ transactions }) => {
    return async function get(dateRange, SessionId) {

        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await transactions.getAllDocsRecallTransactions(dateRange, SessionId);

        let data = []
        for await (transactionss of fetched) {
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.recallNumber = transactionss.U_RECALL_NUM;
            dataValue.recallTo = transactionss.U_RECALL_TO;
            dataValue.description = transactionss.U_DESC;
            dataValue.receiptDate = transactionss.U_RECALL_DATE;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
            dataValue.actualCount = transactionss.U_CONTROL_COUNT;
            dataValue.actualAmount = transactionss.actualCount;
            dataValue.recallToName = transactionss.recallToName;
            dataValue.receivedByName = transactionss.receivedByName;
            dataValue.recallBy = transactionss.U_RECALLED_BY;
            dataValue.recallByName = transactionss.recallByName;
            dataValue.receiptNumber = transactionss.U_RCPT_NUM;
            dataValue.cmtGroup = transactionss.cmtGroup;
            dataValue.CheckNum = transactionss.CheckNum;
            dataValue.CompanyName = transactionss.CompanyName;

            data.push(dataValue)
        }
        return data
    };
};

module.exports = getAllDocsRecallTransactionsUseCase;