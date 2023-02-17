const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');


const {
    addAccessRightController,
    getRoleAccessRightsController
} = require('../../src/controllers/access-right/app');

router.post('/add', verifytoken, makeExpressCallback(addAccessRightController));
router.get('/role/:roleId', verifytoken, makeExpressCallback(getRoleAccessRightsController));
// router.get('/get/:id', makeExpressCallback(getActionController));
// router.put('/update/:id', makeExpressCallback(updateActionController));

module.exports = router;