const makeDb = require('../db');
const db = require('./reports-db');

const reportsDb = makeDb({ db });

module.exports = reportsDb;