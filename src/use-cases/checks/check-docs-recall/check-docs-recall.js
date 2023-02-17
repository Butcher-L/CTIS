const moment = require("moment");
const recallCheckUseCase = ({
  makeDocsRecall,
  checks,
  transactions
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

    //create recallNumber
    recallNumber = await createSeriesNumber(info.groupCode, transactions);
    info.recallNumber = recallNumber;

    const seriesNumber = await transactions.fix("CHK_RECALL");
    const series =
      seriesNumber === null ? 0 : seriesNumber.castmax + 1;

    const transaction = makeDocsRecall(info);
    const checksArray = transaction.getChecks();
    if(checksArray.length>20){
      throw new Error("Checks must be maximum of 20 checks")
    }


let batchStr =
`--a
Content-Type: multipart/mixed;boundary=b

--b
Content-Type:application/http
Content-Transfer-Encoding:binary
POST /b1s/v1/U_CHK_RECALL

{   
    "Code": ${series},
    "Name": ${series},
    "U_RECALL_NUM": "${transaction.getRecallNumber()}",
    "U_RECALL_TO": ${transaction.getRecallTo()?transaction.getRecallTo():info.user_id},
    "U_DESC": "${transaction.getDescription()}",
    "U_RCVD_BY": ${transaction.getReceivedBy()?transaction.getRecallTo():null},
    "U_CONTROL_COUNT": ${transaction.getControlCount()},
    "U_CONTROL_AMT": ${transaction.getControlAmount()},
    "U_RECALLED_BY":${transaction.getRecallBy()},
    "U_RECALL_DATE":"${moment().format()}",
    "U_RECALL_TRANSMIT": ${transaction.getrecallTransmitGroup()},
    "U_IS_POSTED":1,
    "U_DENIED":0,
    "U_DATE_UPDATED": "${moment().format()}",
    "U_TIME_UPDATED": "${moment().format('HH:mm')}",
    "U_DATE_CREATED": "${moment().format()}",
    "U_TIME_CREATED": "${moment().format('HH:mm')}",
    "U_CREATED_BY": ${info.user_id},
    "U_UPDATED_BY": ${info.user_id}
}

--b--
--a--`

console.log(batchStr);
    const postRecall = await checks.TransactionBatch(batchStr, SessionId)

    if (postRecall.data.includes(400)) {
      console.log(postRecall.data);
      throw new Error("Transaction failed")
    }
    // const postRecall = await transactions.createRecallTransaction({
    //   Code: series,
    //   Name: series,
    //   U_RECALL_NUM: transaction.getRecallNumber(),
    //   U_RECALL_TO: info.user_id,
    //   U_DESC: transaction.getDescription(),
    //   U_RCVD_BY: transaction.getReceivedBy(),
    //   U_CONTROL_COUNT: transaction.getControlCount(),
    //   U_CONTROL_AMT: transaction.getControlAmount(),
    //   U_RECALLED_BY: transaction.getRecallBy(),
    //   U_CREATED_BY: info.user_id,
    //   U_IS_POSTED:1,
    //   U_DENIED:0,
    //   U_TIME_CREATED: moment(),
    //   U_DATE_CREATED: moment(),
    //   U_TIME_UPDATED: moment(),
    //   U_DATE_UPDATED: moment(),
    //   U_RECALL_DATE: moment()
    // },SessionId);

    const recallId = series;

    var count = 0;

let batch =
`--a
Content-Type: multipart/mixed;boundary=b
`;
    
let batchupdate =
`--a
Content-Type: multipart/mixed;boundary=b
`;
    for (let i = 0; i < checksArray.length; i++) {
      const fetchTransaction = await transactions.findCheckTransaction({
        id: checksArray[i].id,
        company: checksArray[i].CompanyName
      }, SessionId);

batch += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/U_CHK_TRANSACTIONS('${fetchTransaction.value[0].Code}')

{   
  "U_RECALL_NUM": "${recallId}",
  "U_CHK_STATUS":7,
  "U_DATE_UPDATED": "${moment().format()}",
  "U_TIME_UPDATED": "${moment().format('HH:mm')}",
  "U_UPDATED_BY": ${info.user_id}
}
`

      // const patch = await checks.updateCheckStatus(
      //   {
      //     U_RECALL_NUM: recallId,
      //     U_UPDATED_BY: info.user_id,
      //     U_CHK_STATUS: 7,
      //     U_DATE_UPDATED: moment(),
      //     U_TIME_UPDATED: moment()
      //   },
      //   fetchTransaction.value[0].Code,
      //   SessionId
      // );
batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${checksArray[i].id.DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${checksArray[i].id.LineNum},
      "U_APP_CTIS_ChkStat": "160",
      "U_APP_CTIS_Location": "${info.groupCode}"
  }]
}
`
      // const patchSAP = await checks.updateSAPStatus(
      //   {
      //     LineNum: checksArray[i].id.LineNum,
      //     U_APP_CTIS_ChkStat: '160',
      //     U_APP_CTIS_Location: info.groupCode
      //   },
      //   checksArray[i].id.DocEntry,
      //   MdSessionId
      // );
    }

batch += `
--b--
--a--`;

batchupdate += `
--b--
--a--`;


    const batchOps = await checks.TransactionBatch(batch, SessionId);
    
    if(batchOps.error){
      console.log(batchOps.error.response)
      throw new Error("Transaction failed in tagging check recall number")
    }
    if (batchOps.data.includes('Bad Request')) {
      console.log(batchOps.data);
      throw new Error("Transaction failed in tagging check recall number")
    }

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.data.includes('Bad Request')) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }

    return {
      msg: `Created docs recall transaction ${transaction.getRecallNumber()} with ${count} check(s).`
    };
  };

  async function createSeriesNumber(groupCode, transactions) {
    const seriesNumber = await transactions.fix("CHK_RECALL");
    const series =
      seriesNumber === null ? 0 : seriesNumber.castmax + 1;
    var num = "" + series;
    while (num.length < 6) {
      num = "0" + num;
    }

    return `${groupCode}-${num}`;
  }
};

module.exports = recallCheckUseCase;
