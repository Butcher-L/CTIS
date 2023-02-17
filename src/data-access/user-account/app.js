const makeDb = require('../db');
const db = require('./user-accounts-db');

const userAccountsDb = makeDb({ db });

module.exports = userAccountsDb;