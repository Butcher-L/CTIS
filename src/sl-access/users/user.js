
const moment = require("moment");
const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");
const hdb = require("../../hdb/app")
dotenv.config();
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");

// ############

// base url for sap
const url = process.env.SAP_URL;
const xsjs = process.env.XSJS;


const users = {
    userLogin: async () => {
        try {
            const data = {
                CompanyDB: process.env.COMPANYDB,
                Password: process.env.PASSWORD,
                UserName: process.env.UNAME
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

    masterDataDBLogin: async (info) => {
        try {
            const data = {
                CompanyDB: info==process.env.CMPR  ? process.env.MDDB: process.env.RDB,
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

    getUser: async (EmployeeId, SessionId) => {
        try {
            const data = {
                EmployeeId: EmployeeId
            }

            const res = await axios.get(`${url}/$crossjoin(U_USER_ACCOUNTS, U_ROLES, U_USER_GROUPS, U_LOCATIONS, U_ACCTG_GROUPS)`+
                        `?$expand=U_USER_ACCOUNTS($select=Code, U_EMPLOYEE_ID, U_FIRSTNAME, U_MIDDLENAME, U_LASTNAME, U_USERNAME, U_ROLE, `+
                        `U_USER_GROUP, U_IS_ACTIVE, U_PASSWORD,U_ORG), U_ROLES($select=Code, U_ROLE_NAME), U_USER_GROUPS($select=Code, U_GROUP_CODE, U_GROUP_DESC, `+
                        `U_LOCATION_ID, U_ACCTG_GROUP), U_LOCATIONS($select=U_LOCATION, U_LOCATION_CODE), U_ACCTG_GROUPS($select=Code, U_ACCTG_GROUP)&`+
                        `$filter=U_USER_ACCOUNTS/U_ROLE eq U_ROLES/Code and U_USER_ACCOUNTS/U_USER_GROUP eq U_USER_GROUPS/Code and `+
                        `U_USER_GROUPS/U_LOCATION_ID eq  U_LOCATIONS/Code and U_USER_GROUPS/U_ACCTG_GROUP eq U_ACCTG_GROUPS/Code `+
                        `and (U_USER_ACCOUNTS/U_EMPLOYEE_ID eq '${data.EmployeeId}' or U_USER_ACCOUNTS/U_USERNAME eq '${data.EmployeeId}')`, 
                {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            console.log(res);

            return res.data

        } catch (error) {
            console.log(error.response)
        }
    },

    getUserByCode: async (id,SessionId) => {
        try {
            const res =  await axios({
                url: `${url}/$crossjoin(U_USER_ACCOUNTS, U_ROLES, U_USER_GROUPS)`+
                `?$expand=U_USER_ACCOUNTS($select=Code, U_EMPLOYEE_ID, U_FIRSTNAME, U_MIDDLENAME, U_LASTNAME, `+
                `U_USERNAME, U_ROLE, U_USER_GROUP, U_IS_ACTIVE), U_ROLES($select=Code, U_ROLE_NAME), U_USER_GROUPS($select=Code,` +
                `U_GROUP_CODE, U_GROUP_DESC)&$filter=U_USER_ACCOUNTS/U_ROLE eq U_ROLES/Code `+
                `and U_USER_ACCOUNTS/U_USER_GROUP eq U_USER_GROUPS/Code and U_USER_ACCOUNTS/Code eq '${id}'`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    getUserByUserGroup: async (id,SessionId,data) => {
        try {
            const client = await hdb.hdbClient();
            const sql = `select 
            ua."Code",
            ua."U_EMPLOYEE_ID",
            ua."U_FIRSTNAME",
            ua."U_MIDDLENAME",
            ua."U_LASTNAME",
            ua."U_USERNAME",
            ua."U_ROLE",
            ua."U_USER_GROUP",
            r."U_ROLE_NAME",
            ug."U_GROUP_DESC",
            ug."U_GROUP_CODE",
            ua."U_IS_ACTIVE",
            ua."U_ORG"
         from "${process.env.COMPANYDB}"."@USER_ACCOUNTS" ua
        JOIN "${process.env.COMPANYDB}"."@ROLES" r on ua."U_ROLE"=r."Code"
        JOIN "${process.env.COMPANYDB}"."@USER_GROUPS" ug ON ua."U_USER_GROUP"=ug."Code"
        WHERE ua."U_USER_GROUP"='${id}'
        ${data ?
        `AND ua."U_ORG" = '${data}'`: ``}`;


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
        } catch (error) {
            console.log(error);
        }

    },

    getAllUserAccounts: async (SessionId) => {
        try {
            const res =  await axios({
                url: `${url}/$crossjoin(U_USER_ACCOUNTS, U_ROLES, U_USER_GROUPS)`+
                `?$expand=U_USER_ACCOUNTS($select=Code, U_EMPLOYEE_ID, U_FIRSTNAME, U_MIDDLENAME, U_LASTNAME, `+
                `U_USERNAME, U_ROLE, U_USER_GROUP, U_IS_ACTIVE), U_ROLES($select=Code, U_ROLE_NAME), U_USER_GROUPS($select=Code,` +
                `U_GROUP_CODE, U_GROUP_DESC)&$filter=U_USER_ACCOUNTS/U_ROLE eq U_ROLES/Code `+
                `and U_USER_ACCOUNTS/U_USER_GROUP eq U_USER_GROUPS/Code`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `B1SESSION=${SessionId}`
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    addUser: async (info,SessionId) => {
        try {

            const res = await axios({
                url: `${url}/U_USER_ACCOUNTS`,
                method: 'POST',
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
            
        } catch (error) {
            console.log(error);
        }
    },

    editPassword: async (info, id,SessionId) => {
        try {
            const res = await axios({
                url: `${url}/U_USER_ACCOUNTS('${id}')`,
                method: 'PATCH',
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

            return res.data;
            
        } catch (error) {
            console.log(error);
        }
    },


    resetPassword: async (info, id,SessionId) => {
        try {
            const res = await axios({
                url: `${url}/U_USER_ACCOUNTS('${id}')`,
                method: 'PATCH',
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

            return res.data;
            
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (info, id,SessionId) => {
        try {
            const res = await axios({
                url: `${url}/U_USER_ACCOUNTS('${id}')`,
                method: 'PATCH',
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

            return res.data;
            
        } catch (error) {
            console.log(error);
        }
    },

    getMaxCode: async () => {
        try {
          const client = await hdbClient();
          const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@USER_ACCOUNTS" 
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

    Company: async() => {
        try {
            const client = await hdb.hdbClient();
            const sql = `SELECT "NAME","COMPANYNAME" FROM "SLDDATA"."COMPANYDBS"`;
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
        } catch (error) {
            console.log(error);
        }

    }

};

module.exports = { users };