const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    getAllTransmitterGroupsController, 
    getUserGroupController, 
    getAllCmtGroupsController, 
    getAllUserGroupsController, 
    addUserGroupController, 
    updateUserGroupController, 
    getAllAcctgGroupsController, 
    getByAcctgGroupController 
} = require('../../src/controllers/user-groups/app');

router.get('/get-all', verifytoken, makeExpressCallback(getAllUserGroupsController));
router.get('/transmitter-groups', verifytoken, makeExpressCallback(getAllTransmitterGroupsController));
router.get('/cmt-groups', verifytoken, makeExpressCallback(getAllCmtGroupsController));
router.get('/acctg-groups', verifytoken, makeExpressCallback(getAllAcctgGroupsController));
router.get('/by-acctg-group/:id', verifytoken, makeExpressCallback(getByAcctgGroupController));
router.get('/:id', verifytoken, makeExpressCallback(getUserGroupController));
router.put('/:id', verifytoken, makeExpressCallback(updateUserGroupController));
router.post('/add', verifytoken, makeExpressCallback(addUserGroupController));


module.exports = router;