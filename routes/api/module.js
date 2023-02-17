const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    getAllModulesController,
    getModuleController,
    makeModuleController,
    updateModuleController
} = require('../../src/controllers/module/app');

router.post('/add', verifytoken, makeExpressCallback(makeModuleController));
router.get('/get-all', verifytoken, makeExpressCallback(getAllModulesController));
router.get('/get/:id', verifytoken, makeExpressCallback(getModuleController));
router.put('/update/:id', verifytoken, makeExpressCallback(updateModuleController));

module.exports = router;