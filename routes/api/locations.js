const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');


const {
    getAllLocationsController,
    getLocationController,
    addLocationController,
    updateLocationController,
    getAllLocationToBeViewController
} = require('../../src/controllers/locations/app');

router.get('/get-all', makeExpressCallback(getAllLocationsController));
router.post('/add',  makeExpressCallback(addLocationController));
router.put('/update/:id', makeExpressCallback(updateLocationController));
router.get('/get', makeExpressCallback(getAllLocationToBeViewController));
router.get('/:id',  makeExpressCallback(getLocationController));



module.exports = router;