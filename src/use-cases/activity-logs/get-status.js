// const moment = require('moment')
const getallStatus = ({ cma }) => {
    return async function get(SessionId){

        const fetch = await cma.getStatus(SessionId)

        return fetch
    }
};

module.exports = getallStatus;