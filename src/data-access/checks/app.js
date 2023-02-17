const makeDb = require('../db');
const db = require('./checks-db');

const checksDb = makeDb({db});

module.exports = checksDb;