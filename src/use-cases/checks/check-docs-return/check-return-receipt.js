const moment = require("moment");
const returnReceiptCheckUseCase = ({
  makeReturnReceipt,
  checks,
  transactions
}) => {
  return async function post(info,SessionId) {
    if (!info.groupCode) {
      throw new Error("Group code not specified");
    }
    let comapany=[]
    if(info.checks.length!==0){
      let group=[]
      for (let o = 0; o < info.checks.length; o++) {
          const array = info.checks[o].CompanyName
          group.push(array)
      }
  
      for (let i = 0; i < group.length; i++) {
  
        
        let proceed = '';
        let check1 = group[i];
        let check2 =  group[i+1]
        // console.log(check1,check2);
  
     if(i+1 != group.length){
      if (check1 === check2) {
        proceed=1
      } else {
        proceed=0
        throw new Error("Company must be same");
      }
     }
        comapany.push(proceed)
      }
    }

    let MdSessionId;

    if(comapany[0]===1){
      const masterDataLogin = await checks.masterDataDBLogin(
        info.checks[0].CompanyName
      );
     
      try {
        MdSessionId = masterDataLogin.SessionId;
      } catch (e) {
        throw new Error("Unable to Master DB");
      }
    }else{
      const masterDataLogin = await checks.masterDataDBLogin(
        info.checks[0].CompanyName
      );
      try {
        MdSessionId = masterDataLogin.SessionId;
      } catch (e) {
        throw new Error("Unable to Master DB");
      }
    }

    //create returnReceiptNumber
    returnReceiptNumber = await createSeriesNumber(
      info.groupCode,
      transactions
    );
    info.returnReceiptNumber = returnReceiptNumber;

    const seriesNumber = await transactions.fix("CHK_RETURN_RCPT");
    const series =
     seriesNumber === null ? 0 : seriesNumber.castmax + 1;

    const transaction = makeReturnReceipt(info);
    const checksArray = transaction.getChecks();

    if(checksArray.length>20){
      throw new Error("Checks must be maximum of 20 checks")
    }

    //receive return transaction
    if (!info.returnId) {
      throw new Error("Return ID not indicated");
    }

let batchtns =
`--a
Content-Type: multipart/mixed;boundary=b

--b
Content-Type:application/http
Content-Transfer-Encoding:binary
POST /b1s/v1/U_CHK_RETURN_RCPT

{   
  "Code": ${series},
  "Name": ${series},
  "U_RETURN_RCPT_NUM": "${info.returnReceiptNumber}",
  "U_RCVD_FROM": ${transaction.getReceivedFrom()},
  "U_DESC": "${transaction.getDescription()}",
  "U_RCVD_BY": ${transaction.getReceiveBy()},
  "U_CONTROL_COUNT": ${transaction.getControlCount()},
  "U_CONTROL_AMT": ${transaction.getControlAmount()},
  "U_RCPT_DATE": "${moment().format()}",
  "U_IS_POSTED": 1,
  "U_DATE_UPDATED": "${moment().format()}",
  "U_TIME_UPDATED": "${moment().format('HH:mm')}",
  "U_DATE_CREATED": "${moment().format()}",
  "U_TIME_CREATED": "${moment().format('HH:mm')}",
  "U_CREATED_BY": ${info.user_id}
}
`


    // const postReceipt = await transactions.createReturnReceipt({
    //   Code: series,
    //   Name: series,
    //   U_RETURN_RCPT_NUM: info.returnReceiptNumber,
    //   U_RCVD_FROM: transaction.getReceivedFrom(),
    //   U_DESC: transaction.getDescription(),
    //   U_RCVD_BY: transaction.getReceiveBy(),
    //   U_CONTROL_COUNT: transaction.getControlCount(),
    //   U_CONTROL_AMT: transaction.getControlAmount(),
    //   U_CREATED_BY: info.user_id,
    //   U_TIME_CREATED: moment(),
    //   U_DATE_CREATED: moment(),
    //   U_IS_POSTED: 1,
    //   U_RCPT_DATE:moment()
    // },SessionId);

  
    const receiptId = series

batchtns += 
`--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/U_CHK_RETURN('${info.returnId}')

{   
  "U_RCVD_BY": ${transaction.getReceiveBy()},
  "U_RCPT_NUM": ${receiptId},
  "U_UPDATED_BY": ${info.user_id}
}`

batchtns += `
--b--
--a--`

const postReceipt = await checks.TransactionBatch(batchtns, SessionId)

if(postReceipt.error){
  console.log(postReceipt.error.response)
  throw new Error("Transaction failed in tagging receive number")
}
if (postReceipt.data.includes('Bad Request')) {
  console.log(postReceipt.data);
  throw new Error("Transaction failed in creating receive number")
}

    // const receiveReturn = await transactions.tagReturnReceipt({
    //   U_RCVD_BY: transaction.getReceiveBy(),
    //   Code: info.returnId,
    //   U_RCPT_NUM: receiptId,
    //   U_UPDATED_BY: info.user_id
    // }, SessionId);



let batch =
`--a
Content-Type: multipart/mixed;boundary=b
`;
    
let batchupdate =
`--a
Content-Type: multipart/mixed;boundary=b
`;

    var count = 0;

    for (let i = 0; i < checksArray.length; i++) {
      const fetchTransaction = await transactions.findCheckTransaction({
        id:checksArray[i].id,
        company:checksArray[i].CompanyName
      },SessionId);

batch += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/U_CHK_TRANSACTIONS('${fetchTransaction.value[0].Code}')

{   
  "U_RETURN_RCPT_NUM": "${receiptId}",
  "U_DATE_UPDATED": "${moment().format()}",
  "U_TIME_UPDATED": "${moment().format('HH:mm')}",
  "U_UPDATED_BY": ${info.user_id}
}
`
      // const patch = await checks.updateCheckStatus(
      //   {
      //     U_RETURN_RCPT_NUM: receiptId,
      //     U_UPDATED_BY: info.user_id,
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
      "U_APP_CTIS_ChkStat": "150",
      "U_APP_CTIS_Location": "${info.groupCode}"
  }]
}
`
    //   const patchSAP = await checks.updateSAPStatus({
    //     LineNum: checksArray[i].id.LineNum,
    //     U_APP_CTIS_ChkStat: '150',
    //     U_APP_CTIS_Location: info.groupCode
    // }, checksArray[i].id.DocEntry,
    // MdSessionId);
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
      throw new Error("Transaction failed in tagging return receipt number")
    }
    if (batchOps.data.includes('Bad Request')) {
      console.log(batchOps.data);
      throw new Error("Transaction failed in tagging return receipt number")
    }

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.data.includes('Bad Request')) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }


      return {
        msg: `Created return receipt ${transaction.getReturnReceiptNumber()} with ${count} check(s).`
      };
 
  };

  async function createSeriesNumber(groupCode, transactions) {
    const seriesNumber = await transactions.fix("CHK_RETURN_RCPT");
    const series =
     seriesNumber === null ? 0 : seriesNumber.castmax + 1;

    var num = "" + series;
    while (num.length < 6) {
      num = "0" + num;
    }

    return `${groupCode}-CDRR-${num}`;
  }
};

module.exports = returnReceiptCheckUseCase;
