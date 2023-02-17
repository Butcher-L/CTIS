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

const roles = {

    getRole: async (id, SessionId) => {
        try{
            const res = await axios({
                url: `${url}/U_ROLES(Code = '${id}')`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            }); 
            return res.data;
        } catch(error){
            console.log(error);
        };
    },

    updateRole: async (info, id,SessionId) => {

        try{
            const res = await axios({
                url: `${url}/U_ROLES(Code = '${id}')`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                data: {
                    ...info,
                    U_DATE_UPDATED: moment(),
                    U_TIME_UPDATED: moment()
                }
            });

            return res;
        } catch(error){
            console.log(error);
        };
    },

    getRoles: async (SessionId) => {
        try{
            const res = await axios.get(`${url}/U_ROLES?$select=Code,U_ROLE_NAME,U_IS_ACTIVE`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            return res.data;

        }catch(error) {
            console.log(error)
        }
    },

    getRoleByName: async (info,SessionId) => {
        try{
            const res = await axios.get(`${url}/U_ROLES?$filter=U_ROLE_NAME eq '${info}'`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            return res.data;

        }catch(error) {
            console.log(error)
        }
    },

    addRole: async (info,SessionId) => {
        
        try{
            const res = await axios({
                url: `${url}/U_ROLES`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                data: {
                    ...info,
                    
                    U_DATE_UPDATED: moment(),
                    U_TIME_UPDATED: moment(),
                    U_DATE_CREATED: moment(),
                    U_TIME_CREATED: moment()
                }
            });
            
            return res.data;
        }catch(error) {
            console.log(error)
        }
    },


    getMaxCode: async () => {
        try {
          const client = await hdbClient();
          const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@ROLES" 
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
    roles
}
