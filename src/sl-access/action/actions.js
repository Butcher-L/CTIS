const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");

require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");

const moment =  require("moment");
dotenv.config();
// ############

// base url for sap
const url = process.env.SAP_URL;
const xsjs= process.env.XSJS;

const actions = {
  selectAllActions: async (SessionId) => {
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
        `$crossjoin(U_USER_ACTIONS,U_MODULES)?$expand=U_USER_ACTIONS($select=Code,U_ACTION_MODULE,U_ACTION_DESC,U_IS_ACTIVE),U_MODULES($select=Code,U_MODULE_DESC)&$filter=U_USER_ACTIONS/U_ACTION_MODULE eq U_MODULES/Code and (U_MODULES/Code eq U_USER_ACTIONS/U_ACTION_MODULE)`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `B1SESSION=${process.env.SESSIONID}`
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
      );

      return data;
    } catch (e) {
      return e;
    }
  },

  selectActions: async (Code,SessionId) => {
    try {
      const data = {
        Code: Code
      };

      const res = await axios.get(
        `${url}/$crossjoin(U_USER_ACTIONS,U_MODULES)?$expand=U_USER_ACTIONS($select=Code,U_ACTION_MODULE,U_ACTION_DESC,U_IS_ACTIVE),U_MODULES($select=Code,U_MODULE_DESC)&$filter=U_USER_ACTIONS/U_ACTION_MODULE eq U_MODULES/Code and (U_MODULES/Code eq U_USER_ACTIONS/U_ACTION_MODULE) and U_USER_ACTIONS/Code eq '${data.Code}'`,
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

  updateActions: async (data,SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_USER_ACTIONS(Code='${data.Code}')`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          U_ACTION_DESC: data.U_ACTION_DESC,
          U_IS_ACTIVE: data.U_IS_ACTIVE,
          U_UPDATE_BY: data.U_UPDATE_BY,
          U_ACTION_MODULE:data.module,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },
  
  checkIfExist: async (U_ACTION_DESC,SessionId) => {
    try {
      const data = {
        U_ACTION_DESC: U_ACTION_DESC
      };

      const res = await axios.get(
        `${url}/U_USER_ACTIONS?$filter=U_ACTION_DESC eq '${data.U_ACTION_DESC}'`,
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

  addActions: async (data, SessionId) => {
    try {
      
      const res = await axios({
        method: "POST",
        url: `${url}/U_USER_ACTIONS`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          Name: data.Name,
          U_ACTION_MODULE: data.U_ACTION_MODULE,
          U_ACTION_DESC: data.U_ACTION_DESC,
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
      console.log(error);
    }
  },

  fix: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@USER_ACTIONS" 
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
  },

}

module.exports = { actions };
