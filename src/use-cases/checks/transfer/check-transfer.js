const moment = require("moment");
const transferCheckUseCase = ({
  makeTransfer,
  transactions,
  checks
}) => {
  return async function post(info, SessionId) {
    if (!info.groupCode) {
      throw new Error("Group code not specified");
    }
    let comapany = []

    if (info.checks.length !== 0) {
      let group = []
      for (let o = 0; o < info.checks.length; o++) {
        const array = info.checks[o].CompanyName
        group.push(array)
      }

      for (let i = 0; i < group.length; i++) {


        let proceed = '';
        let check1 = group[i];
        let check2 = group[i + 1]
        // console.log(check1,check2);

        if (i + 1 != group.length) {
          if (check1 === check2) {
            proceed = 1
          } else {
            proceed = 0
            throw new Error("Company must be same");
          }
        }
        comapany.push(proceed)
      }
    }
    info.checks


    let MdSessionId;

    if (comapany[0] === 1) {
      const masterDataLogin = await checks.masterDataDBLogin(
        info.checks[0].CompanyName
      );

      try {
        MdSessionId = masterDataLogin.SessionId;
      } catch (e) {
        throw new Error("Unable to Master DB");
      }
    } else {
      const masterDataLogin = await checks.masterDataDBLogin(
        info.checks[0].CompanyName
      );
      try {
        MdSessionId = masterDataLogin.SessionId;
      } catch (e) {
        throw new Error("Unable to Master DB");
      }
    }

    // create transferNumber
    transferNumber = await createSeriesNumber(info.groupCode, transactions)
    info.transferNumber = transferNumber;
    const transaction = makeTransfer(info);
    const checksArray = transaction.getChecks();

    if(checksArray.length>30){
      throw new Error("Checks must be maximum of 30 checks")
    }


    let batchStr =
      `--a
Content-Type: multipart/mixed;boundary=b`;

    // insert to check transactions
    for (let i = 0; i < checksArray.length; i++) {

      const fetchTransaction = await transactions.findCheckTransaction({
        id: checksArray[i].id,
        company: checksArray[i].CompanyName
      }, SessionId);
      let postCheckTransaction


      if (fetchTransaction.value.length) {

        batchStr += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/U_CHK_TRANSACTIONS('${fetchTransaction.value[0].Code}')

{
    "U_CHK_LINE_NUM": ${checksArray[i].id.LineNum},
    "U_CHK_DOC_ENTRY": ${checksArray[i].id.DocEntry},
    "U_ORGANIZATION": "${checksArray[i].CompanyName}",
    "U_DATE_UPDATED": "${moment().format()}",
    "U_TIME_UPDATED": "${moment().format('HH:mm')}",
    "U_DATE_CREATED": "${moment().format()}",
    "U_TIME_CREATED": "${moment().format('HH:mm')}",
    "U_CREATED_BY": ${info.user_id},
    "U_UPDATED_BY": ${info.user_id}
}
`
        checksArray[i].id.Code = fetchTransaction.value[0].Code;

      }
      if (!fetchTransaction.value.length) {

        const seriesNumber = await transactions.fix('CHK_TRANSACTIONS');
        const series = seriesNumber === null ? 0 : seriesNumber.castmax + 1 + i;


        batchStr += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
POST /b1s/v1/U_CHK_TRANSACTIONS

{   
    "Code": ${series},
    "Name": ${series},
    "U_CHK_LINE_NUM": ${checksArray[i].id.LineNum},
    "U_CHK_DOC_ENTRY": ${checksArray[i].id.DocEntry},
    "U_ORGANIZATION": "${checksArray[i].CompanyName}",
    "U_DATE_UPDATED": "${moment().format()}",
    "U_TIME_UPDATED": "${moment().format('HH:mm')}",
    "U_DATE_CREATED": "${moment().format()}",
    "U_TIME_CREATED": "${moment().format('HH:mm')}",
    "U_CREATED_BY": ${info.user_id},
    "U_UPDATED_BY": ${info.user_id}
}
`

        checksArray[i].id.Code = series;
        // for load test
      } else if (info.checks[0].isLoadTest) {
        if (info.checks[0].isLoadTest) {
          const seriesNumber = await transactions.fix('CHK_TRANSACTIONS');
          const series = seriesNumber === null ? 0 : seriesNumber.castmax + 1;
          postCheckTransaction = await transactions.createCheckTransferTransaction({
            Code: series,
            Name: series,
            U_CHK_LINE_NUM: checksArray[i].id.LineNum,
            U_CHK_DOC_ENTRY: checksArray[i].id.DocEntry,
            U_ORGANIZATION: checksArray[i].CompanyName,
            U_DATE_UPDATED: moment(),
            U_TIME_UPDATED: moment(),
            U_DATE_CREATED: moment(),
            U_TIME_CREATED: moment(),
            U_CREATED_BY: info.user_id
          }, SessionId);
          if (!postCheckTransaction.Code) {
            throw new Error('An error occured');
          }
        }


        checksArray[i].id.Code = postCheckTransaction.Code;
      }

    };

    batchStr += `
--b--
--a--`;

    // console.log(batchStr);
    const transactTransaction = await checks.TransactionBatch(batchStr, SessionId)

    if (transactTransaction.data.includes(400)) {
      console.log(transactTransaction.data);
      throw new Error("Transaction failed")
    }

    //create transfer transaction
    const trans = makeTransfer(info);

    const seriesNumber = await transactions.fix('CHK_TRANSFER');
    const series = seriesNumber === null ? 0 : seriesNumber.castmax + 1


    let batchtns =
      `--a
 Content-Type: multipart/mixed;boundary=b
 `;

    batchtns += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
POST /b1s/v1/U_CHK_TRANSFER

{   
    "Code": ${series},
    "Name": ${series},
    "U_TRANSFER_NUM": "${trans.getTransferNumber()}",
    "U_TRANSMITTER": ${trans.getTransmitter()},
    "U_TRANSFERRED_BY": ${trans.getTransferredBy()},
    "U_CONTROL_COUNT": ${trans.getControlCount()},
    "U_CONTROL_AMT": ${trans.getControlAmount()},
    "U_DESC": "${trans.getDescription()}",
    "U_TRANSFER_DATE": "${moment().format()}",
    "U_DENIED": 0,
    "U_IS_POSTED": 1,
    "U_DATE_UPDATED": "${moment().format()}",
    "U_TIME_UPDATED": "${moment().format('HH:mm')}",
    "U_DATE_CREATED": "${moment().format()}",
    "U_TIME_CREATED": "${moment().format('HH:mm')}",
    "U_CREATED_BY": ${info.user_id},
    "U_UPDATED_BY": ${info.user_id},
    "U_TRANSMITTER_GROUP": ${trans.gettransmitterGroup()}
}
`

    batchtns += `
--b--
--a--`;
    
    const postTransfer = await checks.TransactionBatch(batchtns, SessionId)
    console.log('1');

    if (postTransfer.data.includes('Bad Request')) {
      console.log(postTransfer.data);
      throw new Error("Transaction failed in creating transfer number")
    }

    const find = await transactions.fix('CHK_TRANSFER')
    const transferId = find.castmax;



    // get id of newly created transfer transaction
    var count = 0;
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm')

    let batch =
      `--a\n\n` +
      `Content-Type: multipart/mixed;boundary=b\n`;


    let batchupdate =
      `--a
Content-Type: multipart/mixed;boundary=b
`;

    //update status and transfer number of each check
    for (let i = 0; i < checksArray.length; i++) {
      // const fetchTransaction = await transactions.findCheckTransaction({
      //     ...checksArray[i].id
      // });
      //for loadtest
      if (info.checks[0].isLoadTest) {
        batch += `\n` +
          `--b\n` +
          `Content-Type:application/http\n` +
          `Content-Transfer-Encoding:binary\n` +
          `PATCH /b1s/v1/U_CHK_TRANSACTIONS('${checksArray[i].id.Code}')\n\n` +
          `{\n` +
          `"U_TRANSFER_NUM": ${transferId},\n` +
          `"U_CHK_STATUS": 1,\n` +
          `"U_UPDATED_BY": ${info.user_id},\n` +
          `"U_TIME_UPDATED": "${currentTime}",\n` +
          `"U_DATE_UPDATED": "${currentDate}"\n` +
          `}\n`

        const patchSAP = await checks.updateSAPStatus({
            LineNum: checksArray[i].id.LineNum,
            U_APP_CTIS_Location: info.groupCode
          },
          checksArray[i].id.DocEntry,
          MdSessionId
        );
      }
      // for normal transaction
      else {
        batch += `\n` +
          `--b\n` +
          `Content-Type:application/http\n` +
          `Content-Transfer-Encoding:binary\n` +
          `PATCH /b1s/v1/U_CHK_TRANSACTIONS('${checksArray[i].id.Code}')\n\n` +
          `{\n` +
          `"U_TRANSFER_NUM": ${transferId},\n` +
          `"U_CHK_STATUS": 1,\n` +
          `"U_UPDATED_BY": ${info.user_id},\n` +
          `"U_TIME_UPDATED": "${currentTime}",\n` +
          `"U_DATE_UPDATED": "${currentDate}"\n` +
          `}\n`

        //update status
        batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${checksArray[i].id.DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${checksArray[i].id.LineNum},
      "U_APP_CTIS_ChkStat": "110",
      "U_APP_CTIS_Location": "${info.groupCode}"
  }]
}
`
        // const patchSAP = await checks.updateSAPStatus({
        //   LineNum: checksArray[i].id.LineNum,
        //   U_APP_CTIS_ChkStat: '110',
        //   U_APP_CTIS_Location: info.groupCode
        // },
        //   MdSessionId
        // );

      }


    };
    batch += `\n` +
      `--b--\n` +
      `--a--`;

    batchupdate += `
--b--
--a--`;
    const batchOps = await checks.batch(batch, SessionId);
    console.log('2');

    if (batchOps.success == false) {
      const rollBack = await transactions.rollBack(transferId, SessionId)
      throw new Error('Unable to post transaction')
    }

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)
    console.log('3');

    if (updateStatus.error) {
      console.log(updateStatus.error.response)
      throw new Error("Transaction failed in updating status")
    }
    if (updateStatus.data.includes(400)) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }
    return {
      msg: `Created transfer transaction ${transaction.getTransferNumber()}`
    };
  };

  async function createSeriesNumber(groupCode, transactions) {
    const seriesNumber = await transactions.fix('CHK_TRANSFER');

    const series = seriesNumber === null ? 0 : seriesNumber.castmax + 1;
    var num = '' + series;
    while (num.length < 6) {
      num = '0' + num;
    };
    return `${groupCode}-${num}`;
  };

};
module.exports = transferCheckUseCase;