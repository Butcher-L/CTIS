const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    transferredChecksReportController,
    transmittedChecksReportController,
    releasedChecksReportController,
    staledChecksReportController,
    voidedChecksReportController,
    checkTrailController,
} = require('../../src/controllers/reports/app');

router.get('/transferred-checks', verifytoken, makeExpressCallback(transferredChecksReportController));
router.get('/transmitted-checks', verifytoken, makeExpressCallback(transmittedChecksReportController));
router.get('/released-checks', verifytoken, makeExpressCallback(releasedChecksReportController));
router.get('/staled-checks', verifytoken, makeExpressCallback(staledChecksReportController))
router.get('/voided-checks', verifytoken, makeExpressCallback(voidedChecksReportController));
router.post('/check-trail', verifytoken, makeExpressCallback(checkTrailController))

module.exports = router;