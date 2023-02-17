const moment = require('moment')
const getTransferredByTransactionUseCase = ({ checks }) => {
    return async function get(transferId, dateRange,SessionId){
       
        if(!Object.entries(dateRange).length){
            dateRange = null;
        } else{
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetched = await checks.getTransferredByTransactionDateFilter(transferId, dateRange,SessionId)
      
        let data = [];
        
        for await(checkss of fetched){
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

            dataValue.transferId = checkss.transferId;
            dataValue.transferNumber =  checkss.U_TRANSFER_NUM;
            dataValue.transferDate = checkss.U_TRANSFER_DATE;
            dataValue.transmitter = checkss.TRANSMITTER;
            dataValue.transferredBy = checkss.transferredBy;
            dataValue.receivedBy = checkss.receivedBy;

            data.push(dataValue)
        }

        return data
        
    };
};

module.exports = getTransferredByTransactionUseCase;