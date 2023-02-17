const moment = require("moment");
const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");

// base url for sap
const url = process.env.SAP_URL;
const xsjs = process.env.XSJS;

const accessRights = {

    addAccessRight: async (info,SessionId) => {
        try{
            const res = await axios({
                url: `${url}/U_ROLES_ACCESS`,
                method: "POST",
                data: {
                    ...info,
                    U_DATE_CREATED: moment(),
                    U_TIME_CREATED: moment()
                },
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                  },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            return res.data;
        } catch(error){
            console.log(error)
        }
    },

    editAccessRight: async (info, id, SessionId) => {
      try{
          const res = await axios({
              url: `${url}/U_ROLES_ACCESS(Code = '${id}')`,
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  Cookie: `B1SESSION=${SessionId}`
              },
              data: {
                ...info,
                U_DATE_UPDATED: moment(),
                U_TIME_UPDATED: moment()
              },
              httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          }); 
          return res.data;
      } catch(error){
          console.log(error);
      };
    },

    listAccessRightsByRole: async (info, SessionId) => {
      try{
          const res = await axios({
              url: `${url}/$crossjoin(U_ROLES_ACCESS, U_ROLES, U_USER_ACTIONS)?$expand=U_ROLES($select=Code, `+
              `U_ROLE_NAME),U_ROLES_ACCESS($select=Code, U_ROLE_ID , U_ROLE_ACTION, U_IS_ACTIVE),U_USER_ACTIONS($select=Code,`+
              `U_ACTION_DESC,U_IS_ACTIVE,U_ACTION_MODULE)&$filter=U_ROLES_ACCESS/U_ROLE_ID eq U_ROLES/Code and`+
              ` U_ROLES_ACCESS/U_ROLE_ACTION eq U_USER_ACTIONS/Code and U_ROLES/Code eq '${info}' and U_ROLES_ACCESS/U_IS_ACTIVE eq 1`,
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  Cookie: `B1SESSION=${SessionId}`,
                  Prefer: "odata.maxpagesize = 300"
                },
              httpsAgent: new https.Agent({ rejectUnauthorized: false })
          });
          return res.data;
      } catch(error){
          console.log(error)
      }
  },

  getMaxCode: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@ROLES_ACCESS" 
      ORDER BY CAST("Code" as INTEGER) DESC limit 1`;
      let info={
        data:{castmax:null}
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
      info.data.castmax=format
      return info;
    } catch (e) {
      console.log("Error: ", e);
    }
  },

};

module.exports = {
    accessRights
}
