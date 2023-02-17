const moment = require('moment')
const getAllTransmitTransactionsUseCase = ({ transactions }) => {
    return async function get(info, dateRange, SessionId) {
        if (!Object.entries(dateRange).length) {
            dateRange = null;
        } else {
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await transactions.getAllTransmitTransactions(info.groupDesc, dateRange, SessionId);
        let data = [];
        for await (transactionss of fetched) {
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
            dataValue.CheckNum = transactionss.CheckNum;
            dataValue.CompanyName = transactionss.CompanyName;

            data.push(dataValue)
        }
        return data
    };
};

module.exports = getAllTransmitTransactionsUseCase;