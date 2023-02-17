const moment = require("moment");

const voidedChecksReportUseCase = ({ reportsDb, getCheckTrailUseCase, reports }) => {
    return async function get(dateRange, SessionId){
        
        if(!dateRange.startDate || !dateRange.endDate){
            throw new Error('Invalid date range');
        }

        dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
        dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');

        const result = []
        const fetch = await reports.getVoidedChecksReport(dateRange, SessionId);
        
        for await(check of fetch){

            data = {};
            data.id = {DocEntry: check.DocEntry, LineNum: check.LineID};
            data.checkNumber = check.CheckNum;
            data.creationDate = check.CreateDate;
            data.payee =  check.U_APP_PayeeName!=null ? check.U_APP_PayeeName : check.CardName;
            //data.sitecode = check.;
            data.voucherNo = check.Vouchers;
            data.voucherDate = check.VoucherDate;
            //data.voucherDate = check.;
            data.checkAmount = check.CheckSum;
            data.paymentDate = check.DocDate;
            data.maturityDate = check.DueDate;
            data.accountName = check.BankCode;
            data.accountNumber = check.AcctNum;
            data.description = check.Comments;
            //data.organization = check.;
            data.createdBy = check.U_NAME;
            data.CompanyName = check.CompanyName;


            // const checkTrail = await getCheckTrailUseCase(data.id, SessionId);
            // data.checkTrail = checkTrail;

            result.push(data);
        };

        return result
    }
};

module.exports = voidedChecksReportUseCase;