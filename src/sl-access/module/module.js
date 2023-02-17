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

const modules = {
  selectAllModules: async (SessionId) => {
    try {
      const client = await hdbClient();
      const sql = `SELECT * FROM "${process.env.COMPANYDB}"."@MODULES"
                  ORDER BY "Code" ASC`   

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

  selectModules: async (Code, SessionId) => {
    try {
      const data = {
        Code: Code
      };
      const res = await axios.get(
        `${url}/U_MODULES?$select=Code,U_MODULE_DESC,U_IS_ACTIVE&$filter=Code eq '${data.Code}'`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `B1SESSION=${SessionId}`
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
      );

      return res.data;
    } catch (error) {
      return error;
    }
  },

  updateModule: async (data, SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_MODULES(Code='${data.Code}')`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          U_MODULE_DESC: data.U_MODULE_DESC,
          U_IS_ACTIVE: data.U_IS_ACTIVE,
          U_UPDATED_BY: data.U_UPDATED_BY,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  addModule: async (data, SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_MODULES`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          Name: data.Name,
          U_MODULE_DESC: data.U_MODULE_DESC,
          U_IS_ACTIVE: data.U_IS_ACTIVE,
          U_CREATED_BY: data.U_CREATED_BY,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment(),
          U_DATE_CREATED: moment(),
          U_TIME_CREATED: moment()
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      return res.data;
    } catch (error) {
      console.log(error.data);
      // const err = {
      //     status: error.response.status,
      //     msg: error.response.statusText,
      //     data: error.response.data
      //   };
      // return err
    }
  },

  fix: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@MODULES" 
      ORDER BY CAST("Code" as INTEGER) DESC limit 1`;
      let info={
        castmax:null
      }

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

      const vars = result[0].castmax
      const format = parseInt(vars)
      info.castmax=format
      return info;
    } catch (e) {
      console.log("Error: ", e);
    }
  }

};

module.exports = { modules };
