const makeDb = require('../db');
const db = require('./activity-logs-db');

const activityLogDb = makeDb({ db });

module.exports = activityLogDb;