const locationsDb = require('../../data-access/locations/app');
const makeLocation = require('../../entities/location/app');

const {locations} = require("../../sl-access/location/location")

const getAllLocations = require('./locations-get-all');
const getLocation = require('./location-get-one');
const updateLocation = require('./location-update');
const addLocation = require('./location-add');
const getLocationToBeView = require("./location-to-be-view");

const getAllLocationsUseCase = getAllLocations({ locationsDb, locations});
const getLocationUseCase = getLocation({ locationsDb ,locations });
const updateLocationUseCase = updateLocation({ locationsDb, makeLocation, locations });
const addLocationUseCase = addLocation({ locationsDb, makeLocation, locations });
const getLocationToBeViewUseCase = getLocationToBeView({ locationsDb, locations});

const locationsService = Object.freeze({
    getAllLocationsUseCase,
    getLocationUseCase,
    updateLocationUseCase,
    addLocationUseCase,
    getLocationToBeViewUseCase
});

module.exports = locationsService;
module.exports = {
    getAllLocationsUseCase,
    getLocationUseCase,
    updateLocationUseCase,
    addLocationUseCase,
    getLocationToBeViewUseCase
};