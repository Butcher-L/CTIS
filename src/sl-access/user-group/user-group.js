const https = require("https");
const axios = require("axios");
const dotenv = require("dotenv");

const moment =  require("moment");
dotenv.config();


require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { hdbClient } = require("../../hdb/app");
// ############

// base url for sap
const url = process.env.SAP_URL;
const xsjs= process.env.XSJS;

const userGroups = {
  selectAllUserGroups: async (SessionId) => {
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
        `$crossjoin(U_USER_GROUPS,U_ACCTG_GROUPS,U_LOCATIONS)?$expand=U_USER_GROUPS($select=Code,U_GROUP_CODE,U_GROUP_DESC,U_LOCATION_ID,U_ACCTG_GROUP,U_IS_ACTIVE,U_CREATED_BY,U_UPDATED_BY,U_DATE_UPDATED,U_TIME_UPDATED,U_DATE_CREATED,U_TIME_CREATED), U_ACCTG_GROUPS($select=Code,U_ACCTG_GROUP), U_LOCATIONS($select=Code,U_LOCATION_CODE,U_LOCATION) &$filter=U_USER_GROUPS/U_ACCTG_GROUP eq U_ACCTG_GROUPS/Code and (U_USER_GROUPS/U_LOCATION_ID eq U_LOCATIONS/Code)  &$orderby=U_USER_GROUPS/Code asc`,
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

  
  selectByTransmitterGroup: async (SessionId) => {
    try {
      const res = await axios.get(
        `${url}/$crossjoin(U_USER_GROUPS,U_ACCTG_GROUPS,U_LOCATIONS)?$expand=U_USER_GROUPS($select=Code,U_GROUP_CODE,U_GROUP_DESC,U_LOCATION_ID,U_ACCTG_GROUP,U_IS_ACTIVE,U_CREATED_BY,U_UPDATED_BY,U_DATE_UPDATED,U_TIME_UPDATED,U_DATE_CREATED,U_TIME_CREATED), U_ACCTG_GROUPS($select=Code,U_ACCTG_GROUP), U_LOCATIONS($select=Code,U_LOCATION_CODE,U_LOCATION) &$filter=U_USER_GROUPS/U_ACCTG_GROUP eq U_ACCTG_GROUPS/Code and (U_USER_GROUPS/U_LOCATION_ID eq U_LOCATIONS/Code) and U_USER_GROUPS/U_ACCTG_GROUP eq '2' &$orderby=U_USER_GROUPS/Code asc`,
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

  selectAllAcctgGroups: async (SessionId) => {
    try {
      const res = await axios.get(
        `${url}/U_ACCTG_GROUPS`,
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



  selectByCMTGroup: async (SessionId) => {
    try {
      const res = await axios.get(
        `${url}/$crossjoin(U_USER_GROUPS,U_ACCTG_GROUPS,U_LOCATIONS)?$expand=U_USER_GROUPS($select=Code,U_GROUP_CODE,U_GROUP_DESC,U_LOCATION_ID,U_ACCTG_GROUP,U_IS_ACTIVE,U_CREATED_BY,U_UPDATED_BY,U_DATE_UPDATED,U_TIME_UPDATED,U_DATE_CREATED,U_TIME_CREATED), U_ACCTG_GROUPS($select=Code,U_ACCTG_GROUP), U_LOCATIONS($select=Code,U_LOCATION_CODE,U_LOCATION) &$filter=U_USER_GROUPS/U_ACCTG_GROUP eq U_ACCTG_GROUPS/Code and (U_USER_GROUPS/U_LOCATION_ID eq U_LOCATIONS/Code) and U_USER_GROUPS/U_ACCTG_GROUP eq '4' &$orderby=U_USER_GROUPS/Code asc`,
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

selectByUserGroups: async (Code,SessionId) => {
    try {
      const data = {
        Code: Code
      };
      
      const res = await axios.get(
        `${url}/$crossjoin(U_USER_GROUPS,U_ACCTG_GROUPS,U_LOCATIONS)?$expand=U_USER_GROUPS($select=Code,U_GROUP_CODE,U_GROUP_DESC,U_LOCATION_ID,U_ACCTG_GROUP,U_IS_ACTIVE,U_CREATED_BY,U_UPDATED_BY,U_DATE_UPDATED,U_TIME_UPDATED,U_DATE_CREATED,U_TIME_CREATED), U_ACCTG_GROUPS($select=Code,U_ACCTG_GROUP), U_LOCATIONS($select=Code,U_LOCATION_CODE,U_LOCATION) &$filter=U_USER_GROUPS/U_ACCTG_GROUP eq U_ACCTG_GROUPS/Code and (U_USER_GROUPS/U_LOCATION_ID eq U_LOCATIONS/Code) and U_USER_GROUPS/U_ACCTG_GROUP eq '${data.Code}' &$orderby=U_USER_GROUPS/Code asc`,
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

  selectUserGroups: async (Code,SessionId) => {
    try {
      const data = {
        Code: Code
      };

      const res = await axios.get(
        `${url}/$crossjoin(U_USER_GROUPS,U_ACCTG_GROUPS,U_LOCATIONS)?$expand=U_USER_GROUPS($select=Code,U_GROUP_CODE,U_GROUP_DESC,U_LOCATION_ID,U_ACCTG_GROUP,U_IS_ACTIVE,U_CREATED_BY,U_UPDATED_BY,U_DATE_UPDATED,U_TIME_UPDATED,U_DATE_CREATED,U_TIME_CREATED), U_ACCTG_GROUPS($select=Code,U_ACCTG_GROUP), U_LOCATIONS($select=Code,U_LOCATION_CODE,U_LOCATION) &$filter=U_USER_GROUPS/U_ACCTG_GROUP eq U_ACCTG_GROUPS/Code and (U_USER_GROUPS/U_LOCATION_ID eq U_LOCATIONS/Code) and U_USER_GROUPS/Code eq '${data.Code}' &$orderby=U_USER_GROUPS/Code asc`,
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

  updateUserGroups: async (data,SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_USER_GROUPS(Code='${data.Code}')`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          Name: data.Name,
          U_GROUP_CODE: data.U_GROUP_CODE,
          U_GROUP_DESC: data.U_GROUP_DESC,
          U_LOCATION_ID: data.U_LOCATION_ID,
          U_ACCTG_GROUP: data.U_ACCTG_GROUP,
          U_IS_ACTIVE: data.U_IS_ACTIVE,
          U_UPDATED_BY:data.U_UPDATED_BY,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment()
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      return res.data;
    } catch (error) {
      console.log(error);
      // const err = {
      //     status: error.response.status,
      //     msg: error.response.statusText,
      //     data: error.response.data
      //   };
      // return err
    }
  },
  
  checkIfExist: async (U_LOCATION,SessionId) => {
    try {
      const data = {
        U_LOCATION: U_LOCATION
      };

      const res = await axios.get(
        `${url}/U_LOCATIONS?$filter=U_LOCATION eq '${data.U_LOCATION}'`,
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

  addUserGroups: async (data,SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_USER_GROUPS`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          Name: data.Name,
          U_GROUP_CODE: data.U_GROUP_CODE,
          U_GROUP_DESC: data.U_GROUP_DESC,
          U_LOCATION_ID: data.U_LOCATION_ID,
          U_ACCTG_GROUP: data.U_ACCTG_GROUP,
          U_IS_ACTIVE:data.U_IS_ACTIVE,
          U_CREATED_BY:data.U_CREATED_BY,
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
    }
  },

  fix: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@USER_GROUPS" 
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
};

module.exports = { userGroups };
