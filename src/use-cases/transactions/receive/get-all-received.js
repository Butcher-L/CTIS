const moment = require('moment')
const getAllReceiveTransactionsUseCase = ({ transactions}) => {
    return async function get(dateRange,SessionId){
        if(!Object.entries(dateRange).length){
            dateRange = null;
        } else{
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };
       
            const fetched = await transactions.getReceivedTransactions(dateRange,SessionId)
      
            let data = [];
        for await(checksss of fetched){
            const dataValue = {}
            dataValue.id = checksss.Code;
            dataValue.receiveNumber = checksss.U_RCV_NUM;
            dataValue.receiveDescription = checksss.U_DESC;
            dataValue.receiveDate = checksss.U_RCV_DATE;
            dataValue.receivedBy =  checksss.U_RCVD_BY;
            dataValue.releaser = checksss.U_RELEASER;
            dataValue.isPosted = checksss.U_IS_POSTED == 1 ? true : false ;
            dataValue.controlCount =  checksss.U_CONTROL_COUNT;
            dataValue.controlAmount =  checksss.U_CONTROL_AMT;
            dataValue.actualCount = checksss.actualCount;
            dataValue.actualAmount = checksss.actualAmount;
            dataValue.receiveByName =  checksss.receiveByName;
            dataValue.releaserName = checksss.releaserName;
            dataValue.releaserGroup = checksss.releaserGroup;
            dataValue.CheckNum = checksss.CheckNum;
            dataValue.CompanyName = checksss.CompanyName;

            data.push(dataValue)
        }
        return data
    };
};

module.exports = getAllReceiveTransactionsUseCase;