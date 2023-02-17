const moment = require("moment")
const getAllDocsReturnTransactionsUseCase = ({ transactions }) => {
    return async function get(dateRange, SessionId) {

        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };



        const fetched = await transactions.getAllDocsReturnTransactions(dateRange, SessionId);

        let data = [];
        for await (transactionss of fetched) {
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.returnNumber = transactionss.U_RETURN_NUM;
            dataValue.returnedBy = transactionss.U_RETURNED_BY;
            dataValue.returnTo = transactionss.U_RETURNED_TO;
            dataValue.description = transactionss.U_DESC;
            dataValue.returnDate = transactionss.U_RETURN_DATE;
            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
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

            data.push(dataValue)
        }

        return data


    };
};

module.exports = getAllDocsReturnTransactionsUseCase;