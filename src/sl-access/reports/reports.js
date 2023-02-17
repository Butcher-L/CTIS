const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");

const moment =  require("moment");

require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");
dotenv.config();
// ############

// base url for sap
const url = process.env.SAP_URL;
const xsjs= process.env.XSJS;

const reports = {

  selectAllActivityLogs: async (info,SessionId) => {
    try {
          // declare empty array; to store every after pagination
      let data = [];

      const request = async link => {
        let res;
        // main request
        res = await axios({
          method: "GET",
          url: `${url}/${link}`,
          headers: {
            "Content-Type": "application/json",
            Cookie: `B1SESSION=${SessionId}`
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const arr = res.data.value;
        for await (let i of arr) {
          data.push(i);
        }
        // loop always if there is next link
        while (res.data["odata.nextLink"]) {
          const nextPage = res.data["odata.nextLink"];
          await request(nextPage);
          break;
        }
      };

     await request(
        `U_ACT_LOGS?$orderby=U_date desc `
        +
      
        `${
          info.startDate != info.endDate
            ? `&$filter=U_date ge '${info.startDate}' and U_date le '${info.endDate}'`
            : `&$filter=U_date ge '${info.startDate}'`
        }`
        ,
         
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `B1SESSION=${SessionId}`
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
      );
      return data;
    } catch (e) {
      return e;
    }
},
 
  getVoidedChecksReport: async (info,SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_CheckDetailsView"
                    WHERE "Canceled" ='Y' `+
                    `${
                      info.startDate != undefined
                        ? `and "CreateDate" between '${info.startDate}' and '${info.endDate}'`
                        : ``
                    }` 

                 

      const result = await new Promise(resolve => {
        client.connect(function(err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function(err, rows) {
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
  getReleasedChecksReport: async (info,SessionId) => {
    try {
      const client = await hdbClient();
      const sql =   `SELECT 
                          t."Code",
                          tf."U_TRANSFER_NUM" as "transferNumber",
                          tf."U_TRANSFER_DATE" as "transferDate",
                          up."U_GROUP_CODE" as "writerGroup",
                          up."U_FIRSTNAME" || ' ' || up."U_LASTNAME" AS "transferredBy",
                          up1."U_FIRSTNAME" || ' ' || up1."U_LASTNAME" AS "transmittedBy",
                          up1."U_GROUP_CODE" as "transmittingGroup",
                          tm."U_TRANSMIT_NUM" as "transmittalNumber",
                          tm."U_TRANSMIT_DATE" as "transmittalDate",
                          t."U_RELEASE_DATE" as "releaseDate",
                          up2."U_FIRSTNAME" || ' ' || up2."U_LASTNAME" AS "releasedBy",
                          rc."U_RCV_NUM" as "receiveNumber",
                          rc."U_RCV_DATE" as "receiveDate",
                          up3."userGroupName" as "releasingLocationName",
                          cd.* 
                          FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" t 
                            LEFT JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" cd ON cd."DocEntry" = t."U_CHK_DOC_ENTRY"
                            LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSFER" tf ON tf."Code" = t."U_TRANSFER_NUM"
                            LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSMIT" tm ON tm."Code" = t."U_TRANSMIT_NUM"
                            LEFT JOIN "${process.env.COMPANYDB}"."@CHK_RECEIVE" rc ON rc."Code" = t."U_RECEIVE_NUM"
                            LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up ON up."Code"=tf."U_TRANSFERRED_BY"
                            LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up1 ON up1."Code"=tm."U_TRANSMIT_BY"
                            LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up2 ON up2."Code"=t."U_RELEASED_BY"
                            LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up3 ON up3."Code"=rc."U_RELEASER"	
                            AND cd."LineID" = t."U_CHK_LINE_NUM"
                            AND cd."CompanyName" = t."U_ORGANIZATION"
                            WHERE t."U_RELEASE_DATE" is not null
                            ${
                              info.startDate != undefined
                                ? `AND t."U_RELEASE_DATE" BETWEEN '${info.startDate}' AND '${info.endDate}'`
                                : ``
                            }` 




                    
      const result = await new Promise(resolve => {
        client.connect(function(err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function(err, rows) {
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

  getStaledChecksReport: async (info,SessionId) => {
    try {
      const client = await hdbClient();
      const sql =  `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_StaledCks"
      ${
        info.startDate != undefined
          ? ` WHERE "to_be_staled" BETWEEN '${info.startDate}' AND '${info.endDate}'`
          : ``
      }` 



                    
      const result = await new Promise(resolve => {
        client.connect(function(err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function(err, rows) {
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

  getTransferredChecksReport: async (info,SessionId) => { 
    try {
      const client = await hdbClient();
      const sql = 
      `SELECT 
      c."DocEntry",
      c."LineID",
      c."CheckNum",
      c."CreateDate",
      c."CardName",
      c."U_APP_PayeeName",
      c."Vouchers",
      c."VoucherDate",
      c."CheckSum",
      c."DocDate",
      c."DueDate",
      c."BankCode",
      c."AcctNum",
      c."Comments",
      c."U_NAME",
      t."U_ORGANIZATION",
      tf."U_TRANSFER_NUM" AS "transferNumber",
      tm."U_TRANSMIT_NUM" AS "transmittalNumber",
      tf."U_TRANSFER_DATE" AS "transferDate",
      tm."U_TRANSMIT_DATE" AS "transmittalDate",
      up."U_FIRSTNAME" || ' ' || up."U_LASTNAME" AS "transferredBy",
      up."U_GROUP_CODE" AS "writerGroup",
      CASE WHEN tm."U_TRANSMIT_NUM" IS NULL THEN ''
      ELSE up1."U_FIRSTNAME" || ' ' || up1."U_LASTNAME"  END AS "transmittedByName",
      CASE WHEN tm."U_TRANSMIT_NUM" IS NULL THEN ''
      ELSE  g."U_GROUP_DESC"  END AS "transmittingGroup",
      --up1."U_FIRSTNAME" || ' ' || up1."U_LASTNAME" AS "transmittedByName",
      --g."U_GROUP_DESC" AS "transmittingGroup",
      up2."U_FIRSTNAME" || ' ' || up2."U_LASTNAME" AS "releaserByName",
      CASE WHEN t."U_RELEASED_BY" IS NULL THEN ''
      ELSE l."U_LOCATION"  END AS "releasingLocationName"
     FROM "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c 
     LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" t ON t."U_CHK_DOC_ENTRY" = c."DocEntry" 
     AND t."U_CHK_LINE_NUM" =c."LineID" 
     AND t."U_ORGANIZATION"  = c."CompanyName"
     LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSFER" tf ON tf."Code" = t."U_TRANSFER_NUM"
     LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSMIT" tm ON tm."Code" = t."U_TRANSMIT_NUM"
     LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up ON up."Code" = tf."U_TRANSFERRED_BY"
     LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up1 ON up1."Code" = tf."U_TRANSMITTER"
     LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up2 ON up2."Code" = t."U_RELEASED_BY"
     LEFT JOIN "${process.env.COMPANYDB}"."@USER_GROUPS" g ON up1."U_USER_GROUP" = g."Code"
     LEFT JOIN "${process.env.COMPANYDB}"."@LOCATIONS" l ON l."Code"=g."U_LOCATION_ID"
    WHERE t."U_TRANSFER_NUM" IS NOT NULL 
    ${
      info.startDate != undefined
        ? ` AND c."CreateDate" between '${info.startDate}' and '${info.endDate}'`
        : ``
    }`


      // `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_REPORTRFCKS"`+
      //               `${
      //                 info.startDate != undefined
      //                   ? ` WHERE "CreateDate" between '${info.startDate}' and '${info.endDate}'`
      //                   : ``
      //               }` 

      const result = await new Promise(resolve => {
        client.connect(function(err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function(err, rows) {
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

  getTransmittedChecksReport: async (info,SessionId) => {

    try {
      const client = await hdbClient();
      const sql = 
   
      `SELECT 
      c."DocEntry",
      c."LineID",
      c."CheckNum",
      c."CreateDate",
      c."CardName",
      c."U_APP_PayeeName",
      c."Vouchers",
      c."VoucherDate",
      c."CheckSum",
      c."DocDate",
      c."DueDate",
      c."BankCode",
      c."AcctNum",
      c."Comments",
      c."U_NAME",
      t."U_ORGANIZATION",
      tf."U_TRANSFER_NUM" AS "transferNumber",
      tm."U_TRANSMIT_NUM" AS "transmittalNumber",
      tf."U_TRANSFER_DATE" AS "transferDate",
      tm."U_TRANSMIT_DATE" AS "transmittalDate",
      up."U_FIRSTNAME" || ' ' || up."U_LASTNAME" AS "transferredBy",
      up."U_GROUP_CODE" AS "writerGroup",
      CASE WHEN tm."U_TRANSMIT_NUM" IS NULL THEN ''
      ELSE up1."U_FIRSTNAME" || ' ' || up1."U_LASTNAME"  END AS "transmittedByName",
      CASE WHEN tm."U_TRANSMIT_NUM" IS NULL THEN ''
      ELSE  g."U_GROUP_DESC"  END AS "transmittingGroup",
      --up1."U_FIRSTNAME" || ' ' || up1."U_LASTNAME" AS "transmittedByName",
      --g."U_GROUP_DESC" AS "transmittingGroup",
      up2."U_FIRSTNAME" || ' ' || up2."U_LASTNAME" AS "releaserByName",
      --CASE WHEN t."U_RELEASED_BY" IS NULL THEN ''
      --ELSE l."U_LOCATION"  END AS "releasingLocationName"
      l."U_LOCATION" AS "releasingLocationName"
     FROM "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c 
     LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" t ON t."U_CHK_DOC_ENTRY" = c."DocEntry" 
     AND t."U_CHK_LINE_NUM" =c."LineID" 
     AND t."U_ORGANIZATION"  = c."CompanyName"
     LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSFER" tf ON tf."Code" = t."U_TRANSFER_NUM"
     LEFT JOIN "${process.env.COMPANYDB}"."@CHK_TRANSMIT" tm ON tm."Code" = t."U_TRANSMIT_NUM"
     LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up ON up."Code" = tf."U_TRANSFERRED_BY"
     LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up1 ON up1."Code" = tf."U_TRANSMITTER"
     LEFT JOIN "${process.env.COMPANYDB}"."CTIS_userProfileView" up2 ON up2."Code" = t."U_RELEASED_BY"
     LEFT JOIN "${process.env.COMPANYDB}"."@USER_GROUPS" g ON up1."U_USER_GROUP" = g."Code"
     LEFT JOIN "${process.env.COMPANYDB}"."@LOCATIONS" l ON l."Code"=tm."U_RELEASING_LOC"
    WHERE t."U_TRANSFER_NUM" IS NOT NULL 
    ${
      info.startDate != undefined
        ? ` AND c."CreateDate" between '${info.startDate}' and '${info.endDate}'`
        : ``
    }`



      
      // `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_REPORTRMCKS"`+
      //               `${
      //                 info.startDate != undefined
      //                   ? ` WHERE "CreateDate" between '${info.startDate}' and '${info.endDate}'`
      //                   : ``
      //               }` 
                    
      const result = await new Promise(resolve => {
        client.connect(function(err) {
          if (err) {
            return console.error("Connect error", err);
          }
          client.exec(sql, function(err, rows) {
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

};

module.exports = { reports };
