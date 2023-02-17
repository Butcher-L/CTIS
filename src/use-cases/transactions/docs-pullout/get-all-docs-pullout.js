const moment = require('moment');
const getAllDocsPulloutTransactionsUseCase = ({ transactions}) => {
    return async function get(dateRange,SessionId){

        if(!Object.entries(dateRange).length){
            dateRange = null;
        } else{
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await transactions.getAllDocsPulloutTransactions(dateRange,SessionId);
      
        let data = [];
      
        for await(transaction of fetched){
            const dataValue = {}
            dataValue.id = transaction.Code;
            dataValue.pullOutNumber = transaction.U_PULLOUT_NUM;
            dataValue.pullOutTo = transaction.U_PULLOUT_TO;
            dataValue.description = transaction.U_DESC;
            dataValue.pullOutDate =  transaction.U_PULLOUT_DATE;
            dataValue.pullOutBy = transaction.U_PULLOUT_BY;
            dataValue.isPosted = transaction.U_IS_POSTED == 1 ? true : false ;
            dataValue.controlCount =  transaction.U_CONTROL_COUNT;
            dataValue.controlAmount =  transaction.U_CONTROL_AMT;
            dataValue.pullOutToName = transaction.pullOutToName;
            dataValue.pullOutByName = transaction.pullOutByName;
            dataValue.receivedBy = transaction.U_RCVD_BY;
            dataValue.receiptNumber =  transaction.U_RCPT_NUM;
            dataValue.releasingGroup = transaction.releasingGroup;
            dataValue.CheckNum = transaction.CheckNum;
            dataValue.CompanyName = transaction.CompanyName;
            dataValue.actualCount = transaction.actualCount;
            dataValue.actualAmount = transaction.actualAmount
            
            data.push(dataValue)
        }
        return data
    };
};

module.exports = getAllDocsPulloutTransactionsUseCase;