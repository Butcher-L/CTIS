const makeDb = require('../db');
const db = require('./role-db');

const rolesDb = makeDb({ db });

module.exports = rolesDb;