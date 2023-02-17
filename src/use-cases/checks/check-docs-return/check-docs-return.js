const moment = require("moment")
const docsReturnCheckUseCase = ({ makeDocsReturn, transactions, checks, cma }) => {
  return async function post(info, SessionId) {
    if (!info.groupCode) {
      throw new Error('Group code not specified');
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
     
        // create returnNumber
        returnNumber = await createSeriesNumber(info.releasingLocationCode, transactions)
        info.returnNumber = returnNumber;
       
        const seriesNumber = await transactions.fix('CHK_RETURN');
        const series =seriesNumber === null ? 0 : seriesNumber.castmax + 1

        const transaction = makeDocsReturn(info);
        const checksArray = transaction.getChecks();

        if(checksArray.length>20){
          throw new Error("Checks must be maximum of 20 checks")
        }
    


let batchtns =
`--a
Content-Type: multipart/mixed;boundary=b
`;

batchtns += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
POST /b1s/v1/U_CHK_RETURN

{   
  "Code": ${series},
  "Name": ${series},
  "U_RETURN_NUM": "${info.returnNumber}",
  "U_RETURNED_BY": ${transaction.getReturnedBy()},
  "U_RETURNED_TO": ${info.user_id},
  "U_DESC": "${transaction.getDescription()}",
  "U_CONTROL_COUNT": ${transaction.getControlCount()},
  "U_CONTROL_AMT": ${transaction.getControlAmount()},
  "U_TRANS_RETURN_GROUP": ${transaction.getTransmitGroupID()},
  "U_RETURN_DATE": "${moment().format()}",
  "U_DENIED": 0,
  "U_IS_POSTED": 1,
  "U_DATE_UPDATED": "${moment().format()}",
  "U_TIME_UPDATED": "${moment().format('HH:mm')}",
  "U_DATE_CREATED": "${moment().format()}",
  "U_TIME_CREATED": "${moment().format('HH:mm')}",
  "U_CREATED_BY": ${info.user_id},
}
`
batchtns += `
--b--
--a--`;

const postTransmit = await checks.TransactionBatch(batchtns, SessionId)

if (postTransmit.data.includes('Bad Request')) {
  console.log(postTransmit.data);
  throw new Error("Transaction failed in creating transmit number")
}

        // const postReturn = await transactions.createDocsReturnTransaction({
        //     Code:series,
        //     Name:series,
        //     U_RETURN_NUM: info.returnNumber,
        //     U_RETURNED_BY: transaction.getReturnedBy(),
        //     U_RETURNED_TO:  info.user_id,
        //     U_DESC: transaction.getDescription(),
        //     U_CONTROL_COUNT: transaction.getControlCount(),
        //     U_CONTROL_AMT: transaction.getControlAmount(),
        //     U_CREATED_BY: info.user_id,
        //     U_IS_POSTED:1,
        //     U_DENIED:0,
        //     U_RETURN_DATE:moment(),
        //     U_DATE_CREATED:moment(),
        //     U_TIME_CREATED:moment(),
        //     U_DATE_UPDATED:moment(),
        //     U_TIME_UPDATED:moment(),

        // },SessionId);


        const returnId = series;

 

        var count = 0;
        for (let i = 0; i < checksArray.length; i++) {
            const fetchTransaction = await transactions.findCheckTransaction({
              id:checksArray[i].id,
              company:checksArray[i].CompanyName
            },SessionId);

            const patch = await checks.updateCheckStatus({
                U_RETURN_NUM: returnId,
                U_UPDATED_BY: info.user_id,
                U_DATE_UPDATED:moment(),
                U_TIME_UPDATED:moment()
            }, fetchTransaction.value[0].Code,SessionId);
         
            const patchSAP = await checks.updateSAPStatus({
                LineNum: checksArray[i].id.LineNum,
                U_APP_CTIS_ChkStat: '150',
                U_APP_CTIS_Location: info.groupCode
            }, checksArray[i].id.DocEntry,MdSessionId);
        
        new Promise(async resolve => {
          const checkIfDone = await cma.validateToDone(checksArray[i])

          let invalid = true
          let checks = []

          for await (check of checkIfDone){
              if(check.U_APP_CTIS_ChkStat === "160" || check.U_APP_CTIS_ChkStat === "150"){
                invalid = false
                break
              } 

        }

        if (!invalid) {
          //done
          const validate = await cma.validate(checksArray[i])

          for (let a = 0; a <= validate.length; a++) {
            const element = validate[a];

            if (element.U_APP_cntr_rctp_no) {
              const update = await cma.update(element.U_APP_cntr_rctp_no)

              return update
            } else {
              throw new Error("No Counter Receipt ")
              resolve()
            }

          }
        } else {
          resolve()
        }
      })

    };


    return {
      msg: `Created docs return transaction ${transaction.getReturnNumber()} with ${count} check(s).`
    };
  };
  

  async function createSeriesNumber(groupCode, transactions) {
    const seriesNumber = await transactions.fix('CHK_RETURN');
    const series = seriesNumber === null ? 0 : seriesNumber.castmax + 1;
    var num = '' + series;
    while (num.length < 6) {
      num = '0' + num;
    };

    return `${groupCode}-${num}`;
  };

};

module.exports = docsReturnCheckUseCase;