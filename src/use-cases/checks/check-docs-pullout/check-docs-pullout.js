const moment = require("moment");
const docsPulloutCheckUseCase = ({
  makeDocsPullout,
  checks,
  transactions
}) => {
  return async function post(info, SessionId) {

    if (!info.groupCode) {
      throw new Error("Group code not specified");
    };

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
    //create pullOutNumber
    pullOutNumber = await createSeriesNumber(info.releaseLocationCode, transactions);
    info.pullOutNumber = pullOutNumber;

    const transaction = makeDocsPullout(info);

    const checksArray = transaction.getChecks();
    if(checksArray.length>20){
      throw new Error("Checks must be maximum of 20 checks")
    }

    // console.log(info);
    // throw new Error("PULLOUT")
    // insert to check transactions
    for (let i = 0; i < checksArray.length; i++) {
      const fetchTransaction = await transactions.findCheckTransaction({
        id: checksArray[i].id,
        company: checksArray[i].CompanyName
      }, SessionId);
      if (!fetchTransaction.value.length) {
        notExist=true
        const seriesNumber = await transactions.fix('CHK_TRANSACTIONS');
        const series = seriesNumber === null ? 0 : seriesNumber.castmax + 1;

let batchStr =
`--a
Content-Type: multipart/mixed;boundary=b`;

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
batchStr += `
--b--
--a--`;

    const postCheckTransaction = await checks.TransactionBatch(batchStr, SessionId)

    if (postCheckTransaction.data.includes(400)) {
      console.log(postCheckTransaction.data);
      throw new Error("Transaction failed")
    }
        // const postCheckTransaction = await transactions.createCheckTransferTransaction({
        //     Code: series,
        //     Name: series,
        //     U_CHK_LINE_NUM : checksArray[i].id.LineNum,
        //     U_CHK_DOC_ENTRY : checksArray[i].id.DocEntry,
        //     U_ORGANIZATION: checksArray[i].CompanyName,
        //     U_DATE_CREATED:moment(),
        //     U_TIME_CREATED:moment(),
        //     U_DATE_UPDATED:moment(),
        //     U_TIME_UPDATED:moment(),
        //     U_CREATED_BY:info.user_id
        // }, SessionId);
        // if(!postCheckTransaction.Code){
        //     throw new Error('An error occured');
        // }
        checksArray[i].id.Code = series;
      } else {
        console.log('2');
        checksArray[i].id.Code = fetchTransaction.value[0].Code;
      }
    };

    let batchtns =
      `--a
Content-Type: multipart/mixed;boundary=b
`;


    const seriesNumber = await transactions.fix("CHK_POUT");
    const series =
      seriesNumber === null ? 0 : seriesNumber.castmax + 1;

    batchtns += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
POST /b1s/v1/U_CHK_POUT

{   
    "Code": ${series.toString()},
    "Name": ${series.toString()},
    "U_PULLOUT_NUM": "${info.pullOutNumber}",
    "U_PULLOUT_TO": ${transaction.getPulloutTo()?transaction.getPulloutTo():info.user_id},
    "U_DESC": "${ transaction.getDescription()}",
    "U_PULLOUT_BY": ${transaction.getPulloutBy()},
    "U_CONTROL_COUNT": ${transaction.getControlCount()},
    "U_CONTROL_AMT": ${transaction.getControlAmount()},
    "U_PULLOUT_DATE": "${moment().format()}",
    "U_DENIED": 0,
    "U_IS_POSTED": 1,
    "U_DATE_UPDATED": "${moment().format()}",
    "U_TIME_UPDATED": "${moment().format('HH:mm')}",
    "U_DATE_CREATED": "${moment().format()}",
    "U_TIME_CREATED": "${moment().format('HH:mm')}",
    "U_CREATED_BY": ${info.user_id},
    "U_UPDATED_BY": ${info.user_id}
}
`

    batchtns += `
--b--
--a--`;
    // const postPullout = await transactions.createPulloutTransaction({
    //   Code: series.toString(),
    //   Name: series.toString(),
    //   U_PULLOUT_NUM: info.pullOutNumber,
    //   U_PULLOUT_TO: info.user_id,
    //   U_DESC: transaction.getDescription(),
    //   U_PULLOUT_BY: transaction.getPulloutBy(),
    //   U_CONTROL_COUNT: transaction.getControlCount(),
    //   U_CONTROL_AMT: transaction.getControlAmount(),
    //   U_CREATED_BY: info.user_id,
    //   U_IS_POSTED: 1,
    //   U_DENIED: 0,
    //   U_PULLOUT_DATE: moment(),
    //   U_DATE_CREATED: moment(),
    //   U_TIME_CREATED: moment(),
    //   U_DATE_UPDATED: moment(),
    //   U_TIME_UPDATED: moment()
    // },SessionId);

    const pulloutId = series;

    const postPullout = await checks.TransactionBatch(batchtns, SessionId)

    if (postPullout.data.includes('Bad Request')) {
      console.log(postPullout.data);
      throw new Error("Transaction failed in creating pullout number")
    }


    let batchupdate =
      `--a
Content-Type: multipart/mixed;boundary=b
`;


    var count = 0;
    let batch =
      `--a\n\n` +
      `Content-Type: multipart/mixed;boundary=b\n`;

    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm')
    //update status and transfer number of each check
    for (let i = 0; i < checksArray.length; i++) {
      // const fetchTransaction = await transactions.findCheckTransaction({
      //     ...checksArray[i].id
      // });
      batch += `\n` +
        `--b\n` +
        `Content-Type:application/http\n` +
        `Content-Transfer-Encoding:binary\n` +
        `PATCH /b1s/v1/U_CHK_TRANSACTIONS('${checksArray[i].id.Code}')\n\n` +
        `{\n` +
        `"U_PULLOUT_NUM": ${pulloutId},\n` +
        `"U_CHK_STATUS": 6,\n` +
        `"U_TIME_UPDATED": "${currentTime}",\n` +
        `"U_DATE_UPDATED": "${currentDate}"\n` +
        `}\n`


      batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${checksArray[i].id.DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${checksArray[i].id.LineNum},
      "U_APP_CTIS_ChkStat": "170",
      "U_APP_CTIS_Location": "${info.groupCode}"
  }]
}
`
      // const patchSAP = await checks.updateSAPStatus(
      //   {
      //     LineNum: checksArray[i].id.LineNum,
      //     U_APP_CTIS_ChkStat: '170',
      //     U_APP_CTIS_Location: info.groupCode
      //   },
      //   checksArray[i].id.DocEntry,
      //   MdSessionId
      // );
    };

    batch += `\n` +
      `--b--\n` +
      `--a--`;

    batchupdate += `
--b--
--a--`;
    const batchOps = await checks.batch(batch, SessionId);

    if (batchOps.success == false) {
      console.log(batchOps)
      // const rollBack = await transactions.rollBack(transferId, SessionId)
      throw new Error('Unable to post transaction')
    }

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.error) {
      console.log(updateStatus.error.response)
      throw new Error("Transaction failed in updating status")
    }
    if (updateStatus.data.includes(400)) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }


    return {
      msg: `Created docs pull out transaction ${transaction.getPulloutNumber()} with ${count} check(s).`
    };
  };

  async function createSeriesNumber(groupCode, transactions) {
    const seriesNumber = await transactions.fix("CHK_POUT");
    const series =
      seriesNumber === null ? 0 : seriesNumber.castmax + 1;
    var num = "" + series;
    while (num.length < 6) {
      num = "0" + num;
    }

    return `${groupCode}-SCP-${num}`;
  }
};

module.exports = docsPulloutCheckUseCase;