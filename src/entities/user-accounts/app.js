const makeUserAccountEntity = require('./user-account-entity');
const makeUserAccountSAPEntity = require('./user-account-SAP-entity');

const makeUserAccount = makeUserAccountEntity({});
const makeUserAccountSAP = makeUserAccountSAPEntity({})

module.exports = {
    makeUserAccount,
    makeUserAccountSAP
}
    
