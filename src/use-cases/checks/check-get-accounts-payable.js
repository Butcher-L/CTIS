const moment = require('moment');

getAcctsPayableChecksUseCase = ({ checks }) => {
    return async function get(datefilter,SessionId){

        if(!Object.entries(datefilter).length){
            datefilter = null;
        } else{
            datefilter.startDate = moment(datefilter.startDate).format('YYYY-MM-DD');
            datefilter.endDate = moment(datefilter.endDate).format('YYYY-MM-DD');
        };

        const fetchChecks = await checks.selectAllAccountsPayable(datefilter,SessionId)

        
        let data = [];

        for await(check of fetchChecks){
            const dataValue = {}
            dataValue.id = {DocEntry: check.DocEntry, LineNum: check.LineID};
            dataValue.checkNumber = check.CheckNum;
            dataValue.createdBy = check.U_NAME;
            dataValue.creationDate = check.CreateDate;
            dataValue.paymentDate =  check.DocDate;
            dataValue.maturityDate = check.DueDate;
            dataValue.checkAmount = check.CheckSum;
            dataValue.payee =  check.U_APP_PayeeName!=null ? check.U_APP_PayeeName : check.CardName;
            dataValue.accountName = check.BankCode;
            dataValue.accountNumber =  check.AcctNum;
            dataValue.voucherNo= check.Vouchers;
            dataValue.CompanyName= check.CompanyName;
            dataValue.description = check.Comments
            data.push(dataValue)
        }
        return data
  
    }
}

module.exports = getAcctsPayableChecksUseCase;