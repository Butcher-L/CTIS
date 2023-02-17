const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    getActionController,
    getAllActionsController,
    makeActionController,
    updateActionController
} = require('../../src/controllers/action/app');

router.post('/add', verifytoken, makeExpressCallback(makeActionController));
router.get('/get-all', verifytoken, makeExpressCallback(getAllActionsController));
router.get('/get/:id', verifytoken, makeExpressCallback(getActionController));
router.put('/update/:id', verifytoken, makeExpressCallback(updateActionController));

module.exports = router;