const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    addUserController,
    authenticateUserController,
    getUserByUserGroupController,
    getAllUserAccountsController,
    updateUserAccountController,
    getUserAccountController,
    selectAllUserSAPController,
    resetPasswordController,
    editPasswordController,
    addUserSAPController
} = require('../../src/controllers/user-accounts/app');

router.post('/add', verifytoken, makeExpressCallback(addUserController));
router.post('/addSAP', verifytoken, makeExpressCallback(addUserSAPController));
router.post('/authenticate', makeExpressCallback(authenticateUserController));
router.get('/user-group/:id', verifytoken, makeExpressCallback(getUserByUserGroupController));
router.get('/all', verifytoken, makeExpressCallback(getAllUserAccountsController));
router.get('/get/:id', verifytoken, makeExpressCallback(getUserAccountController));
router.put('/update/:id', verifytoken, makeExpressCallback(updateUserAccountController));
router.post('/allSAP', makeExpressCallback(selectAllUserSAPController))
router.put('/reset/:id', makeExpressCallback(resetPasswordController))
router.put('/editpassword/:id', makeExpressCallback(editPasswordController))


module.exports = router;