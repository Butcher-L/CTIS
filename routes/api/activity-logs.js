const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    getActivityLogsController,
    getAllStatusController,
    getAllLocationController
} = require('../../src/controllers/activity-logs/app');

router.get('/get', verifytoken, makeExpressCallback(getActivityLogsController));
router.get('/status/get',  makeExpressCallback(getAllStatusController));
router.get('/location/get', makeExpressCallback(getAllLocationController))

module.exports = router;