const makeDb = require('../db');
const db = require('./user-groups-db');

const userGroupsDb = makeDb({ db });

module.exports = userGroupsDb;