const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../hdb/app");
// ############
// base url for sap
const url = process.env.SAP_URL;
const cma = {
  // login SL credentials;
  userLogin: async () => {
    try {
      const data = {
        CompanyDB: process.env.DB,
        Password: process.env.PW,
        UserName: process.env.USERS
      };
      const res = await axios.post(`${url}/Login`, data, {
        headers: {
          "Content-Type": "application/json"
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      const d = {
        status: res.status,
        msg: res.statusText,
        data: res.data.SessionId
      };
      return d;
    } catch (e) {
      const err = {
        status: e.response.status,
        msg: e.response.statusText,
        data: e.response.data
      };
      return err;
    }
  },
  UserAll: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@USER_ACCOUNTS"`;
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

  getStatus: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@CHK_STATUS"`;
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

  getLocation: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@LOCATIONS"`;
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

  selectAllOrganization: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "SLDDATA"."COMPANYDBS" 
                      WHERE "COMPANYDBS"."NAME"='${process.env.MDDB}' 
                      OR "COMPANYDBS"."NAME"='${process.env.RDB}'`;
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

  validateToDone: async (info) => {
    try {
     const company = {
      db:info.CompanyName==process.env.CMPR ? process.env.MDDB: process.env.RDB,
     }
     console.log(`SELECT b."DocNum", b."LineID", b."U_APP_CTIS_ChkStat" FROM "${company.db}"."VPM1" b 
     LEFT JOIN "${company.db}"."OVPM" a ON a."DocEntry" = b."DocNum" 
     WHERE b."DocNum" = ${info.id.DocEntry}`);
      const client = await hdbClient();
      const sql = `SELECT b."DocNum", b."LineID", b."U_APP_CTIS_ChkStat" FROM "${company.db}"."VPM1" b 
                    LEFT JOIN "${company.db}"."OVPM" a ON a."DocEntry" = b."DocNum" 
                    WHERE b."DocNum" = ${info.id.DocEntry}`;
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

  selectAllUserSAP: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_userProfileView"`;
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


  selectAllUser: async (info) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT
                        oe."empID",
                        oe."ExtEmpNo",
                        oe."lastName", 
                        oe."firstName", 
                        oe."middleName",
                        oe."userId", 
                        (SELECT
                        "COMPANYNAME" 
                          FROM "SLDDATA"."COMPANYDBS" 
                          WHERE "NAME"='${info}') AS CompanyName
                        FROM "${info}"."OHEM" oe`;
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

  validate: async (info) => {
    try {
     const company = {
      db:info.CompanyName==process.env.CMPR  ? process.env.MDDB: process.env.RDB,
     }
      const client = await hdbClient();
      const sql = `SELECT ovpm."DocEntry",ovpm."CheckSum",vpm1."DocNum",vpm1."U_APP_CTIS_ChkStat",opch."U_APP_cntr_rctp_no"
                  FROM "${company.db}"."OVPM" ovpm
                  LEFT JOIN "${company.db}"."VPM1" AS vpm1 ON ovpm."DocEntry"=vpm1."DocNum"
                  LEFT JOIN "${company.db}"."VPM2" AS vpm2 ON vpm1."DocNum"= vpm2."DocNum"
                  LEFT JOIN "${company.db}"."OPCH" AS opch ON vpm2."DocEntry"=opch."DocEntry"
                  WHERE vpm2."DocNum"=${info.id.DocEntry}`;
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

  
  update: async (info) => {
    try {
     const company = {
      db:info.CompanyName==process.env.CMPR  ? process.env.MDDB: process.env.RDB,
     }
      const client = await hdbClient();
      const sql = `UPDATE "${process.env.CRA}"."@TRANSACTION_HEADER" SET "U_STATUS" = '6'	WHERE "U_CNTR_RCPT_NO" = '${info}'`;
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

  
  selectByOrganization: async (info,datefilter) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_actPblChcksView" 
                    WHERE "CompanyName"='${info.Company}'
                    ${datefilter != undefined ? 
                      `AND "CreateDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'` : `` }
                    `;

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
      // console.log(result)
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  selectByOrganizationbackToActPyb: async (info,datefilter) => {
    try {
      const client = await hdbClient();
      const sql = 
      `SELECT 
      t.*,
      c.* FROM "${process.env.COMPANYDB}"."@CHK_TRANSACTIONS" t
      LEFT JOIN "${process.env.COMPANYDB}"."CTIS_CheckDetailsView" c ON c."DocEntry" = t."U_CHK_DOC_ENTRY" 
      and c."LineID"=t."U_CHK_LINE_NUM"
      and c."CompanyName" = t."U_ORGANIZATION"
      WHERE t."U_CHK_STATUS" is null OR t."U_CHK_STATUS"='0'
      AND
      (	c."DocEntry",
      	c."LineID",
		c."CompanyName" )
	   NOT IN (SELECT
	 "DocEntry" ,
	 "LineID",
	 "CompanyName" 
	FROM "${process.env.COMPANYDB}"."CTIS_actPblChcksView")
      AND t."U_TRANSFER_NUM" is null
      AND c."Canceled" = 'N'
      AND c."CompanyName"='${info.Company}'
      ${datefilter != undefined ? 
        `AND c."CreateDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'` : `` }
      `;


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
      // console.log(result)
      return result;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

  validateUser: async (info) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_userProfileView" where "U_EMPLOYEE_ID"='${info}'`;
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

  GetUser: async (info) => {
    try {
  
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@USER_ACCOUNTS" WHERE "U_EMPLOYEE_ID"='${info}'`;
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

  checkUser: async (info) => {
    try {
  
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."CTIS_userProfileView" where "U_EMPLOYEE_ID"='${info}'`;
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

  selectAllActivityLogs: async () =>{
    try{
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@ACT_LOGS" ORDER BY CAST("Code" AS INTEGER) DESC;`;
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
  }




};
module.exports = { cma };
