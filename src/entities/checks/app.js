const moment = require('moment');
const makeCheckEntity = require('./check-entity');

const makeCheck = makeCheckEntity({moment});

module.exports = makeCheck;