const makeDb = require('../db');
const db = require('./actions-db');

const actionsDb = makeDb({ db });

module.exports = actionsDb;