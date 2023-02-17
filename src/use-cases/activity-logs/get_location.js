// const moment = require('moment')
const getallLocation = ({ cma }) => {
    return async function get(SessionId){

        const fetch = await cma.getLocation(SessionId)

        return fetch
    }
};

module.exports = getallLocation;