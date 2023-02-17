const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");

const moment = require("moment");
dotenv.config();

require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");
const { realpathSync } = require("fs");
// ############

// base url for sap
const url = process.env.SAP_URL;
const xsjs = process.env.XSJS;

const checks = {
  selectAllAccountsPayable: async (datefilter, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_actPblChcksView"
      ${datefilter != undefined ?
          `WHERE "CreateDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'` : ``}
      `;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },


  getReturnedDocsByTransaction: async (info, SessionId, data) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_ReleasedChecks"
                      WHERE "returnNumber"='${info}'  
                      AND "returnReceipt" IS NULL ` +
        `${data != undefined ?
          `AND "CompanyName"='${data.company}'` : ``}`

          console.log(sql);


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }


  },





  getAllTransferredChecks: async (info, SessionId) => {

    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransChecks"
                      WHERE "receivedBy"='${info}'`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getTransferredByTransactionCT: async (transaction, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransChecks"
                      WHERE "transferId"='${transaction}'`;
      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getTransferredByTransactionDateFilter: async (info, datefilter, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransChecks"
                      WHERE "transferId"='${transaction}' ` +
        `${datefilter != undefined ?
          `and "CreateDate" between '${datefilter.startDate}' 
                      and '${datefilter.endDate}'` : ``}`

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getPulledoutReceiptsByTransaction: async (info, SessionId, data) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_PulledOutChecks"
                      WHERE "pulloutReceiptId"='${info}' AND "CompanyName"='${data.company}'`

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },


  getReceivedByTransaction: async (info, SessionId, data) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RcvdChecks" 
                    WHERE "receivedId" ='${info}' AND "CompanyName"='${data.company}'`


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getReturnedByTransactionDateFilter: async (returnId, datefilter, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RtrndChecks"
                      WHERE "returnNumber"='${returnId}'` +
        `${datefilter != undefined ?
          `and "CreateDate" = '${datefilter.startDate}'
                       and  '${datefilter.endDate}'` : ``}`


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getReleasedCheckDetails: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_ReleasedChecks" 
                    WHERE "DocEntry" ='${info.DocEntry}'
                    AND "LineID" ='${info.LineNum}'`


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }


  },

  getReturnChecks: async (id, company, SessionId) => {

    try {
      const client = await hdbClient();

      const sql = `SELECT
	 "RC"."DocEntry" ,
	 "RC"."LineID" ,
	 "RC"."CheckNum" ,
	 "RC"."CreateDate" ,
	 "RC"."DocDate" ,
	 "RC"."DueDate" ,
	 "RC"."CheckSum" ,
	 "RC"."BankCode" ,
	 "RC"."AcctNum" ,
	 "RC"."createdBy" ,
	 "RC"."U_CHK_STATUS" ,
	 "RC"."U_RELEASE_DATE" ,
	 "RC"."U_RELEASED_TO" ,
	 "RC"."U_RELEASES_TO_EMAIL" ,
	 "RC"."U_RELEASED_CONTACT_NUM" ,
	 "RC"."releasedById" ,
	 "RC"."releasedBy" ,
	 "RC"."returnNumber" ,
	 "RC"."returnReceipt" ,
	 "RC"."releaserGroup" ,
	 "DRT"."Code" AS "docsReturnId" ,
	 "DRT"."U_RETURN_NUM" AS "checkReturnNumber" ,
	 "DRT"."returnedByName" ,
	 "DRT"."returnToName" ,
	 "DRT"."U_DESC" ,
	 "DRT"."U_RETURN_DATE" ,
	 "DRT"."U_IS_POSTED",
	 "RC"."CardName",
	 "RC"."U_APP_PayeeName",
	 "RC"."Vouchers",
	 "CT"."Code" AS "transactionId",
	 "RC"."Comments" ,
	 "DRT"."CompanyName" ,
	 "CDV"."VoucherDate"
FROM "${process.env.COMPANYDB}"."CTIS_ReleasedChecks" as  "RC" LEFT JOIN "${process.env.COMPANYDB}"."CTIS_returnTransView" as "DRT" ON "RC"."returnNumber" = "DRT"."Code"
LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" as "CT" ON "RC"."LineID" = "CT"."U_CHK_LINE_NUM" AND "RC"."CompanyName" = "CT"."U_ORGANIZATION"
AND "RC"."DocEntry" = "CT"."U_CHK_DOC_ENTRY"  LEFT JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" AS "CDV" ON "RC"."DocEntry" = "CDV"."DocNum"
AND "RC"."LineID" = "CDV"."LineID" AND "RC"."CompanyName" = "CDV"."CompanyName" where "RC"."returnNumber" = ${id} and "CDV"."CompanyName" = '${company}'`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          })
        })
      })

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },


  getReleasedChecks: async (datefilter, groupDesc, SessionId) => {

    try {
      const client = await hdbClient();
      const groupD = (groupDesc) ? `AND releaserGroup = "${groupDesc}"` : ``;

      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_ReleasedChecks" 
      WHERE "returnNumber" is null`+
        `${datefilter != undefined ? ` AND "U_RELEASE_DATE" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'` : ``}` +
        `${datefilter.role === 'Check Releaser'
          ? ` AND "releasedById" = '${datefilter.user}'`
          : ``
        }` +
        `${datefilter.company === 'null' || datefilter.company === undefined
          ? ``
          : ` AND "CompanyName" = '${datefilter.company}'`} ${groupD}`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          })
        })
      })

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getAllStaledChecks: async (datefilter, SessionId) => {
    try {

      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_StaledCks"` +
        `${datefilter != undefined
          ? ` WHERE "CreateDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'
              OR "TO_DATE(CURRENT_DATE)" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'`
          : ``
        }` +
        `${datefilter.company === 'null' || datefilter.company === undefined
          ? ``
          : ` AND "CompanyName" = '${datefilter.company}'`}`



      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getAllReceivedChecks: async (info, groupCode, SessionId) => {

    try {
      const client = await hdbClient();
      //changing by rumel
      const GroupDesc = (groupCode) ? `AND cdv."U_CTIS_Location" = '${groupCode}'` : ``;
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RcvdChecks" as rc
left join "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" as cdv on rc."DocEntry" = cdv."DocNum" and rc."LineID" = cdv."LineID"
and rc."CompanyName" = cdv."CompanyName" ` +
        `${info != undefined
          ? ` WHERE rc."U_RCV_DATE" BETWEEN '${info.startDate}'
                         AND '${info.endDate}' ${GroupDesc}`
          : ``
        }` +
        `${info.role === 'Check Check Releaser'
          ? ` AND rc."U_RELEASER" = '${info.user}' ${GroupDesc}`
          : ``
        }` +
        `${info.company === 'null' || info.company === undefined
          ? ``
          : ` AND rc."CompanyName" = '${info.company}' ${GroupDesc}`}`;



      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getAllReturnedChecks: async (SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RtrndChecks"`

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getAllReturnCheckReceipts: async (SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RtrnRcptTrans"`

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  getReturnCheckReceiptsByTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RtrndChecks"
                  WHERE "returnReceipt" ='${info.id}' 
                  AND "CompanyName" = '${info.company}'`



      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getRecalledByTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_recalledChecks"
                      WHERE "recallId"='${info}'`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getTransferredCheckDetailsRecieved: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TrmsChecks"
                        WHERE "transmittalId"='${info}'`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },



  getTransferredCheckDetails: async (info, SessionId) => {
    // di ko sure kung asa ni
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransChecks"
                      WHERE "Code"='${info}'`;
      // `${url}/sml.svc/CTIS_TRFCKS(${info})`

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getTransmitChecks: async (id, company, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `
SELECT
	 c."DocEntry",
	 c."LineID",
	 c."CheckNum",
	 c."CreateDate",
	 c."DocDate",
	 c."DueDate",
	 c."CheckSum",
	 c."BankCode",
	 c."AcctNum",
	 c."U_NAME" AS "createdBy",
	 ct."U_CHK_STATUS",
   cht."U_DESC" AS "description",
	 cht."Code" AS "transmittalId",
	 cht."U_TRANSMIT_NUM",
	 cht."U_TRANSMIT_DATE",
	 ua2."U_FIRSTNAME" || ' ' || ua2."U_LASTNAME" AS "specificReleaser",
	 ua3."U_FIRSTNAME" || ' ' || ua3."U_LASTNAME" AS "autoReceiveByName",
	 ua4."U_FIRSTNAME" || ' ' || ua4."U_LASTNAME" AS "autoReleaseByName",
	 ua5."U_FIRSTNAME" || ' ' || ua5."U_LASTNAME" AS "transmittedByName" ,
	 c."CardName",
	 c."U_APP_PayeeName",
	 c."Vouchers" ,
   c."VoucherDate" as voucherDate,
	 ct."Code" AS "transactionId",
	 c."Comments" ,
	 c."CompanyName"
FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct."U_CHK_LINE_NUM" = c."LineID"
AND ct."U_CHK_DOC_ENTRY" = c."DocEntry"
LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSMIT" cht ON ct."U_TRANSMIT_NUM" = cht."Code"
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua2 ON cht."U_SPCFC_RELEASER" = ua2."Code"
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua3 ON cht."U_AUTO_RCVD_BY" = ua3."Code"
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua4 ON cht."U_AUTO_RLSD_BY" = ua4."Code"
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua5 ON cht."U_TRANSMIT_BY" = ua4."Code"
WHERE ct."U_CHK_STATUS" = 2
AND (c."DocEntry",
	c."CompanyName" ) NOT IN (SELECT
	 "DocEntry" ,
	"CompanyName"
	FROM "${process.env.COMPANYDB}"."CTIS_StaledCks")
AND c."Canceled" = 'N' AND  cht."Code" = '${id}' AND c."CompanyName" = '${company}'`;
      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result

    } catch (error) {
      console.log("Error: ", error);
    }
  },

  getAutoReleaseChecks: async (id, company, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `select       
        c."DocEntry",
         c."LineID",
         c."CheckNum",
         c."CreateDate",
         c."DocDate",
         c."DueDate",
         c."CheckSum",
         c."BankCode",
         c."AcctNum",
         c."U_NAME" AS "createdBy",
         ct."U_CHK_STATUS",
         cht."Code" AS "transmittalId", 
         cht."U_TRANSMIT_NUM",
         cht."U_TRANSMIT_DATE",
         ua2."specificReleaser", 
         ua3."autoReceiveByName",
         ua4."autoReleaseByName",
         ua5."transmittedByName",
         c."CardName",
         c."U_APP_PayeeName",
         c."Vouchers" ,
         ct."Code" AS "transactionId",
         c."Comments" ,
         c."CompanyName" ,
         c."VoucherDate"
FROM  "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c
LEFT JOIN  "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct
ON ct."U_CHK_LINE_NUM" = c."LineID"
AND ct."U_CHK_DOC_ENTRY" = c."DocEntry"
AND ct."U_ORGANIZATION" = c."CompanyName"
LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSMIT"  cht 
ON ct."U_TRANSMIT_NUM" = cht."Code" 
LEFT JOIN (SELECT "Code" as "ua2Code",
 "U_FIRSTNAME" || ' ' ||  "U_LASTNAME" AS "specificReleaser" FROM "${process.env.COMPANYDB}"."CTIS_userProfileView")
AS ua2 ON cht."U_SPCFC_RELEASER" = ua2."ua2Code"
left join (SELECT "Code" as "ua3Code",
 "U_FIRSTNAME" || ' ' ||  "U_LASTNAME" AS "autoReceiveByName" FROM "${process.env.COMPANYDB}"."CTIS_userProfileView")
AS ua3 ON cht."U_AUTO_RCVD_BY" = ua3."ua3Code"
left join (SELECT "Code" as "ua4Code",
 "U_FIRSTNAME" || ' ' ||  "U_LASTNAME" AS "autoReleaseByName" FROM "${process.env.COMPANYDB}"."CTIS_userProfileView")
AS ua4 ON cht."U_AUTO_RLSD_BY" = ua4."ua4Code" 
left join (SELECT "Code" as "ua5Code",
 "U_FIRSTNAME" || ' ' ||  "U_LASTNAME" AS "transmittedByName" FROM "${process.env.COMPANYDB}"."CTIS_userProfileView")
AS ua5 ON cht."U_TRANSMIT_BY" = ua5."ua5Code"
WHERE ct."U_CHK_STATUS" = 9
AND (c."DocEntry",
        c."CompanyName" ) NOT IN (SELECT
         "DocEntry" ,
        "CompanyName"
        FROM "${process.env.COMPANYDB}"."CTIS_StaledCks" )
AND c."Canceled" = 'N' AND  cht."Code" = ${id} AND c."CompanyName" = '${company}'`;


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });
      return result

    } catch (error) {
      console.log("Error: ", error);
    }
  },

  getTransferredByTransaction: async (info, SessionId, query) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransChecks"
                      WHERE "transferId"='${info}' 
                      ${query != undefined
          ? ` AND "CompanyName"='${query.company}'`
          : ``
        } `


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getTransmittedByTransaction: async (info, SessionId, data) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TrmsChecks"
                      WHERE "transmittalId"='${info}' ` +
        `${data != undefined
          ? ` AND "CompanyName"='${data.company}'`
          : ``
        }`


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }

  },

  getPulledoutByTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_PulledOutChecks"
                      WHERE "pulloutId"='${info}'`;


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }


  },

  getRecalledReceiptsByTransaction: async (info, SessionId, data) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_recalledChecks"
                      WHERE "recallReceiptId"='${info}'` +
        `${data != undefined
          ? ` AND "CompanyName"='${data.company}'`
          : ``
        }`

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },



  getReturnedByTransaction: async (info, SessionId, data) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_ReleasedChecks"
                      WHERE "returnNumber"='${info}' 
                      AND "returnReceipt" IS NULL `+
        `${data != undefined ?
          `AND "CompanyName"='${data.company}'` : ``}`


      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }


  },



  selectByDateReport: async (info) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT  t."U_RELEASE_DATE", t."U_ORGANIZATION", cd.* FROM 
    "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" cd
    INNER JOIN "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" t ON t."U_CHK_DOC_ENTRY"=cd."DocEntry" AND t."U_CHK_LINE_NUM"=cd."LineID"
    WHERE t."U_RELEASE_DATE" BETWEEN '${info.DateStart}' AND '${info.DateEnd}'
     AND t."U_ORGANIZATION"='${info.Company}'
    ORDER BY t."U_RELEASE_DATE" ASC`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },



  updateCheckStatus: async (info, id, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_TRANSACTIONS('${id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      return res.data
    } catch (error) {
      console.log(error)
    }
  },

  receiveCheck: async (info, id, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_RECEIVE('${id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });

      return res.data
    } catch (error) {
      console.log(error)
    }
  },

  masterDataDBLogin: async (info) => {
    try {
      const data = {
        CompanyDB: info == process.env.CMPR ? process.env.MDDB : process.env.RDB,
        Password: process.env.MDPASSWORD,
        UserName: process.env.MDUNAME
      };
      const res = await axios.post(`${url}/Login`, data, {
        headers: {
          "Content-Type": "application/json"
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      return res.data;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  updateSAPStatus: async (info, id, SessionId) => {
    try {

      const res = await axios({
        method: "PATCH",
        url: `${url}/VendorPayments(${id})`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          PaymentChecks: [
            {
              ...info
            }
          ]
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      // console.log("updatesapstatus", { res: res, url: `${url}/VendorPayments(${id})`, info: info })
      return {
        res: res.data,
        success: true
      }

    } catch (error) {
      console.log(error)
      return {
        success: false
      }

    }

  },

  TransactionBatch: async (batch, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/$batch`,
        headers: {
          "Content-Type": "multipart/mixed;boundary=a",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: batch,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });

      return res
    } catch (error) {
      return {
        error
        // success: false
      }
    }
  },

  batch: async (batch, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/$batch`,
        headers: {
          "Content-Type": "multipart/mixed;boundary=a",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: batch,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });

      return { success: true }
    } catch (error) {
      return {
        success: false
      }
    }
  },

  findChecks: async (date) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_CheckDetailsView"
      WHERE "U_CTIS_ChkStat" IS NOT NULL AND "Canceled"='N' AND "CreateDate" BETWEEN '${date.startDate}' AND '${date.endDate}'`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  findAllChecks: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_CheckDetailsView"
      WHERE "U_CTIS_ChkStat" IS NOT NULL`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  updateReleaseDate: async (info) => {
    try {
      const client = await hdbClient();
      const sql = `UPDATE "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" 
      SET "U_RELEASE_DATE"='${info.date}'
      WHERE "U_CHK_DOC_ENTRY"=${info.id.DocEntry}
      AND "U_CHK_LINE_NUM"=${info.id.LineNum}
      AND "U_ORGANIZATION"='${info.id.CompanyName}'`;

      const result = await new Promise(resolve => {
        client.connect(function (err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function (err, rows) {
            resolve(rows);
            client.end();
          });
        });
      });

      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  fix: async () => {
    const res = await axios({
      method: "GET",
      url: `${xsjs}?dbName=${process.env.COMPANYDB}&procName=BFI_CTIS_MAXCODE&TBL_NAME=USER_ACTIONS`,
      auth: {
        username: process.env.SAPUSER,
        password: process.env.SAPPW
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    return res.data
  }

};

module.exports = { checks };
