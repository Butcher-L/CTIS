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

const locations = {


  selectAllLocationToBeView: async (SessionId) => {

    try {
      const res = await axios.get(
        `${url}/U_LOCATIONS?$filter=U_IS_ACTIVE ne 0`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `B1SESSION=${SessionId}`
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
      );
      console.log(res);

      return res.data;
    } catch (error) {
      return error;
    }
  },
 
  selectAllLocation: async (SessionId) => {
    try {
      const res = await axios.get(
        `${url}/U_LOCATIONS?$orderby=Code asc`,
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


  selectLocations: async (Code,SessionId) => {
    try {
      const data = {
        Code: Code
      };

      const res = await axios.get(
        `${url}/U_LOCATIONS(Code='${data.Code}')`,
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

  updateLocations: async (data,SessionId) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `${url}/U_LOCATIONS(Code='${data.Code}')`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          Name: data.Name,
          U_LOCATION_CODE: data.U_LOCATION_CODE,
          U_LOCATION: data.U_LOCATION,
          U_IS_ACTIVE: data.U_IS_ACTIVE,
          U_UPDATED_BY: data.U_UPDATED_BY,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment(),
          U_IS_AUTO_RELEASE:data.U_IS_AUTO_RELEASE
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

  addLocations: async (data,SessionId) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${url}/U_LOCATIONS`,
        data,
        headers: {
          "Content-Type": "application/json",
          Cookie: `B1SESSION=${SessionId}`
        },
        data: {
          Code: data.Code,
          Name: data.Name,
          U_LOCATION_CODE: data.U_LOCATION_CODE,
          U_LOCATION: data.U_LOCATION,
          U_IS_ACTIVE: data.U_IS_ACTIVE,
          U_CREATED_BY: data.U_CREATED_BY,
          U_DATE_UPDATED: moment(),
          U_TIME_UPDATED: moment(),
          U_DATE_CREATED: moment(),
          U_TIME_CREATED: moment(),
          U_IS_AUTO_RELEASE:data.U_IS_AUTO_RELEASE
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
    //   console.log("kja",res.data);
      return res.data;
    } catch (error) {
      console.log(error.data);
    }
  },

  
  fix: async () => {
    try {
      const client = await hdbClient();
      const sql = `SELECT "Code" AS "castmax" FROM "${process.env.COMPANYDB}"."@LOCATIONS" 
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

module.exports = { locations };
