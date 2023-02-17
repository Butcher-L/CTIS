const {
    getActivityLogsUseCase,
    getallStatusUseCase,
    getallLocationUseCase
} = require('../../use-cases/activity-logs/app');

const getActivityLogs = require('./get-activity-logs');
const getAllStatus = require("./get-status");
const getAllLocation = require("./get_location");

const getActivityLogsController = getActivityLogs({ getActivityLogsUseCase });
const getAllStatusController = getAllStatus({getallStatusUseCase});
const getAllLocationController = getAllLocation({getallLocationUseCase})

const activityLogsService = Object.freeze({
    getActivityLogsController,
    getAllStatusController,
    getAllLocationController
});

module.exports = activityLogsService;
module.exports = {
    getActivityLogsController,
    getAllStatusController,
    getAllLocationController
};