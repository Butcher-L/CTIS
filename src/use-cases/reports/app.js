const reportsDb = require('../../data-access/reports/app');
const transactionsDb = require('../../data-access/transaction/app');
const checksDb = require('../../data-access/checks/app');

//sl
const {reports} = require('../../sl-access/reports/reports');
const {transactions} = require('../../sl-access/transaction/transaction');
const {checks} = require('../../sl-access/checks/checks')

const transferredChecksReport = require('./transferred-checks-report');
const transmittedChecksReport = require('./transmitted-check-report');
const voidedChecksReport = require('./voided-checks-report');
const releasedChecksReport = require('./released-checks-report');
const staledChecksReport = require('./staled-checks-report')
const getCheckTrail = require('./get-check-trail');


const getCheckTrailUseCase = getCheckTrail({reportsDb, transactionsDb, checksDb, transactions, checks})
const transferredChecksReportUseCase = transferredChecksReport({ reportsDb, getCheckTrailUseCase, reports });
const transmittedChecksReportUseCase = transmittedChecksReport({ reportsDb, getCheckTrailUseCase, reports });
const releasedChecksReportUseCase = releasedChecksReport({ reportsDb, getCheckTrailUseCase, reports });
const staledChecksReportUseCase = staledChecksReport({ reportsDb, getCheckTrailUseCase, reports })
const voidedChecksReportUseCase = voidedChecksReport({ reportsDb, getCheckTrailUseCase, reports });

const reportsService = Object.freeze({
    transferredChecksReportUseCase,
    transmittedChecksReportUseCase,
    releasedChecksReportUseCase,
    staledChecksReportUseCase,
    voidedChecksReportUseCase,
    getCheckTrailUseCase
});

module.exports = reportsService;
module.exports = {
    transferredChecksReportUseCase,
    transmittedChecksReportUseCase,
    releasedChecksReportUseCase,
    staledChecksReportUseCase,
    voidedChecksReportUseCase,
    getCheckTrailUseCase
};