const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');


const {
    makeRoleController,
    getAllRolesController,
    getRoleController,
    updateRoleController
} = require('../../src/controllers/role/app');

router.post('/add', verifytoken, makeExpressCallback(makeRoleController));
router.get('/get-all', verifytoken, makeExpressCallback(getAllRolesController));
router.get('/get/:id', verifytoken, makeExpressCallback(getRoleController));
router.put('/update', verifytoken, makeExpressCallback(updateRoleController));


module.exports = router;