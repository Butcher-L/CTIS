const moment = require("moment");
const getReturnedByTransactionUseCase = ({ checks }) => {
  return async function get(returnId, datefilter,SessionId) {
    if (!Object.entries(datefilter).length) {
      datefilter = null;
    } else {
      datefilter.startDate = moment(datefilter.startDate).format("YYYY-MM-DD");
      datefilter.endDate = moment(datefilter.endDate).format("YYYY-MM-DD");
    }
    const fetched = await checks.getReturnedByTransactionDateFilter(
      returnId,
      datefilter,
      SessionId
    );

    let data = [];

    for await (checksss of fetched) {
      const dataValue = {};
      dataValue.id = { DocEntry: checksss.DocEntry, LineNum: checksss.LineID };
      dataValue.checkNumber = checksss.CheckNum;
      dataValue.creationDate = checksss.CreateDate;
      dataValue.paymentDate = checksss.DocDate;
      dataValue.maturityDate = checksss.DueDate;
      dataValue.checkAmount = checksss.CheckSum;
      dataValue.accountName = checksss.BankCode;
      dataValue.accountNumber = checksss.AcctNum;
      dataValue.createdBy = checksss.createdBy;
      dataValue.checkStatus = checksss.U_CHK_STATUS;
      dataValue.receivedId = checksss.receivedId;
      dataValue.receiveNumber = checksss.U_RCV_NUM;
      dataValue.receiveDate = checksss.U_RCV_DATE;
      dataValue.receivedByName = checksss.receivedByName;
      dataValue.releaserName = checksss.releaserName;
      dataValue.voucher = checksss.Vouchers;
      dataValue.payee =  checksss.U_APP_PayeeName!=null ? checksss.U_APP_PayeeName : checksss.CardName;
      dataValue.status = "received";
      data.push(dataValue);
    }

    return data;
  };
};

module.exports = getReturnedByTransactionUseCase;
