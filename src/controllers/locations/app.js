const {
    getAllLocationsUseCase,
    getLocationUseCase,
    addLocationUseCase,
    updateLocationUseCase,
    getLocationToBeViewUseCase
} = require('../../use-cases/locations/app');

const getAllLocations = require('./locations-get-all');
const getLocation = require('./location-get-one');
const addLocation = require('./location-add');
const updateLocation = require('./location-update');
const getAllLocationToBeView= require("./location-to-be-view");

const getAllLocationsController = getAllLocations({ getAllLocationsUseCase });
const getLocationController = getLocation({ getLocationUseCase });
const addLocationController = addLocation({ addLocationUseCase });
const updateLocationController = updateLocation({ updateLocationUseCase });
const getAllLocationToBeViewController = getAllLocationToBeView({getLocationToBeViewUseCase});

const locationsController = Object.freeze({
    getAllLocationsController,
    getLocationController,
    addLocationController,
    updateLocationController,
    getAllLocationToBeViewController
});

module.exports = locationsController;
module.exports = {
    getAllLocationsController,
    getLocationController,
    addLocationController,
    updateLocationController,
    getAllLocationToBeViewController
};