const receiveTransmitTransactionUseCase = ({
  transactions,
  checks
}) => {
  return async function patch(transaction, SessionId) {
    //assign received by to transaction 
    const receiveTransaction = await transactions.receiveTransmitTransaction(transaction, SessionId)


    const receive = await transactions.receiveTransaction(transaction, SessionId)

    const fetchedChecks = await checks.getTransferredCheckDetailsRecieved(
      transaction.id, SessionId
    );

    let checksss = [];

    for await (checkss of fetchedChecks) {
      const dataValue = {};
      dataValue.id = { DocEntry: checkss.DocEntry, LineID: checkss.LineID };
      dataValue.checkNumber = checkss.CheckNum;
      dataValue.creationDate = checkss.CreateDate;
      dataValue.paymentDate = checkss.DueDate;
      dataValue.maturityDate = checkss.DocDate;
      dataValue.checkAmount = checkss.CheckSum;
      dataValue.accountName = checkss.BankCode;
      dataValue.accountNumber = checkss.AcctNum;
      dataValue.createdBy = checkss.createdBy;
      dataValue.checkStatus = checkss.U_CHK_STATUS;
      dataValue.transmitId = checkss.transmittalId;//
      dataValue.transmittalNumber = checkss.U_TRANSMIT_NUM;
      dataValue.transmittalDate = checkss.U_TRANSMIT_DATE;
      dataValue.specificReleaser = checkss.specificReleaser;
      dataValue.autoReceiveByName = checkss.autoReceiveByName;
      dataValue.autoReleaseByName = checkss.autoReleaseByName;
      dataValue.transmittedByName = checkss.transmittedByName;
      dataValue.transmittalId = checkss.transmittalId;

      checksss.push(dataValue);
    }

    return {
      received: {
        checks: checksss
      },
    };
  };
};

module.exports = receiveTransmitTransactionUseCase;