const dotenv = require("dotenv");
dotenv.config();
const hdb = require("hdb");
async function hdbClient() {
  const client = hdb.createClient({
    host: process.env.SAP_HOST,
    port: process.env.SAP_PORT,
    user: process.env.SAPUSER,
    password: process.env.SAPPW
  });

  await client.on("error", err => {
    throw new Error(`Network connection error`);
  });

  return client;
  
}
module.exports = { hdbClient };