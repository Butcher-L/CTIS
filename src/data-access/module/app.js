const makeDb = require('../db');
const db = require('./modules-db');

const modulesDb = makeDb({ db });

module.exports = modulesDb;