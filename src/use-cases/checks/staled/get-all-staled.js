const moment = require('moment')
const getAllStaledUseCase = ({ checks}) => {
    return async function get(dateRange,SessionId){

        if (!Object.entries(dateRange).length) {
            dateRange = null;
          } else {
            dateRange.startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
            dateRange.endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
          }

        const fetched = await checks.getAllStaledChecks(dateRange,SessionId); 
        let data = [];
        
        for await(checkss of fetched){
            const dataValue = {}
            dataValue.id = {DocEntry: checkss.DocEntry, LineNum: checkss.LineID};
            dataValue.checkNumber = checkss.CheckNum;
            dataValue.creationDate = checkss.CreateDate;
            dataValue.paymentDate =  checkss.DocDate;
            dataValue.maturityDate = checkss.DueDate;
            dataValue.checkAmount = checkss.CheckSum;
            dataValue.checkStatus =  checkss.U_CHK_STATUS;
            dataValue.accountName = checkss.BankCode;
            dataValue.accountNumber =  checkss.AcctNum;
            dataValue.createdBy = checkss.U_NAME;
            dataValue.payee =  checkss.U_APP_PayeeName!=null ? checkss.U_APP_PayeeName : checkss.CardName;
            dataValue.voucherNo = checkss.Vouchers;
            dataValue.CompanyName = checkss.CompanyName;
            dataValue.defaultCMT = checkss.U_CTIS_Location;

            data.push(dataValue)
        }
        return data
       
    };
};

module.exports = getAllStaledUseCase;