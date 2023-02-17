const moment = require('moment');
const getAllTransferTransactionsUseCase = ({ transactions }) => {
    return async function get(dateRange, SessionId) {

        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await transactions.selectAllTransafered(dateRange, SessionId)
        let data = [];
        for await (transaction of fetched) {

            const dataValue = {}
            dataValue.id = transaction.TRANSACTCODE;
            dataValue.description = transaction.U_DESC;
            dataValue.transferNumber = transaction.U_TRANSFER_NUM;
            dataValue.receivedBy = transaction.U_RCVD_BY;
            dataValue.transmitter = transaction.U_TRANSMITTER;
            dataValue.transferDate = transaction.U_TRANSFER_DATE;
            dataValue.transferredBy = transaction.U_TRANSFERRED_BY;
            dataValue.isPosted = transaction.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = transaction.U_CONTROL_COUNT;
            dataValue.controlAmount = transaction.U_CONTROL_AMT;
            dataValue.denied = transaction.U_DENIED == 1 ? true : false;
            dataValue.actualCount = transaction.actualCount;
            dataValue.actualAmount = transaction.actualAmount;
            dataValue.transmitterName = transaction.transmitterName;
            dataValue.transferredByName = transaction.transferredByName;
            dataValue.receivedByName = transaction.receivedByName;
            dataValue.transmitterGroupName = transaction.U_GROUP_DESC;
            dataValue.writerGroup = transaction.writerGroup;
            dataValue.CheckNum = transaction.CheckNum;
            dataValue.CompanyName = transaction.CompanyName;
            data.push(dataValue)
        }

        return data
    };
};

module.exports = getAllTransferTransactionsUseCase;