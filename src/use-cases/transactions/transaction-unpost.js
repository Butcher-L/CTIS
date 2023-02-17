const moment = require("moment");

const unpostTransactionUseCase = ({ transactions, checks }) => {
    return async function update(info, SessionId,) {
        if (!info.id) {
            throw new Error('No transaction Id provided');
        }

        if (!info.groupCode) {
            throw new Error('Group code not specified');
        };


        const masterDataLogin = await checks.masterDataDBLogin();
        let MdSessionId;
        try {
            MdSessionId = masterDataLogin.SessionId;
        } catch (e) {
            throw new Error('Unable to Master DB');
        }

        //set transaction values
        const transaction = {
            id: info.id,
            user_id: info.user_id
        }


        switch (info.transaction) {
            case 'transfer':
                transaction.transaction = 'U_CHK_TRANSFER';
                transaction.transactionNumber = 'U_TRANSFER_NUM';
                transaction.checkStatus = 0;
                transaction.SAPStatus = null;
                //get transaction checks
                transaction.checks = await getTransferredChecks(checks, transaction.id, SessionId);
                break;
            case 'transmit':
                transaction.transaction = 'U_CHK_TRANSMIT';
                transaction.transactionNumber = 'U_TRANSMIT_NUM';
                transaction.checkStatus = 1;
                transaction.SAPStatus = '110';
                //get transaction checks
                transaction.checks = await getTransmittedChecks(checks, transaction.id, SessionId);
                break;
            // case 'receive':
            //     transaction.transaction = 'U_CHK_RECEIVE';
            //     transaction.transactionNumber = 'U_RCV_NUM';
            //     transaction.checkStatus = 2;
            //     transaction.SAPStatus = 'trnsmtd';
            //     //get transaction checks
            //     transaction.checks = await getReceivedChecks(checks, transaction.id);
            //     break;
            case 'return':
                transaction.transaction = 'U_CHK_RETURN';
                transaction.transactionNumber = 'U_RETURN_NUM';
                transaction.SAPStatus = '130';
                transaction.checkStatus = 4;
                //get transaction checks
                transaction.checks = await getDocsReturnChecks(checks, transaction.id, SessionId);
                break;
        };
        // throw new Error('error here 2');
        //check if transaction has been denied
        if (!await isDenied(transactions, transaction, SessionId)) {
            throw new Error('Cannot unpost transaction that has not been denied')
        };

        let batch = `--a\n\n` +
            `Content-Type: multipart/mixed;boundary=b\n`;

        const currentDate = moment().format('YYYY-MM-DD');
        const currentTime = moment().format('HH:mm')

        let hello = "hello"
        //here the errror numbere 77
        //unpost checks
        transaction.checks.forEach(check => {
            const now = moment();
            const updateBody = `\n` +
                `--b\n` +
                `Content-Type:application/http\n` +
                `Content-Transfer-Encoding:binary\n\n` +

                `PATCH /b1s/v1/U_CHK_TRANSACTIONS('${check.transactionId}')\n\n` +
                `{\n` +
                `"${transaction.transactionNumber}": null,\n` +
                `"U_CHK_STATUS": "${transaction.checkStatus}",\n` +
                `"U_TIME_UPDATED": "${currentTime}",\n` +
                `"U_DATE_UPDATED": "${currentDate}"\n` +
                `}\n`


            batch += updateBody;


        });
        transaction.checks.forEach(async check => {
            const patchSAP = await checks.updateSAPStatus(
                {
                    LineNum: check.LineID,
                    U_APP_CTIS_ChkStat: transaction.SAPStatus,
                    U_APP_CTIS_Location: info.groupCode
                },
                check.DocEntry,
                MdSessionId
            );
        });

        //unpost transaction
        batch += `\n--b\n` +
            `Content-Type:application/http\n` +
            `Content-Transfer-Encoding:binary\n\n` +

            `PATCH /b1s/v1/${transaction.transaction}('${transaction.id}')\n\n` +
            `{\n` +
            `"U_IS_POSTED": 0,\n` +
            //  `"U_UPDATED_BY": "${info.user_id}"\n` +
            `"U_TIME_UPDATED": "${currentTime}",\n` +
            `"U_DATE_UPDATED": "${currentDate}"\n` +
            `}\n`


        batch += `\n` +
            `--b--\n` +
            `--a--`;

        console.log(batch)
        // throw new Error("WEW")
        const batchOps = await checks.batch(batch, SessionId);
        if (batchOps.success == false) {
            throw new Error('Unable to unpost transaction')
        }


        return {
            msg: `transaction has been unposted`
        };

    }

    async function isDenied(transactions, transaction, SessionId) {
        const isDenied = await transactions.isTransactionDenied(transaction, SessionId);
        if (!isDenied) {
            throw new Error('Unable to verify if transaction has been denied');
        } else {
            if (isDenied.U_DENIED) {
                return true;
            }
            return false;
        }
    }

    async function getTransferredChecks(checks, transactionId, SessionId) {
        const fetched = await checks.getTransferredByTransaction(transactionId, SessionId);
        if (!fetched.length) {
            throw new Error('Transaction contains no checks');
        };

        const masterDataLogin = await checks.masterDataDBLogin(
            fetched[0].CompanyName
          );
          const MdSessionId = masterDataLogin.SessionId

let batchupdate =
`--a
Content-Type: multipart/mixed;boundary=b
`;
        for (let i = 0; i < fetched.length; i++) {
            const DocEntry = fetched[i].DocEntry;
            const LineID = fetched[i].LineID;

batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${LineID},
      "U_APP_CTIS_ChkStat": null,
      "U_APP_CTIS_Location": null
  }]
}
`
        }
batchupdate += `
--b--
--a--`;
    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.data.includes('Bad Request')) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }
        return fetched
    };

    async function getTransmittedChecks(checks, transactionId, SessionId) {
        const fetched = await checks.getTransmittedByTransaction(transactionId, SessionId);

        // console.log(fetched);
        // throw new Error("WAw")
        if (!fetched.length) {
            throw new Error('Transaction contains no checks');
        };
        const masterDataLogin = await checks.masterDataDBLogin(
            fetched[0].CompanyName
          );
          const MdSessionId = masterDataLogin.SessionId

let batchupdate =
`--a
Content-Type: multipart/mixed;boundary=b
`;
        for (let i = 0; i < fetched.length; i++) {
            const DocEntry = fetched[i].DocEntry;
            const LineID = fetched[i].LineID;

batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${LineID},
      "U_APP_CTIS_ChkStat": 110
  }]
}
`
        }
batchupdate += `
--b--
--a--`;

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.data.includes('Bad Request')) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }
        return fetched
    };

    // async function getReceivedChecks(checks, transactionId){
    //     const fetched = await checks.getReceivedByTransaction(transactionId)
    //     console.log(fetched)
    //     fetched = [];
    //     if(!fetched.rows.length){
    //         throw new Error('Transaction contains no checks');
    //     };
    //     return fetched.rows
    // };

    async function getDocsReturnChecks(checks, transactionId, SessionId) {
        const fetched = await checks.getReturnedByTransaction(transactionId, SessionId)

        if (!fetched.length) {
            throw new Error('Transaction contains no checks');
        };

        const masterDataLogin = await checks.masterDataDBLogin(
            fetched[0].CompanyName
          );
          const MdSessionId = masterDataLogin.SessionId

let batchupdate =
`--a
Content-Type: multipart/mixed;boundary=b
`;
        for (let i = 0; i < fetched.length; i++) {
            const DocEntry = fetched[i].DocEntry;
            const LineID = fetched[i].LineID;

batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${LineID},
      "U_APP_CTIS_ChkStat": 130
  }]
}
`
        }
batchupdate += `
--b--
--a--`;

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.data.includes('Bad Request')) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }

        return fetched
    };
};

module.exports = unpostTransactionUseCase;