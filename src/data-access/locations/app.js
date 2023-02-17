const makeDb = require('../db');
const db = require('./locations-db');

const locationsDb = makeDb({ db });

module.exports = locationsDb;