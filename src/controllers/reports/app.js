const {
    transferredChecksReportUseCase,
    transmittedChecksReportUseCase,
    releasedChecksReportUseCase,
    staledChecksReportUseCase,
    voidedChecksReportUseCase,
    getCheckTrailUseCase
} = require('../../use-cases/reports/app')

const transferredChecksReport = require('./transferred-checks-report');
const transmittedChecksReport = require('./transmitted-check-report');
const releasedChecksReport = require("./released-checks-report");
const staledChecksReport = require("./staled-checks-report");
const voidedChecksReport = require('./voided-checks-report');
const checkTrail = require("./get-check-trail")

const transferredChecksReportController = transferredChecksReport({ transferredChecksReportUseCase });
const transmittedChecksReportController = transmittedChecksReport({ transmittedChecksReportUseCase });
const releasedChecksReportController = releasedChecksReport({ releasedChecksReportUseCase });
const staledChecksReportController = staledChecksReport({ staledChecksReportUseCase });
const voidedChecksReportController = voidedChecksReport({ voidedChecksReportUseCase });
const checkTrailController = checkTrail({getCheckTrailUseCase})

const reportsService = Object.freeze({
    transferredChecksReportController,
    transmittedChecksReportController,
    releasedChecksReportController,
    staledChecksReportController,
    voidedChecksReportController,
    checkTrailController
});

module.exports = reportsService;
module.exports = {
    transferredChecksReportController,
    transmittedChecksReportController,
    releasedChecksReportController,
    staledChecksReportController,
    voidedChecksReportController,
    checkTrailController
};