const makeTransferEntity = ({ }) => {
    return function makeTransfer({
        transmitterGroupID, transferNumber, transmitter, transferredBy, description, controlCount, controlAmount, checks
    }) {
        if (!transferNumber) {
            throw new Error('no transfer number provided');
        };

        if (transmitterGroupID) {
            if (transmitterGroupID <= 0) {
                throw new Error('invalid group transmitter');
            }
        }

        // if(!transmitter){
        //     throw new Error('no transmitter indicated')
        // };

        if (!transferredBy) {
            throw new Error('transferredBy not provided');
        };

        if (!controlCount) {
            controlCount = 0;
        } else {
            if (controlCount < 0) {
                throw new Error('invalid control count');
            };
        };

        if (!controlAmount) {
            controlAmount = 0;
        } else {
            if (controlAmount < 0) {
                throw new Error('invalid control count');
            };
        };

        if (!checks) {
            throw new Error('variable \'checks\' not defined');
        } else {
            if (!Array.isArray(checks)) {
                throw new Error('variable checks should be an array');
            }

            if (!checks.length) {
                throw new Error('transaction should contain at least one (1) check');
            }
        };

        return Object.freeze({
            gettransmitterGroup: () => transmitterGroupID,
            getTransferNumber: () => transferNumber,
            getTransmitter: () => transmitter,
            getTransferredBy: () => transferredBy,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getDescription: () => description,
            getChecks: () => checks
        });
    }
};

module.exports = makeTransferEntity;