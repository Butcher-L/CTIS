const moment = require('moment')
const getTransferTransactionUseCase = ({  transactions, checks }) => {
    return async function get(id,SessionId,query){


        // if(!Object.entries(query).length){
        //     query = null;
        // } else{
        //     query.startDate = moment(query.startDate).format('YYYY-MM-DD');
        //     query.endDate = moment(query.endDate).format('YYYY-MM-DD');
        // };

        const fetchedTransaction = await transactions.getTransferTransaction(id,SessionId)
        const fetchedChecks = await checks.getTransferredByTransaction(id,SessionId,query)

        if(!fetchedTransaction.length){
            throw new Error('Transaction not found.')
        }
    
        let transaction = [];
        
        for await(transactionss of fetchedTransaction){
            const dataValue = {}
            dataValue.id = transactionss.Code;
            dataValue.description = transactionss.U_DESC;
            dataValue.transferNumber = transactionss.U_TRANSFER_NUM;
            dataValue.receivedBy = transactionss.U_RCVD_BY;
            dataValue.transmitter =  transactionss.U_TRANSMITTER;
            dataValue.transferDate = transactionss.U_TRANSFER_DATE;
            dataValue.transferredBy = transactionss.U_TRANSFERRED_BY;
            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false ;
            dataValue.controlCount =  transactionss.U_CONTROL_COUNT;
            dataValue.controlAmount =  transactionss.U_CONTROL_AMT;
            dataValue.denied = transactionss.U_DENIED == 1 ? true : false ;
            dataValue.actualCount = transactionss.actualCount;
            dataValue.actualAmount= transactionss.actualAmount;
            dataValue.transmitterName =  transactionss.transmitterName;
            dataValue.transferredByName = transactionss.transferredByName;
            dataValue.receivedByName = transactionss.receivedByName;
            dataValue.writerGroup = transactionss.writerGroup;
            dataValue.CompanyName = transactionss.CompanyName;

            transaction.push(dataValue)
        }

        let checksss = [];
        
        
        for await(checkss of fetchedChecks){
            const dataValue = {}
            dataValue.id = {DocEntry: checkss.DocEntry, LineNum: checkss.LineID};
            dataValue.checkNumber = checkss.CheckNum;
            dataValue.createdBy = checkss.createdBy;
            dataValue.creationDate = checkss.CreateDate;
            dataValue.paymentDate =  checkss.DocDate;
            dataValue.maturityDate = checkss.DueDate;
            dataValue.checkAmount = checkss.CheckSum;
            dataValue.payee =  checkss.U_APP_PayeeName!=null ? checkss.U_APP_PayeeName : checkss.CardName;
            dataValue.accountName = checkss.BankCode;
            dataValue.accountNumber =  checkss.AcctNum;
            dataValue.voucherNo= checkss.Vouchers;   
            dataValue.transferId = checkss.transferId;
            dataValue.transferNumber =  checkss.U_TRANSFER_NUM;
            dataValue.transferDate = checkss.U_TRANSFER_DATE;
            dataValue.transmitter = checkss.TRANSMITTER;
            dataValue.transferredBy = checkss.transferredBy;
            dataValue.receivedBy = checkss.receivedBy;
            dataValue.description = checkss.Comments;
            dataValue.CompanyName = checkss.CompanyName;

            checksss.push(dataValue)
        }

        return {
                transaction: {
                    details: transaction[0],
                    checks: checksss        
                },
            };

    };
};

module.exports = getTransferTransactionUseCase;