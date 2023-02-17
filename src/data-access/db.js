const dotenv = require("dotenv");
const pg = require("pg");
dotenv.config();

// console.log(process.env.PGDATABASE);
// console.log(process.env.PGUSER);
const env = process.env.DM_ENV;
try {
  if (env === "dev") {
    process.env.PGDATABASE = "check_trail_dev";
  }
  if (env === "test") {
    process.env.PGDATABASE = "check_trail_test";
  }
  if (env === "uat") {
    process.env.PGDATABASE = "check_trail_uat";
  }
  if (env === "prod") {
    process.env.PGDATABASE = "check_trail_prod";
  }
  if (env === "sqa") {
    process.env.PGDATABASE = "check_trail_sqa";
  }
} catch (e) {
  console.log(e);
}

const config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  host: process.env.PGHOST,
  // max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000
};

const pool = new pg.Pool(config);

async function dbs() {
  try {
    return pool;
  } catch (e) {
    pool.end(); //end connection
    console.log("Errors: ", e);
  }
}

const makeDb = ({ db }) => {
  return db({ dbs });
};

module.exports = makeDb;
