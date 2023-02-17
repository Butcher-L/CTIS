const {cma} = require('../../hdb-query/hdb');
const {reports} = require('../../sl-access/reports/reports')

const getActivityLogs = require('./get-activity-logs');
const getallStatus = require("./get-status");
const getallLocation = require("./get_location")

const getActivityLogsUseCase = getActivityLogs({ reports,cma});
const getallStatusUseCase = getallStatus({cma})
const getallLocationUseCase = getallLocation({cma})

const activityLogsService = Object.freeze({
    getActivityLogsUseCase,
    getallStatusUseCase,
    getallLocationUseCase
});

module.exports = activityLogsService;
module.exports = {
    getActivityLogsUseCase,
    getallStatusUseCase,
    getallLocationUseCase
};