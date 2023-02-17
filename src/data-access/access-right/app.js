const makeDb = require('../db');
const db = require('./access-rights-db');

const accessRightsDb = makeDb({ db });

module.exports = accessRightsDb;