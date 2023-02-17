const jwt = require('jsonwebtoken');
const config = require('../../../middlewares/config.js');

const jwtFunction = () => {
    return Object.freeze({
        generateToken
    });

    async function generateToken(account) {
        return jwt.sign({
            employeeId: account.U_EMPLOYEE_ID,
            roleId: account.U_CTIS_role
        }, config.secret);
    }

}

module.exports = jwtFunction;