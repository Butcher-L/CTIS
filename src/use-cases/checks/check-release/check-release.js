const moment = require("moment");

const releaseCheckUseCase =  ({  makeRelease, checks, transactions }) => {
    return async function post(info,SessionId){

        const transaction = makeRelease(info);

      const masterDataLogin = await checks.masterDataDBLogin(
        info.checkId.CompanyName
      );
     
      try {
        MdSessionId = masterDataLogin.SessionId;
      } catch (e) {
        throw new Error("Unable to Master DB");
      }
  
        //find check transaction
        const fetchTransaction = await transactions.findCheckTransaction({
            id:transaction.getCheckId(),
            company:transaction.getCheckId().CompanyName
        },SessionId);

        const code = fetchTransaction.value[0].Code;
        const test = info.releaseDate ? info.releaseDate:moment()

    

let batch =
`--a
Content-Type: multipart/mixed;boundary=b
`;

batch += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/U_CHK_TRANSACTIONS('${code}')

{   
  "U_RELEASED_BY": "${transaction.getReleasedBy()}",
  "U_RELEASE_DESC": "${transaction.getReleaseDescription()}",
  "U_RELEASED_TO": "${transaction.getReleasedTo()}",
  "U_RELEASES_TO_EMAIL": "${transaction.getReleasedToEmail()}",
  "U_RELEASED_CONTACT_NUM": "${transaction.getReleasedToContact()}",
  "U_CHK_STATUS": 4,
  "U_RELEASE_DATE": "${moment().format()}",
  "U_DATE_UPDATED": "${moment().format()}",
  "U_TIME_UPDATED": "${moment().format('HH:mm')}",
  "U_UPDATED_BY": ${info.user_id}
}
`
batch += `
--b--
--a--`
        // const postRelease = await checks.updateCheckStatus({
        //     U_RELEASED_BY: transaction.getReleasedBy(),
        //     U_RELEASE_DESC: transaction.getReleaseDescription(),
        //     U_RELEASED_TO: transaction.getReleasedTo(),
        //     U_RELEASES_TO_EMAIL: transaction.getReleasedToEmail(),
        //     U_RELEASED_CONTACT_NUM: transaction.getReleasedToContact(),
        //     U_CHK_STATUS: 4,
        //     U_UPDATED_BY: info.user_id,
        //     U_TIME_UPDATED: moment(),
        //     U_RELEASE_DATE: info.releaseDate ? info.releaseDate:moment(),
        //     U_DATE_UPDATED: moment()
        // }, code,SessionId);

let batchupdate =
`--a
Content-Type: multipart/mixed;boundary=b
`;

batchupdate += `
--b
Content-Type:application/http
Content-Transfer-Encoding:binary
PATCH /b1s/v1/VendorPayments(${transaction.getCheckId().DocEntry})

{   
    "PaymentChecks":[{
      "LineNum": ${transaction.getCheckId().LineNum},
      "U_APP_CTIS_ChkStat": "140",
      "U_APP_CTIS_Location": "${info.groupCode}"
  }]
}
`
batchupdate += `
--b--
--a--`

        // const patchSAP = await checks.updateSAPStatus({
        //     LineNum: transaction.getCheckId().LineNum,
        //     U_APP_CTIS_ChkStat: '140',
        //     U_APP_CTIS_Location: info.groupCode
        // }, transaction.getCheckId().DocEntry,MdSessionId);


const batchOps = await checks.TransactionBatch(batch, SessionId);
    if(batchOps.error){
      console.log(batchOps.error.response)
      throw new Error("Transaction failed in tagging receive number")
    }

    if (batchOps.data.includes('Bad Request')) {
      console.log(batchOps.data);
      throw new Error("Transaction failed in tagging transmit number")
    }

    const updateStatus = await checks.TransactionBatch(batchupdate, MdSessionId)

    if (updateStatus.data.includes('Bad Request')) {
      console.log(updateStatus.data);
      throw new Error("Transaction failed in updating status")
    }


       

        return {
            msg: `Check has been released`
        };

    };
};

module.exports = releaseCheckUseCase;