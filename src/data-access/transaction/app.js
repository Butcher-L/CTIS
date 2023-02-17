const makeDb = require('../db');
const db = require('./transactions-db');

const transactionsDb = makeDb({ db });

module.exports = transactionsDb;