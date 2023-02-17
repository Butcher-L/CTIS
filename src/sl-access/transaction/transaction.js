const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");

const moment = require("moment");


require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");

const {
  CONNREFUSED
} = require("dns");
const {
  link
} = require("fs");
dotenv.config();
// ############

// base url for sap
const url = process.env.SAP_URL;
const xsjs = process.env.XSJS;

const transactions = {
  selectAllTransafered: async (datefilter, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransferTransView"  as ttv
 left join (select "Code" as transactCode, "U_TRANSMITTER_GROUP" FROM "${process.env.COMPANYDB}"."@CHK_TRANSFER" ) AS ct on ct."TRANSACTCODE" = ttv."Code"
 left JOIN "${process.env.COMPANYDB}"."@USER_GROUPS" as upv on ct."U_TRANSMITTER_GROUP" = upv."Code"
                    WHERE ttv."actualCount" is not null `+
        `${datefilter.startDate != undefined
          ? `and ttv."U_TRANSFER_DATE" between '${datefilter.startDate}' and '${datefilter.endDate}'`
          : ``
        }` +
        `${datefilter.role === 'Check Writer'
          ? ` AND ttv."U_TRANSFERRED_BY" = '${datefilter.user}'`
          : ``
        }` +
        `${datefilter.company == 'null' || datefilter.company == undefined
          ? ``
          : ` AND ttv."CompanyName" = '${datefilter.company}'`}`

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


  selectAutoReleaseLocation: async (locationID, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `select "U_LOCATION" from "${process.env.COMPANYDB}"."@LOCATIONS" WHERE "Code" = ${locationID}`;


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
      // console.log("results", { result: result })
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },
  getDocsAllReturnDocsTransaction: async (groupDesc, date_from, date_to, SessionId) => {
    try {
      const client = await hdbClient();
      const sortedByDate = (date_from && date_to) ? `AND c."U_RETURN_DATE" BETWEEN '${date_from}' AND '${date_to}'` : ``;

      const sql = `select c."Code",
  c."U_RETURN_NUM",
  c."U_RETURNED_BY",
  c."U_RETURNED_TO",
  c."U_DESC",
  c."U_RETURN_DATE",
  c."U_IS_POSTED",
  c."U_CONTROL_COUNT",
  c."U_CONTROL_AMT",
  c."U_RCVD_BY",
  c."U_DENIED",
  c."U_RCPT_NUM" ,
  c."U_TRANS_RETURN_GROUP",
  ua."returnedByName",
  ua2."returnedToName",
  ua."releaserGroup" ,
  ua2."TransmitterGroup" ,
         ugc."TransRetGroupCode",
         ugc."groupDesc",
         ugc."groupCodes",
  actual."CheckNum",
  actual."Vouchers",
  to_date(CURRENT_DATE) ,
  to_date(actual."DueDate"),
  ADD_MONTHS(to_date(actual."DueDate"),
6) as "to_be_staled",
  actual."CompanyName",
    actual."actualCount",
      actual."actualAmount"
from "${process.env.COMPANYDB}"."@CHK_RETURN" as c
LEFT JOIN(SELECT "Code" as "returnByCode", "U_FIRSTNAME" || ' ' || "U_LASTNAME"
         AS "returnedByName", "userGroupName" AS "releaserGroup"  from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua
on c."U_RETURNED_BY" = ua."returnByCode"
left join(SELECT "Code" as "returnToCode", "U_FIRSTNAME" || ' ' || "U_LASTNAME"
         AS "returnedToName", "userGroupName" AS "TransmitterGroup" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua2
on c."U_RETURNED_TO" = ua2."returnToCode"
LEFT JOIN (SELECT "Code" as "TransRetGroupCode", "U_GROUP_DESC" AS "groupDesc","U_GROUP_CODE" AS "groupCodes" from "${process.env.COMPANYDB}"."@USER_GROUPS")
as ugc on ugc."TransRetGroupCode" =c."U_TRANS_RETURN_GROUP"
LEFT JOIN(SELECT
	 sum(c."CheckSum") AS "actualAmount",
  count(c."DocEntry") AS "actualCount",
  string_agg(CONCAT(c."CheckNum",
    '  ')) as "CheckNum",
  string_agg(CONCAT(c."Vouchers",
    '  ')) as "Vouchers",
  --string_agg(CONCAT(ct_1."U_RETURN_NUM",
    --'  ')) as "U_RETURN_NUM",
  ct_1."U_RETURN_NUM",
  --c."DueDate",
  string_agg(CONCAT(c."DueDate",
    '  ')) as "DueDate",
  c."CompanyName"
	FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID"
	AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
	WHERE ct_1."U_RETURN_NUM" IS NOT NULL--AND ct_1."U_RETURN_RCPT_NUM" IS NULL--AND c."DocEntry" NOT IN(SELECT "U_CHK_DOC_ENTRY" FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS")
	AND ct_1."U_CHK_STATUS" = 4
	GROUP BY ct_1."U_RETURN_NUM",
  --c."DueDate",
  c."CompanyName") actual ON c."Code" = actual."U_RETURN_NUM"
WHERE to_date(CURRENT_DATE) < ADD_MONTHS(to_date(actual."DueDate"),
  6)  ${sortedByDate} `;


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
      // console.log("results", { result: result })
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  selectAllToReceiveTransfer: async (datefilter, SessionId) => {
    try {
      // console.log("received PArams", { datefilter: datefilter, SessionId: SessionId })
      const client = await hdbClient();
      // ito ay walang lamat na data kayqa may mga transaction na di nakita i check si weee 
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransferTransView" AS ttv  
       left join (SELECT "Code" AS TRANSMITTERCODE, "U_TRANSMITTER_GROUP" AS UTRANSGROUP FROM "${process.env.COMPANYDB}"."@CHK_TRANSFER") as ttg on ttv."Code" = ttg."TRANSMITTERCODE"
left join (SELECT "U_GROUP_CODE" AS TransmitterGroupCode, "U_GROUP_DESC" AS groupDescription, "Code" from "${process.env.COMPANYDB}"."@USER_GROUPS")
 as ugs on ttg."UTRANSGROUP" = ugs."Code"
          WHERE ttv."U_IS_POSTED"=1
                    AND ttv."U_DENIED" !=1
                    AND ttv."U_RCVD_BY" is null`+
        `${datefilter != undefined
          ? ` AND ttv."U_TRANSFER_DATE" BETWEEN '${datefilter.startDate}'
                         AND '${datefilter.endDate}'`
          : ``
        }` +
        // `${
        //     datefilter.role === 'Check Transmitter'
        //       ? ` AND "U_TRANSMITTER" = '${datefilter.user}'`
        //       : ``
        //   }` +
        `${datefilter.company === null || datefilter.company === undefined
          ? ``
          : ` AND ttv."CompanyName" = '${datefilter.company}'`}`


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
      // console.log("results", { result: result })
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },
  getTransactionReturnCheck: async (datefilter, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
	 c."Code",
	 c."U_RETURN_NUM",
	 c."U_RETURNED_BY",
	 c."U_RETURNED_TO",
	 c."U_DESC",
	 c."U_RETURN_DATE",
	 c."U_IS_POSTED",
	 c."U_CONTROL_COUNT",
	 c."U_CONTROL_AMT",
	 actual."actualCount",
	 actual."actualAmount",
	 ua."U_FIRSTNAME" || ' ' || ua."U_LASTNAME" AS "returnedByName",
	 ua1."U_FIRSTNAME" || ' ' || ua1."U_LASTNAME" AS "returnToName",
	 c."U_RCVD_BY",
	 c."U_DENIED",
	 ua."userGroupName" AS "releaserGroup" ,
	 c."U_RCPT_NUM" ,
	 actual."CheckNum",
	 actual."Vouchers",
	 to_date(CURRENT_DATE) ,
	 to_date(actual."DueDate"),
	 ADD_MONTHS (to_date(actual."DueDate"),
	 6) as "to_be_staled",
	 actual."CompanyName"
FROM "${process.env.COMPANYDB}"."@CHK_RETURN" c JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua ON c."U_RETURNED_BY" = ua."Code" JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua1 ON c."U_RETURNED_TO" = ua1."Code"
LEFT JOIN ( SELECT
	 sum(c."CheckSum") AS "actualAmount",
	 count(c."DocEntry") AS "actualCount",
	 string_agg(CONCAT(c."CheckNum",
	 '  '))as "CheckNum",
	 string_agg(CONCAT(c."Vouchers",
	 '  '))as "Vouchers",
	 --string_agg(CONCAT(ct_1."U_RETURN_NUM",
 --'  '))as "U_RETURN_NUM",
 ct_1."U_RETURN_NUM",
	 --c."DueDate",
 string_agg(CONCAT(c."DueDate",
	 '  '))as "DueDate",
	 c."CompanyName"
	FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID"
	AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
	WHERE ct_1."U_RETURN_NUM" IS NOT NULL --AND ct_1."U_RETURN_RCPT_NUM" IS NULL --AND c."DocEntry" NOT IN (SELECT "U_CHK_DOC_ENTRY" FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" )

	AND ct_1."U_CHK_STATUS" = 4
	GROUP BY ct_1."U_RETURN_NUM",
	 --c."DueDate",
 c."CompanyName") actual ON c."Code" = actual."U_RETURN_NUM"
WHERE to_date(CURRENT_DATE) < ADD_MONTHS (to_date(actual."DueDate"),
	 6)`;

      // console.log("meemo", { sql: sql })
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
      // console.log("results", { result: result })
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },
  selectAutoRelease: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const dateFilter = (info.startDate && info.endDate) ? `AND  actual."U_AUTO_RELEASE_DATE"  BETWEEN '${info.startDate}' AND '${info.endDate}'` : ``;
      const Groups = (info.groupCode && info.groupCode != 'ADMIN') ? ` AND ug."U_GROUP_CODE" = '${info.groupCode}'` : ``;

      const sql = `	SELECT
C_TRANSMIT."U_RELEASING_LOC" AS U_RELEASING_LOC,
C_TRANSMIT."Code" AS AutoTransmitCode,
C_TRANSMIT."Code" AS autoReleaseCode,
C_TRANSMIT."U_CONTROL_COUNT" AS controlCount,
C_TRANSMIT."U_CONTROL_AMT" AS controlAmount,
loc."U_LOCATION" as releaseLocation,
actual."U_AUTO_RELEASE_DATE" AS autoReleaseDate,
C_TRANSMIT."U_DESC" AS Description,
C_TRANSMIT."U_TRANSMIT_NUM" AS Transmation_Number,
actual."CompanyName" as Details_view_Company_Name,
actual."Name" as status,
C_TRANSMIT."U_TRANSMIT_BY" AS autoReleasedBy,
C_USER."U_FIRSTNAME" AS Transmited_By_User_FirstName,
C_USER."U_LASTNAME" AS Transmited_By_User_LastName,
C_USER."U_USER_GROUP" AS transmitterGroupCode,
ug."U_GROUP_DESC" as usergroupname,
ug."Code" AS transmitterCode,
ug."U_GROUP_CODE" AS U_GROUP_CODE,
actual."CheckNum" AS Checks
FROM "${process.env.COMPANYDB}"."@CHK_TRANSMIT" AS C_TRANSMIT
left JOIN "${process.env.COMPANYDB}"."@USER_ACCOUNTS" AS C_USER ON C_USER."Code" = C_TRANSMIT."U_TRANSMIT_BY"
left join "${process.env.COMPANYDB}"."@USER_GROUPS" as ug on C_USER."U_USER_GROUP" = ug."Code"
left JOIN "${process.env.COMPANYDB}"."@LOCATIONS" as loc ON loc."Code"=C_TRANSMIT."U_RELEASING_LOC"
JOIN (SELECT
sum(c."CheckSum") AS "actualAmount",
count(c."DocEntry") AS "actualCount",
string_agg(CONCAT(c."CheckNum", ' ')) as "CheckNum",
string_agg(CONCAT(c."Vouchers",
' ')) as "Vouchers",
ct_1."U_TRANSMIT_NUM",
c."CompanyName",
ct_1."U_AUTO_RELEASE_DATE",
ct_1."U_CHK_STATUS",
s."Name"
FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c
ON ct_1."U_CHK_LINE_NUM" = c."LineID"
AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
AND c."CompanyName" = ct_1."U_ORGANIZATION"
JOIN "${process.env.COMPANYDB}"."@CHK_STATUS" s ON s."Code"=ct_1."U_CHK_STATUS"
WHERE ct_1."U_TRANSFER_NUM" IS NOT NULL
AND ct_1."U_CHK_STATUS" = 9
AND(c."DocEntry",
c."CompanyName") NOT IN(SELECT
"DocEntry",
"CompanyName"
FROM "${process.env.COMPANYDB}"."CTIS_StaledCks")
AND c."Canceled" = 'N'
GROUP BY ct_1."U_TRANSMIT_NUM",
c."CompanyName",
ct_1."U_AUTO_RELEASE_DATE",
ct_1."U_CHK_STATUS",
s."Name") AS actual ON actual."U_TRANSMIT_NUM" = C_TRANSMIT."Code"
WHERE actual."CompanyName" IS NOT NULL ${Groups} ${dateFilter}  `;


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
  selectTransmitReport: async (GroupID, info, SessionId) => {
    try {
      const client = await hdbClient();
      const datefilter = (info.dateFrom && info.dateTo) ? `AND CT."U_TRANSMIT_DATE" BETWEEN   '${info.dateFrom}' AND '${info.dateTo}'` : ``;
      const Groups = (GroupID) ? `AND U_transmit_by."userGroupName" = '${GroupID}'` : ``;
      const sql = `SELECT 
CT."Code" as TransmitCode,
CT."Name" as TransmitName,
CT."U_TRANSMIT_NUM" as TransmitNum,
CT."U_SPCFC_RELEASER" as SpecificReleaser,
CT."U_TRANSMIT_DATE" as TransmitDate,
CT."U_DESC" as Description,
CT."U_DENIED" as isDenied,
CT."U_IS_POSTED" as isPosted,
CT."U_CONTROL_COUNT" as ControlCount,
CT."U_CONTROL_AMT" as ControlAmount,
CT."U_CREATED_BY" as CreatedBy, 
CT."U_RCVD_BY" as RcvdBy,
CT."U_RELEASING_LOC" as ReleasingLocation,
CT."U_TRANSMIT_BY" as TransmitedBy,
U_transmit_by."userGroupName" as transmitterGroupDesc,
U_transmit_by."U_FIRSTNAME"  || ' ' || U_transmit_by."U_MIDDLENAME" || ' ' || U_transmit_by."U_LASTNAME" AS transmittedByName,
U_rcvd_by."U_FIRSTNAME"  || ' ' || U_rcvd_by."U_MIDDLENAME" || ' ' || U_rcvd_by."U_LASTNAME" AS receivdByName,
LOC."U_LOCATION" as releaseLocation,
actual."actualAmount" as actualAmount, 
actual."CheckNum" as CheckNum, 
actual."actualCount" as actualCount, 
actual."Vouchers" as Vouchers,
actual."U_TRANSMIT_NUM" as transmitCheckNum,
actual."CompanyName" as Details_view_Company_Name,
actual."Name" as status
 FROM "${process.env.COMPANYDB}"."@CHK_TRANSMIT" AS CT
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" AS U_transmit_by ON CT."U_TRANSMIT_BY" = U_transmit_by."Code"
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" AS U_rcvd_by ON CT."U_RCVD_BY" = U_rcvd_by."Code"
LEFT JOIN "${process.env.COMPANYDB}"."@LOCATIONS" AS LOC ON CT."U_RELEASING_LOC" = LOC."Code"
JOIN (SELECT
sum(c."CheckSum") AS "actualAmount",
count(c."DocEntry") AS "actualCount",
string_agg(CONCAT(c."CheckNum", ' ')) as "CheckNum",
string_agg(CONCAT(c."Vouchers",
' ')) as "Vouchers",
ct_1."U_TRANSMIT_NUM",
c."CompanyName", 
ct_1."U_CHK_STATUS",
s."Name"
FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c
ON ct_1."U_CHK_LINE_NUM" = c."LineID"
AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
AND c."CompanyName" = ct_1."U_ORGANIZATION"
JOIN "${process.env.COMPANYDB}"."@CHK_STATUS" s ON s."Code"=ct_1."U_CHK_STATUS"
WHERE ct_1."U_TRANSFER_NUM" IS NOT NULL
AND ct_1."U_CHK_STATUS" = 2
AND(c."DocEntry",
c."CompanyName") NOT IN(SELECT
"DocEntry",
"CompanyName"
FROM "${process.env.COMPANYDB}"."CTIS_StaledCks")
AND c."Canceled" = 'N'
GROUP BY ct_1."U_TRANSMIT_NUM",
c."CompanyName",
ct_1."U_AUTO_RELEASE_DATE",
ct_1."U_CHK_STATUS",
s."Name") AS actual ON actual."U_TRANSMIT_NUM" = CT."Code"
WHERE actual."CompanyName" IS NOT NULL ${datefilter} `;


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
  selectAllToReceiveTransmit: async (datefilter, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TrmsTransView"
                    WHERE "U_IS_POSTED"=1
                    AND "U_DENIED" !=1
                    AND "U_RCVD_BY" is null`+
        `${datefilter != undefined
          ? ` AND "U_TRANSMIT_DATE" BETWEEN '${datefilter.startDate}'
                         AND '${datefilter.endDate}'`
          : ``
        }` +
        `${datefilter.role === 'Check Releaser'
          ? ` AND "U_RELEASING_LOC" = '${datefilter.location}'`
          : ``
        }` +
        `${datefilter.company === null || datefilter.company === undefined
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

  selectAllToReturnTransmit: async (datefilter, SessionId) => {
    try {

      const client = await hdbClient();
      const sql = ` SELECT
	 c."Code",
	 c."U_RETURN_NUM",
	 c."U_RETURNED_BY",
	 c."U_RETURNED_TO",
	 c."U_DESC",
	 c."U_RETURN_DATE",
	 c."U_IS_POSTED",
	 c."U_CONTROL_COUNT",
	 c."U_CONTROL_AMT",
	 c."U_RCVD_BY",
	 c."U_DENIED",
	 c."U_RCPT_NUM" ,
	 c."U_TRANS_RETURN_GROUP",
	 ug."U_GROUP_DESC",
   ug."GroupCode",
	 actual."actualCount",
	 actual."actualAmount",
	 actual."CheckNum",
	 actual."Vouchers",
	 ADD_MONTHS (to_date(actual."DueDate"),
	 6) as "to_be_staled",
	 actual."CompanyName",
	 to_date(CURRENT_DATE) ,
	 to_date(actual."DueDate"),
	 ua."returnByCode",
	 ua."returnedByName",
	 ua. "releaserGroup",
	 ua."releaserGroup",
	 ua2."returnedToName",
	 ua2."returnToCode"
	 from "${process.env.COMPANYDB}"."@CHK_RETURN" as c
	 left join (select "Code" as "groupCodes" ,"U_GROUP_DESC","U_GROUP_CODE" as "GroupCode" from "${process.env.COMPANYDB}"."@USER_GROUPS" ) as ug on c."U_TRANS_RETURN_GROUP" = ug."groupCodes"
	 LEFT JOIN (SELECT "Code" as "returnByCode",  "U_FIRSTNAME" || ' ' || "U_LASTNAME"
	 AS "returnedByName","userGroupName" AS "releaserGroup" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua
	 on c."U_RETURNED_BY" = ua."returnByCode"
	 left join (SELECT "Code" as "returnToCode",  "U_FIRSTNAME" || ' ' || "U_LASTNAME"
	 AS "returnedToName" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua2
	 on c."U_RETURNED_TO" = ua2."returnToCode" left join
	 ( SELECT
	 sum(c."CheckSum") AS "actualAmount",
	 count(c."DocEntry") AS "actualCount",
	 string_agg(CONCAT(c."CheckNum",
	 '  '))as "CheckNum",
	 string_agg(CONCAT(c."Vouchers",
	 '  '))as "Vouchers",
 ct_1."U_RETURN_NUM",
 string_agg(CONCAT(c."DueDate",
	 '  '))as "DueDate",
	 c."CompanyName"
	FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID"
	AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
	WHERE ct_1."U_RETURN_NUM" IS NOT NULL
	AND ct_1."U_CHK_STATUS" = 4
	GROUP BY ct_1."U_RETURN_NUM",
 c."CompanyName") actual ON c."Code" = actual."U_RETURN_NUM"
WHERE to_date(CURRENT_DATE) < ADD_MONTHS (to_date(actual."DueDate"),
	 6) and c."U_IS_POSTED"=1
                    AND c."U_DENIED" !=1
                    AND c."U_RCVD_BY" is null `+
        `${datefilter != undefined
          ? ` AND c."U_RETURN_DATE" BETWEEN '${datefilter.startDate}'
                         AND '${datefilter.endDate}'`
          : ``
        }` +
        // `${
        //     datefilter.role === 'Check Transmitter'
        //       ? ` AND "U_RETURNED_TO" = '${datefilter.user}'`
        //       : ``
        //   }` +
        `${datefilter.company === null || datefilter.company === undefined
          ? ``
          : ` AND actual."CompanyName" = '${datefilter.company}'`}`


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

  getReturnReceipt: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RtrnRcptTrans"
                    WHERE "Code"='${info.id}' 
                    AND "CompanyName"='${info.company}' `


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

  getReturnReceipts: async (datefilter, SessionId) => {

    try {
      const Group = (datefilter.groupCode && datefilter.groupCode != 'ADMIN') ? `AND upv."U_GROUP_CODE" = '${datefilter.groupCode}'` : ``;
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RtrnRcptTrans" AS rrt LEFT JOIN (select "Code" as "userCode","U_EMPLOYEE_ID",
      "U_FIRSTNAME","U_LASTNAME","U_MIDDLENAME","U_ROLE","U_USER_GROUP","roleName","userGroupName","U_IS_ACTIVE","U_GROUP_CODE",
      "U_ACCTG_GROUP","CompanyName" from "${process.env.COMPANYDB}"."CTIS_userProfileView") AS upv ON rrt."U_RCVD_BY" = upv."userCode"
                    WHERE  rrt."actualCount" is not null ${Group} ` +
        `${datefilter != undefined
          ? ` AND  rrt."U_RCPT_DATE" BETWEEN '${datefilter.startDate}'
                         AND '${datefilter.endDate}'`
          : ``
        }` +
        // `${
        //     datefilter.role === 'Check Transmitter'
        //       ? ` AND "U_RCVD_BY" = '${datefilter.user}'`
        //       : ``
        //   }` +
        `${datefilter.company === null || datefilter.company === undefined
          ? ``
          : ` AND  rrt."CompanyName" = '${datefilter.company}'`}`


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

  getTransmitTransaction: async (info, SessionId) => {

    try {
      const client = await hdbClient();
      const sql = `
                  SELECT
                    ct."Code",
                    ct."U_DESC",
                    ct."U_TRANSMIT_NUM",
                    ct."U_SPCFC_RELEASER",
                    ct."U_AUTO_RCVD_BY",
                    ct."U_AUTO_RLSD_BY",
                    ct."U_RCVD_BY",
                    ct."U_TRANSMIT_DATE",
                    ct."U_TRANSMIT_BY",
                    ct."U_IS_POSTED",
                    ct."U_CONTROL_COUNT",
                    ct."U_CONTROL_AMT",
                    ct."U_RELEASING_LOC",
                    ct."U_DENIED",
                    actual."actualCount",
                    actual."actualAmount",
                    ua2."U_FIRSTNAME" || ' ' || ua2."U_LASTNAME" AS "transmittedByName",
                    ua4."U_FIRSTNAME" || ' ' || ua4."U_LASTNAME" AS "receivedByName",
                    ua3."userGroupName" AS "releasingLocationName",
                    ua3."U_GROUP_CODE" AS "transmittingGroup",
                    actual."CheckNum",
                    actual."Vouchers",
                    actual."CompanyName" 
                 FROM "${process.env.COMPANYDB}"."@CHK_TRANSMIT" ct 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua2 ON ct."U_TRANSMIT_BY" = ua2."Code" 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua3 ON ct."U_TRANSMIT_BY" = ua3."Code" 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua4 ON ct."U_RCVD_BY" = ua4."Code" --LEFT JOIN "CTIS_userProfileView" ua5 ON ct."U_RCVD_BY" = ua5."Code" 

                 LEFT JOIN (SELECT
                    sum(c."CheckSum") AS "actualAmount",
                    count(c."DocEntry") AS "actualCount",
                    string_agg(CONCAT(c."CheckNum",
                    '  '))as "CheckNum",
                    string_agg(CONCAT(c."Vouchers",
                    '  '))as "Vouchers",
                    ct_1."U_TRANSMIT_NUM",
                    c."CompanyName" 
                   FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 
                   JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
                   AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
                   WHERE ct_1."U_TRANSMIT_NUM" IS NOT NULL 
                   AND ct_1."U_CHK_STATUS" = 2 
                   AND c."DocEntry" NOT IN (SELECT
                    "DocEntry" 
                     FROM "${process.env.COMPANYDB}"."CTIS_StaledCks") 
                   AND c."Canceled" = 'N' 
                   GROUP BY ct_1."U_TRANSMIT_NUM",
                    c."CompanyName") actual ON ct."Code" = actual."U_TRANSMIT_NUM" 
                 WHERE  ct."Code"='${info}'`



      //  `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TrmsTransView"
      //     WHERE "Code"='${info}'`


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

  getAllTransmitTransactions: async (groupDesc, dateRange, SessionId) => {
    try {
      const Group = (dateRange.groupCode && dateRange.groupCode != 'ADMIN') ? `AND upf."U_GROUP_CODE" = '${dateRange.groupCode}'` : ``;
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TrmsTransView" as ttv left join ( select "Code" as Ucode, "U_EMPLOYEE_ID","U_FIRSTNAME","U_LASTNAME","U_MIDDLENAME",
                 "U_ROLE","U_USER_GROUP","roleName","userGroupName","U_IS_ACTIVE","U_GROUP_CODE","U_USERNAME","U_ACCTG_GROUP","SAP","CompanyName" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as upf on ttv."U_TRANSMIT_BY" = upf."UCODE"
                    WHERE "actualCount" is not null ${Group} ` +
        `${dateRange != undefined
          ? ` AND ttv."U_TRANSMIT_DATE" BETWEEN '${dateRange.startDate}'
                         AND '${dateRange.endDate}'`
          : ``
        }` +
        // `${dateRange.role === 'Check Transmitter'
        //   ? ` AND ttv."U_TRANSMIT_BY" = '${dateRange.user}'`
        //   : ``
        // }` +
        `${dateRange.company === null || dateRange.company === undefined
          ? ``
          : ` AND ttv."CompanyName" = '${dateRange.company}'`}`



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

  getTransmitTransReport: async (id, company, SessionId) => {
    try {

      const client = await hdbClient();
      const sql = `SELECT
CT."Code" as TransmitCode,
CT."U_DESC" AS TRANSMITDESC,
CT."U_TRANSMIT_NUM" AS TRANSMITNUM,
CT."U_SPCFC_RELEASER" AS SPECIFICRELEASER,
UP."U_FIRSTNAME" || ' ' || UP."U_LASTNAME" AS TRANSMITEDBY,
UP2."U_FIRSTNAME" || ' ' || UP2."U_LASTNAME" AS RECEIVEDBY,
CT."U_TRANSMIT_BY" AS TRANSMITEDBY_CODE,
CT."U_TRANSMIT_DATE" AS TRANSMIT_DATE,
CT."U_IS_POSTED" AS ISPOSTED,
CT."U_CONTROL_COUNT" AS CONTROLCOUNT,
CT."U_CONTROL_AMT" AS CONTROLAMOUNT,
CT."U_RELEASING_LOC" AS RELEASING_LOCATION_CODE,
CT."U_DENIED" AS IS_DENIED,
LOC."U_LOCATION" AS RELEASING_LOCATION,
User_Group."U_GROUP_CODE" AS TRANSMITTING_GROUP_CODE,
User_Group."U_GROUP_DESC" AS TRANSMITTING_GROUP_NAME,
ua."U_ORG" AS COMPANY_NAME,
actual."actualAmount" AS ACTUALAMOUNT,
actual."actualCount" AS ACTUALCOUNT,
actual."Vouchers" AS VOUCHERS,
actual."CheckNum" AS actual_CHECKNUM,
actual."CompanyName" AS ACTUAL_COMPANYNAME
from "${process.env.COMPANYDB}"."@CHK_TRANSMIT" AS CT   
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" AS UP ON CT."U_TRANSMIT_BY" = UP."Code"  
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" AS UP2 ON CT."U_RCVD_BY" = UP2."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."@LOCATIONS" AS LOC ON CT."U_RELEASING_LOC" = LOC."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."@USER_ACCOUNTS" AS ua ON CT."U_TRANSMIT_BY" = ua."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."@USER_GROUPS" AS User_Group ON ua."U_USER_GROUP" = User_Group."Code" 
LEFT JOIN (SELECT
	 sum(c."CheckSum") AS "actualAmount",
	 count(c."DocEntry") AS "actualCount",
	 string_agg(CONCAT(c."CheckNum",
	 '  '))as "CheckNum",
	 string_agg(CONCAT(c."Vouchers",
	 '  '))as "Vouchers",
	 ct_1."U_TRANSMIT_NUM",
	 c."CompanyName"
	FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID"
	AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
	WHERE ct_1."U_TRANSMIT_NUM" IS NOT NULL
	AND ct_1."U_CHK_STATUS" = 2
	AND (c."DocEntry",
	 c."CompanyName") NOT IN (SELECT
	 "DocEntry" ,
	"CompanyName"
		FROM "${process.env.COMPANYDB}"."CTIS_StaledCks")
	AND c."Canceled" = 'N'
	GROUP BY ct_1."U_TRANSMIT_NUM",
	 c."CompanyName") actual ON CT."Code" = actual."U_TRANSMIT_NUM"
WHERE actual."CompanyName" IS NOT NULL AND ct."Code" = '${id}' AND actual."CompanyName" = '${company}'`;


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


    } catch (error) {
      console.log("error", error)
    }
  },

  getAutoReleaseTrans: async (id, company, SessionId) => {
    try {

      const client = await hdbClient();
      const sql = `SELECT
	 ct."Code",
	 ct."U_DESC",
	 ct."U_TRANSMIT_NUM",
	 ct."U_SPCFC_RELEASER",
	 ct."U_AUTO_RCVD_BY",
	 ct."U_AUTO_RLSD_BY",
	 ct."U_RCVD_BY",
	 ct."U_TRANSMIT_DATE",
	 ct."U_TRANSMIT_BY",
	 ct."U_IS_POSTED",
	 ct."U_CONTROL_COUNT",
	 ct."U_CONTROL_AMT",
	 ct."U_RELEASING_LOC",
	 ct."U_DENIED",
	 actual."actualCount",
	 actual."actualAmount",
	 ua2."U_FIRSTNAME" || ' ' || ua2."U_LASTNAME" AS "transmittedByName",
	 ua4."U_FIRSTNAME" || ' ' || ua4."U_LASTNAME" AS "receivedByName",
	 ua3."userGroupName" AS "releasingLocationName",
	 ua3."U_GROUP_CODE" AS "transmittingGroup",
	 actual."CheckNum",
	 actual."Vouchers",
	 actual."CompanyName",
	 loc."U_LOCATION",
	 useracc."U_USER_GROUP",
	 ug."U_GROUP_CODE" 
FROM "${process.env.COMPANYDB}"."@CHK_TRANSMIT" ct 
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua2 ON ct."U_TRANSMIT_BY" = ua2."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua3 ON ct."U_RELEASING_LOC" = ua3."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua4 ON ct."U_RCVD_BY" = ua4."Code" --LEFT JOIN "CTIS_userProfileView" ua5 ON ct."U_RCVD_BY" = ua5."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."@LOCATIONS" loc on ct."U_RELEASING_LOC" = loc."Code"
LEFT JOIN "${process.env.COMPANYDB}"."@USER_ACCOUNTS" useracc ON ct."U_TRANSMIT_BY" = useracc."Code" 
LEFT JOIN "${process.env.COMPANYDB}"."@USER_GROUPS" ug ON useracc."U_USER_GROUP" = ug."Code"
LEFT JOIN (SELECT
	 sum(c."CheckSum") AS "actualAmount",
	 count(c."DocEntry") AS "actualCount",
	 string_agg(CONCAT(c."CheckNum",
	 '  '))as "CheckNum",
	 string_agg(CONCAT(c."Vouchers",
	 '  '))as "Vouchers", 
	 ct_1."U_TRANSMIT_NUM",
	 c."CompanyName" 
	FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
	AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
	WHERE ct_1."U_TRANSMIT_NUM" IS NOT NULL 
	AND ct_1."U_CHK_STATUS" = 9
	AND (c."DocEntry",
	 c."CompanyName") NOT IN (SELECT
	 "DocEntry" ,
	"CompanyName" 
		FROM "${process.env.COMPANYDB}"."CTIS_StaledCks")
	AND c."Canceled" = 'N'
	GROUP BY ct_1."U_TRANSMIT_NUM",
	 c."CompanyName") actual ON ct."Code" = actual."U_TRANSMIT_NUM"
WHERE actual."CompanyName" IS NOT NULL AND ct."Code" = '${id}' AND actual."CompanyName" = '${company}'`;


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


    } catch (error) {
      console.log("error", error)
    }
  },

  getTransferTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
                    ct."Code",
                    ct."U_DESC",
                    ct."U_TRANSFER_NUM",
                    ct."U_RCVD_BY",
                    ct."U_TRANSMITTER",
                    ct."U_TRANSFER_DATE",
                    ct."U_TRANSFERRED_BY",
                    ct."U_IS_POSTED",
                    ct."U_CONTROL_COUNT",
                    ct."U_CONTROL_AMT",
                    ct."U_DENIED",
                    actual."actualCount",
                    actual."actualAmount",
                    ua2."U_FIRSTNAME" || ' ' || ua2."U_LASTNAME" AS "transmitterName",
                    ua3."U_FIRSTNAME" || ' ' || ua3."U_LASTNAME" AS "transferredByName",
                    ua4."U_FIRSTNAME" || ' ' || ua4."U_LASTNAME" AS "receivedByName",
                    ua3."userGroupName" AS "writerGroup",
                    actual."CheckNum",
                    actual."Vouchers",
                    actual."CompanyName" 
                 FROM "${process.env.COMPANYDB}"."@CHK_TRANSFER" ct 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua2 ON ct."U_TRANSMITTER" = ua2."Code" 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua3 ON ct."U_TRANSFERRED_BY" = ua3."Code" 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua4 ON ct."U_RCVD_BY" = ua4."Code" 
                 LEFT JOIN (SELECT
                    sum(c."CheckSum") AS "actualAmount",
                    count(c."DocEntry") AS "actualCount",
                    string_agg(CONCAT(c."CheckNum",
                    '  '))as "CheckNum",
                    string_agg(CONCAT(c."Vouchers",
                    '  '))as "Vouchers",
                    ct_1."U_TRANSFER_NUM",
                    c."CompanyName" 
                   FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 
                   JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
                   AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
                   WHERE ct_1."U_TRANSFER_NUM" IS NOT NULL 
                   AND c."CompanyName" = ct_1."U_ORGANIZATION" 
                   AND ct_1."U_CHK_STATUS" = 1 
                   AND c."DocEntry" NOT IN (SELECT
                    "DocEntry" 
                     FROM "${process.env.COMPANYDB}"."CTIS_StaledCks") 
                   AND c."Canceled" = 'N' 
                   GROUP BY ct_1."U_TRANSFER_NUM",
                    c."CompanyName") actual ON ct."Code" = actual."U_TRANSFER_NUM"
                    WHERE ct."Code"='${info}'`;

      // `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransferTransView" 
      // WHERE "Code" ='${info}'` 


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

  receiveTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_RECEIVE('${info.id}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: info.id,
          U_RCVD_BY: info.receivedBy,
          U_UPDATED_BY: info.receivedBy,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  getReceiveTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
                    c."Code",
                    c."U_RCV_NUM",
                    c."U_DESC",
                    c."U_RCV_DATE",
                    c."U_RCVD_BY",
                    c."U_RELEASER",
                    c."U_IS_POSTED",
                    c."U_CONTROL_COUNT",
                    c."U_CONTROL_AMT",
                    actual."actualCount",
                    actual."actualAmount",
                    ua."U_FIRSTNAME" ||  ' ' || ua."U_LASTNAME" AS "receiveByName",
                    ua1."U_FIRSTNAME" ||  ' ' || ua1."U_LASTNAME" AS "releaserName",
                    ua1."userGroupName" AS "releaserGroup",
                    actual."CheckNum",
                    actual."CompanyName" 
                 FROM "${process.env.COMPANYDB}"."@CHK_RECEIVE" c 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua ON c."U_RCVD_BY" = ua."Code" 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua1 ON c."U_RELEASER" = ua1."Code" 
                 LEFT JOIN ( SELECT
                    sum(c."CheckSum") AS "actualAmount",
                    count(c."DocEntry") AS "actualCount",
                    string_agg(CONCAT(c."CheckNum",
                    '  '))as "CheckNum",
                    ct_1."U_RECEIVE_NUM" ,
                    c."CompanyName" 
                   FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 
                   JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
                   AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
                   WHERE ct_1."U_RECEIVE_NUM" IS NOT NULL 
                   AND ct_1."U_CHK_STATUS" = 3 
                   AND c."DocEntry" NOT IN (SELECT
                    "DocEntry" 
                     FROM "${process.env.COMPANYDB}"."CTIS_StaledCks") 
                   AND c."Canceled" = 'N' 
                   GROUP BY ct_1."U_RECEIVE_NUM",
                    c."CompanyName") actual ON c."Code" = actual."U_RECEIVE_NUM" 
                    WHERE c."Code"='${info}'`

      // `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RcvTransView" 
      // WHERE "Code" ='${info}'`

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

  getReceivedTransactions: async (info, SessionId) => {

    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RcvTransView"
                    WHERE "U_IS_POSTED"='1'
                    AND "actualCount" is not null `+
        `${info != undefined
          ? ` AND "U_RCV_DATE" BETWEEN '${info.startDate}'
                         AND '${info.endDate}'`
          : ``
        }` +
        `${info.role === 'Check Releaser'
          ? ` AND "U_RELEASER" = '${info.user}'`
          : ``
        }` +
        `${info.company === 'null' || info.company === 'undefined'
          ? ``
          : ` AND "CompanyName" = '${info.company}'`}`


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



  getAllDocsReturnTransactions: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_returnTransView" AS rtv
left Join (select "Code" as transactGroupCode, "U_GROUP_CODE" AS TRANSGROUPC FROM "${process.env.COMPANYDB}"."CTIS_userProfileView")
AS upv on ${(info.role == 'Check Releaser') ? `rtv."U_RETURNED_BY" = upv."TRANSACTGROUPCODE" ` : `rtv."U_RETURNED_BY" = upv."TRANSACTGROUPCODE" `}
                    WHERE "actualCount" is not null  ${(info.role == 'Check Releaser') ? `and rtv."U_RETURNED_BY" = ${info.user}` : ``}
                     ${(info.company) ? `and "CompanyName" = '${info.company}'` : ``}
                  ${(info.groupCode && info.groupCode != 'ADMIN') ? `AND upv."TRANSGROUPC" = '${info.groupCode}'` : ``}` +
        `${info != undefined ? ` AND "U_RETURN_DATE" BETWEEN '${info.startDate}' AND  '${info.endDate}'` : ``}`
      // +
      // `${info.role === 'Check Releaser'
      //   ? ` AND "U_RETURNED_BY" = '${info.user}'`
      //   : `  `
      // }` +
      // `${info.role === 'Check Transmitter'
      //   ? `AND "U_RETURNED_TO" = '${info.user}'`
      //   : ` `
      // }`  

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

  getAllDocsPulloutTransactions: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_PulloutTransView"
                    WHERE "U_IS_POSTED" = '1'
                    AND "U_RCVD_BY" is null `+
        `${info != undefined
          ? ` AND "U_PULLOUT_DATE" BETWEEN '${info.startDate}'
                         AND '${info.endDate}'`
          : ``
        }` +
        `${info.role === 'CMT'
          ? ` AND "U_PULLOUT_TO" = '${info.user}'`
          : ``
        }` +
        `${info.company === 'null' || info.company === 'undefined'
          ? ``
          : ` AND "CompanyName" = '${info.company}'`}`



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

  getAllPulloutReceipts: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_PulloutRcptView"
                    WHERE "actualAmount" is not null
                    AND "actualCount" is not null `+
        `${info != undefined
          ? ` AND "U_RCPT_DATE" BETWEEN '${info.startDate}'
                         AND '${info.endDate}'`
          : ``
        }` +
        `${info.role === 'CMT'
          ? ` AND "U_RCVD_BY" = '${info.user}'`
          : ``
        }` +
        `${info.company === null || info.company === 'undefined'
          ? ``
          : ` AND "CompanyName" = '${info.company}'`}`


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

  getAllDocsRecallTransactions: async (info, SessionId) => {
    try {
      const Group = (info.groupCode && info.groupCode != 'ADMIN') ? `AND ug."recallGroupCode" = '${info.groupCode}'` : ``;
      const client = await hdbClient();
      const sql =

        ` SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RecallTransView" as rtv
      LEFT JOIN(SELECT "Code" as "recallCode","U_RECALL_TRANSMIT" from "${process.env.COMPANYDB}"."@CHK_RECALL" )AS rc
       on rtv."Code" = rc."recallCode"
       left join (select "Code" as "userGroupCode", "U_GROUP_CODE" as "recallGroupCode","U_GROUP_DESC" as "recallGroupDesc"from "${process.env.COMPANYDB}"."@USER_GROUPS" )
       as ug on rc."U_RECALL_TRANSMIT" = ug."userGroupCode"
       where
       rtv."U_RCVD_BY" is null ${Group}
      	 ` +
        `${info != undefined
          ? ` AND rtv."U_RECALL_DATE" BETWEEN '${info.startDate}'
                           AND '${info.endDate}'`
          : ``
        }` +
        // `${
        //   info.role === 'Check Transmitter'
        //       ? ` AND "U_RECALL_TO" = '${info.user}'`
        //       : ``
        //   }` +
        `${info.company === 'null' || info.company === 'undefined'
          ? ``
          : ` AND rtv."CompanyName" = '${info.company}'`}`

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

  getAllRecallReceipts: async (info, SessionId) => {
    try {
      const Group = (info.groupCode && info.groupCode != 'ADMIN') ? ` AND upv."U_GROUP_CODE" = '${info.groupCode}'` : ``;
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RecallRcptsView" as rrv left join (select "Code" as "userCodes","U_EMPLOYEE_ID",
      "U_FIRSTNAME","U_LASTNAME","U_MIDDLENAME","U_ROLE","U_USER_GROUP","roleName","userGroupName","U_IS_ACTIVE","U_GROUP_CODE",
      "U_ACCTG_GROUP","CompanyName" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as upv on
      rrv."U_RCVD_BY" = upv."userCodes"
                    WHERE rrv."actualCount" is not null ${Group}
                    AND rrv."actualAmount" is not null `+
        `${info != undefined
          ? ` AND rrv."U_RCPT_DATE" BETWEEN '${info.startDate}'
                         AND '${info.endDate}'`
          : ``
        }` +
        // `${
        //   info.role === 'Check Transmitter'
        //       ? ` AND "U_RCVD_BY" = '${info.user}'`
        //       : ``
        //   }` +
        `${info.company === null || info.company === undefined
          ? ``
          : ` AND rrv."CompanyName" = '${info.company}'`}`



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

  getRecallReceipt: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
                  c."Code",
                  c."U_RECALL_RCPT_NUM",
                  c."U_RECEIVED_FROM",
                  c."U_DESC",
                  c."U_RCPT_DATE",
                  c."U_RCVD_BY",
                  c."U_IS_POSTED",
                  c."U_CONTROL_COUNT",
                  c."U_CONTROL_AMT",
                  actual."actualCount",
                  actual."actualAmount",
                  ua."U_FIRSTNAME" || ' '  || ua."U_LASTNAME" AS "receivedFromName",
                  ua1."U_FIRSTNAME" || ' ' || ua1."U_LASTNAME" AS "receivedByName",
                  ua1."userGroupName" AS "transmittingGroup" ,
                  actual."CheckNum",
                  actual."CompanyName" 
               FROM "${process.env.COMPANYDB}"."@CHK_RECALL_RCPT" c 
               LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua ON c."U_RECEIVED_FROM" = ua."Code" 
               LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua1 ON c."U_RCVD_BY" = ua1."Code" 
               LEFT JOIN ( SELECT
                  sum(c."CheckSum") AS "actualAmount",
                  count(c."DocEntry") AS "actualCount",
                  string_agg(CONCAT(c."CheckNum",
                  '  '))as "CheckNum",
                  ct_1."U_RECALL_RCPT_NUM",
                  c."CompanyName" 
                 FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 
                 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
                 AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
                 WHERE ct_1."U_RECALL_RCPT_NUM" IS NOT NULL 
                 AND ct_1."U_CHK_STATUS" = 7 
                 GROUP BY ct_1."U_RECALL_RCPT_NUM",
                  c."CompanyName") actual ON c."Code" = actual."U_RECALL_RCPT_NUM" 
                 WHERE c."Code" ='${info}'`

      //  `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_RecallRcptsView"
      //       WHERE "Code"='${info}'`;

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

  getDocsRecallTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
                     c."Code",
                     c."U_RECALL_NUM",
                     c."U_RECALL_TO",
                     c."U_DESC",
                     c."U_RECALL_DATE",
                     c."U_RCVD_BY",
                     c."U_IS_POSTED",
                     c."U_CONTROL_COUNT",
                     c."U_CONTROL_AMT",
                     actual."actualCount",
                     actual."actualAmount",
                     ua."U_FIRSTNAME" || ' ' || ua."U_LASTNAME" AS "recallToName",
                     ua1."U_FIRSTNAME" || ' ' || ua1."U_LASTNAME" AS "receivedByName",
                     c."U_RECALLED_BY",
                     ua2."U_FIRSTNAME" || ' ' || ua2."U_LASTNAME" AS "recallByName",
                     c."U_RCPT_NUM",
                     ua2."userGroupName" AS "cmtGroup" ,
                     actual."CheckNum",
                     actual."CompanyName" 
                  FROM "${process.env.COMPANYDB}"."@CHK_RECALL" c 
                  LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua ON c."U_RECALL_TO" = ua."Code" 
                  LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua1 ON c."U_RCVD_BY" = ua1."Code" 
                  LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua2 ON c."U_RECALLED_BY" = ua2."Code" 
                  LEFT JOIN ( SELECT
                     sum(c."CheckSum") AS "actualAmount",
                     count(c."DocEntry") AS "actualCount",
                     string_agg(CONCAT(c."CheckNum",
                     '  '))as "CheckNum",
                     ct_1."U_RECALL_NUM",
                     c."CompanyName" 
                    FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 
                    JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
                    AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
                    WHERE ct_1."U_RECALL_NUM" IS NOT NULL 
                    AND ct_1."U_CHK_STATUS" = 7 
                    AND c."CompanyName" = ct_1."U_ORGANIZATION" 
                    GROUP BY ct_1."U_RECALL_NUM",
                     c."CompanyName") actual ON c."Code" = actual."U_RECALL_NUM" 
                    WHERE  c."Code" = '${info}'`


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

  getPulloutReceipt: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_PulloutRcptView"
                      WHERE "Code"='${info}'`;


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

  getReceivedReturnedTransactions: async (info, data, SessionId) => {
    try {

      const client = await hdbClient();
      const sql =
        `SELECT
      c."Code",
      c."U_RETURN_NUM",
      c."U_RETURNED_BY",
      c."U_RETURNED_TO",
      c."U_DESC",
      c."U_RETURN_DATE",
      c."U_IS_POSTED",
      c."U_CONTROL_COUNT",
      c."U_CONTROL_AMT",
      c."U_RCVD_BY",
      c."U_DENIED",
      c."U_RCPT_NUM" ,
         c."U_TRANS_RETURN_GROUP",
         ug."U_GROUP_DESC",
      ua."returnedByName",
      ua1."returnedToName",
     ua."releaserGroup",
       actual."CheckNum",
      actual."Vouchers",
      to_date(CURRENT_DATE) ,
      to_date(actual."DueDate"),
      ADD_MONTHS (to_date(actual."DueDate"),
      6) as "to_be_staled",
      actual."CompanyName" 
   FROM "${process.env.COMPANYDB}"."@CHK_RETURN" as c
   left join (select "Code" as "groupCodes" ,"U_GROUP_DESC","U_GROUP_CODE" as "GroupCode" from "${process.env.COMPANYDB}"."@USER_GROUPS" ) as ug on c."U_TRANS_RETURN_GROUP" = ug."groupCodes"
   LEFT JOIN(SELECT "Code" as "returnByCode", "U_FIRSTNAME" || ' ' || "U_LASTNAME"
         AS "returnedByName", "userGroupName" AS "releaserGroup"  from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua
on c."U_RETURNED_BY" = ua."returnByCode"
left join(SELECT "Code" as "returnToCode", "U_FIRSTNAME" || ' ' || "U_LASTNAME"
         AS "returnedToName", "userGroupName" AS "TransmitterGroup" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua1
on c."U_RETURNED_TO" = ua1."returnToCode"
LEFT JOIN ( SELECT
      sum(c."CheckSum") AS "actualAmount",
      count(c."DocEntry") AS "actualCount",
      string_agg(CONCAT(c."CheckNum",
      '  '))as "CheckNum",
      string_agg(CONCAT(c."Vouchers",
      '  '))as "Vouchers",
    ct_1."U_RETURN_NUM",
    string_agg(CONCAT(c."DueDate",
      '  '))as "DueDate",
      c."CompanyName"
     FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1
     JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID"
     AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
     WHERE ct_1."U_RETURN_NUM" IS NOT NULL
     AND ct_1."U_RETURN_RCPT_NUM" IS NULL
     AND ct_1."U_CHK_STATUS" = 4
     GROUP BY ct_1."U_RETURN_NUM",
    c."CompanyName") actual ON c."Code" = actual."U_RETURN_NUM"  WHERE to_date(CURRENT_DATE) < ADD_MONTHS (to_date(actual."DueDate"),
      6)AND  c."U_IS_POSTED"=1
            AND c."U_DENIED" =0
            AND c."U_RCVD_BY" IS NOT NULL
      AND  actual."actualCount" IS NOT NULL
      ${info ? `AND actual."CompanyName"='${info}'` : ""}`

      // `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_returnTransView"
      //                 WHERE "U_IS_POSTED"=1 
      //                 AND "U_DENIED"=0
      //                 AND "U_RCVD_BY" =${data}
      //                 AND "actualCount" is not null
      //                 --AND "U_RCPT_NUM" is null
      //                 ${info ? `AND "CompanyName"='${info}'` : "" }`

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

  getReceivedTransamitTransactions: async (info, data, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TrmsTransView"
                    WHERE "U_IS_POSTED"=1 
                    AND "U_DENIED"=0
                    AND "U_RCVD_BY"=${data}
                    AND "actualCount" is not null
                    ${info ? `AND "CompanyName"='${info}'` : ""}`

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

  getReceivedTransaferredTransactions: async (info, data, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_TransferTransView"
                    WHERE "U_IS_POSTED"=1 
                    AND "U_DENIED"=0
                    AND "U_RCVD_BY"=${data}
                    AND "actualAmount" is not null
                    ${info ? `AND "CompanyName"='${info}'` : ""}`


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

  getDocsPulloutTransaction: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
                    c."Code",
                    c."U_PULLOUT_NUM",
                    c."U_PULLOUT_TO",
                    c."U_DESC",
                    c."U_PULLOUT_DATE",
                    c."U_PULLOUT_BY",
                    c."U_IS_POSTED",
                    c."U_CONTROL_COUNT",
                    c."U_CONTROL_AMT",
                    actual."actualCount",
                    actual."actualAmount",
                    ua."U_FIRSTNAME" || ' ' || ua."U_LASTNAME" AS "pullOutToName",
                    ua1."U_FIRSTNAME" || ' ' || ua1."U_LASTNAME" AS "pullOutByName",
                    c."U_RCVD_BY",
                    c."U_RCPT_NUM",
                    ua1."userGroupName" AS "releasingGroup" ,
                    actual."CheckNum",
                    actual."CompanyName" 
                 FROM "${process.env.COMPANYDB}"."@CHK_POUT" c 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua ON c."U_PULLOUT_TO" = ua."Code" 
                 LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" ua1 ON c."U_PULLOUT_BY" = ua1."Code" 
                 LEFT JOIN ( SELECT
                    sum(c."CheckSum") AS "actualAmount",
                    count(c."DocEntry") AS "actualCount",
                    string_agg(CONCAT(c."CheckNum",
                    '  '))as "CheckNum",
                    ct_1."U_PULLOUT_NUM" ,
                    c."CompanyName" 
                   FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 
                   JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID" 
                   AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry" 
                   WHERE ct_1."U_PULLOUT_NUM" IS NOT NULL 
                   AND c."CompanyName" = ct_1."U_ORGANIZATION" 
                   AND ct_1."U_CHK_STATUS" = 6 
                   GROUP BY ct_1."U_PULLOUT_NUM",
                    c."CompanyName") actual ON c."Code" = actual."U_PULLOUT_NUM" 
                    WHERE c."Code"=${info}`

      // `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_PulloutTransView"
      // WHERE "Code"=${info}`;


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

  getDocsReturnTransaction: async (id, company, SessionId) => {
    try {
      const client = await hdbClient();

      const sql =

        `select c."Code",
  c."U_RETURN_NUM",
  c."U_RETURNED_BY",
  c."U_RETURNED_TO",
  c."U_DESC",
  c."U_RETURN_DATE",
  c."U_IS_POSTED",
  c."U_CONTROL_COUNT",
  c."U_CONTROL_AMT",
  c."U_RCVD_BY",
  c."U_DENIED",
  c."U_RCPT_NUM" ,
  c."U_TRANS_RETURN_GROUP",
  ua."returnedByName",
  ua2."returnedToName",
  ua."releaserGroup" ,
  ua2."TransmitterGroup" ,
         ugc."TransRetGroupCode",
         ugc."groupDesc",
         ugc."groupCodes",
  actual."CheckNum",
  actual."Vouchers",
  to_date(CURRENT_DATE) ,
  to_date(actual."DueDate"),
  ADD_MONTHS(to_date(actual."DueDate"),
6) as "to_be_staled",
  actual."CompanyName",
    actual."actualCount",
      actual."actualAmount"
from "${process.env.COMPANYDB}"."@CHK_RETURN" as c
LEFT JOIN(SELECT "Code" as "returnByCode", "U_FIRSTNAME" || ' ' || "U_LASTNAME"
         AS "returnedByName", "userGroupName" AS "releaserGroup"  from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua
on c."U_RETURNED_BY" = ua."returnByCode"
left join(SELECT "Code" as "returnToCode", "U_FIRSTNAME" || ' ' || "U_LASTNAME"
         AS "returnedToName", "userGroupName" AS "TransmitterGroup" from "${process.env.COMPANYDB}"."CTIS_userProfileView") as ua2
on c."U_RETURNED_TO" = ua2."returnToCode"
LEFT JOIN (SELECT "Code" as "TransRetGroupCode", "U_GROUP_DESC" AS "groupDesc","U_GROUP_CODE" AS "groupCodes" from "${process.env.COMPANYDB}"."@USER_GROUPS")
as ugc on ugc."TransRetGroupCode" =c."U_TRANS_RETURN_GROUP"
LEFT JOIN(SELECT
	 sum(c."CheckSum") AS "actualAmount",
  count(c."DocEntry") AS "actualCount",
  string_agg(CONCAT(c."CheckNum",
    '  ')) as "CheckNum",
  string_agg(CONCAT(c."Vouchers",
    '  ')) as "Vouchers",
  --string_agg(CONCAT(ct_1."U_RETURN_NUM",
    --'  ')) as "U_RETURN_NUM",
  ct_1."U_RETURN_NUM",
  --c."DueDate",
  string_agg(CONCAT(c."DueDate",
    '  ')) as "DueDate",
  c."CompanyName"
	FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" ct_1 JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON ct_1."U_CHK_LINE_NUM" = c."LineID"
	AND ct_1."U_CHK_DOC_ENTRY" = c."DocEntry"
	WHERE ct_1."U_RETURN_NUM" IS NOT NULL--AND ct_1."U_RETURN_RCPT_NUM" IS NULL--AND c."DocEntry" NOT IN(SELECT "U_CHK_DOC_ENTRY" FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS")
  and c."CompanyName" = '${company}'
	AND ct_1."U_CHK_STATUS" = 4
	GROUP BY ct_1."U_RETURN_NUM",
  --c."DueDate",
  c."CompanyName") actual ON c."Code" = actual."U_RETURN_NUM"
WHERE to_date(CURRENT_DATE) < ADD_MONTHS(to_date(actual."DueDate"),
  6) and c."Code" = ${id}`;





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

  receiveTransmitTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_TRANSMIT('${info.id}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: info.id,
          U_RCVD_BY: info.receivedBy,
          U_UPDATED_BY: info.receivedBy,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  receiveTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_RECEIVE('${info.id}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: info.id,
          U_RCVD_BY: info.receivedBy,
          U_UPDATED_BY: info.receivedBy,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  receiveDocsPulloutTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_POUT('${info.Code}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: info.Code,
          U_RCVD_BY: info.U_RCVD_BY,
          U_UPDATED_BY: info.receivedBy,
          U_RCPT_NUM: info.U_RCPT_NUM,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  receiveDocsReturnTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_RETURN('${info.id}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: info.id,
          U_RCVD_BY: info.receivedBy,
          U_UPDATED_BY: info.receivedBy,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  //tags return receipt to return transaction
  tagReturnReceipt: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_RETURN('${info.Code}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          U_RCVD_BY: info.U_RCVD_BY,
          U_UPDATED_BY: info.U_UPDATED_BY,
          U_RCPT_NUM: info.U_RCPT_NUM,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  receiveTransferTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_TRANSFER('${info.id}')`,

        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: info.id,
          U_RCVD_BY: info.receivedBy,
          U_UPDATED_BY: info.receivedBy,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },


  createRecallReceiptTransaction: async (info, SessionId) => {

    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_RECALL_RCPT`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  createRecallTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_RECALL`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  createPullOutReceiptTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_POUT_RCPT`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  createPulloutTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_POUT`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  createReturnReceipt: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_RETURN_RCPT`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  //to be delete
  createCheckTransferTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_TRANSACTIONS`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  rollBack: async (info, SessionId) => {

    try {
      const res = await axios({
        method: "DELETE",
        url: `${url}/CHK_TRANSFER('${info}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  findCheckTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${url}/U_CHK_TRANSACTIONS?$select=Code&$filter=U_CHK_LINE_NUM eq ${info.id.LineNum} and U_CHK_DOC_ENTRY eq ${info.id.DocEntry} and U_ORGANIZATION eq '${info.company}'`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      let company
      if (res.data.value.U_ORGANIZATION) {
        if (info.company.includes('Biotech')) {
          company = 'Biotech'
        } else {
          company = 'Revive'
        }
        for (let i = 0; i < res.data.value.length; i++) {
          const result = res.data.value[i];
          if (result.U_ORGANIZATION.includes(company)) {
            return res.data
          }

        }
      }

      return res.data;
    } catch (error) {
      console.log(error);
    }

    // try {
    //   const client = await hdbClient();
    //   const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" 
    //                 WHERE "U_CHK_LINE_NUM" =${info.data.LineNum} and "U_CHK_DOC_ENTRY" = ${info.data.DocEntry}
    //                 AND "U_ORGANIZATION"= '${info.company}'`  


    //   const result = await new Promise(resolve => {
    //     client.connect(function(err) {
    //       if (err) {
    //         return console.error("Connect error", err);
    //       }
    //       client.exec(sql, function(err, rows) {
    //         resolve(rows);
    //         client.end();
    //       });
    //     });
    //   });


    //   return result;
    // } catch (e) {
    //   console.log("Error: ", e);
    // }
  },

  findCheckTransactionDetails: async (info, SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" 
                    WHERE "U_CHK_LINE_NUM" =${info.data.LineNum} and "U_CHK_DOC_ENTRY" = ${info.data.DocEntry}
                    AND "U_ORGANIZATION"= '${info.company}'`


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

  // findCheckTransactionDetails: async (info, SessionId) => {

  //   try {
  //     const res = await axios({
  //       method: "GET",
  //       url: `${url}/U_CHK_TRANSACTIONS?$filter=U_CHK_LINE_NUM eq ${info.LineNum} and U_CHK_DOC_ENTRY eq ${info.DocEntry}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Cookie: `B1SESSION=${SessionId}`
  //       },
  //       httpsAgent: new https.Agent({
  //         rejectUnauthorized: false
  //       })
  //     });

  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  getRecalledReceiptsByTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${url}/sml.svc/CTIS_ACCTSPYBLCKS$filter=CompanyName eq '${info}'`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  createDocsReturnTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_RETURN`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  createReceiveTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_RECEIVE`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  createTransferTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_TRANSFER`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  createTransmitTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_CHK_TRANSMIT`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  receiveDocsRecallTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_CHK_RECALL('${info.id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          U_RCVD_BY: info.receivedBy,
          U_RCPT_NUM: info.receiptNumber,
          U_UPDATED_BY: info.user_id,
          U_TIME_UPDATED: moment(),
          U_DATE_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return {
        sucess: true
      }
    } catch (error) {
      return {
        sucess: false
      }
    }
  },

  denyTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/${info.transaction}('${info.id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          U_DENIED: 1,
          U_UPDATED_BY: info.user_id,
          U_TIME_UPDATED: moment(),
          U_DATE_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return {
        sucess: true
      }
    } catch (error) {
      return {
        sucess: false
      }
    }
  },

  unpostReceiveTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/${info.transaction}('${info.id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          U_RCVD_BY: null,
          U_TIME_UPDATED: moment(),
          U_DATE_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });


      return {
        sucess: true
      }
    } catch (error) {
      return {
        sucess: false
      }
    }
  },


  isTransactionDenied: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${url}/${info.transaction}('${info.id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return res.data
    } catch (error) {
      console.log(error)
    }
  },

  updateTransaction: async (data, info, SessionId) => {

    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/${data.transaction}('${data.id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          ...info
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return {
        success: true
      }
    } catch (error) {
      console.log(error);
      return {
        success: false
      }
    }
  },


  unpostTransaction: async (info, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/${info.transaction}('${info.id}')`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          U_IS_POSTED: 0,
          U_UPDATED_BY: info.user_id,
          U_TIME_UPDATED: moment(),
          U_DATE_UPDATED: moment()
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      return {
        sucess: true
      }
    } catch (error) {
      console.log(error)
      return {
        sucess: false
      }
    }
  },

  fix: async (tableName) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@${tableName}" 
      ORDER BY CAST("Code" as INTEGER) DESC limit 1`;

      let info = {
        castmax: null
      }

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
      if (!result[0]) {
        let info
        return info = null
      } else {
        const vars = result[0].castmax
        const format = parseInt(vars)
        info.castmax = format
        return info;
      }

    } catch (e) {
      console.log("Error: ", e);
    }
  },
};

module.exports = {
  transactions
};