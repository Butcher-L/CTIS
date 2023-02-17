const makeDocsReturnEntity = ({ }) => {
    return function makeDocsReturn({
        returnNumber, returnedBy, returnTo, description, controlCount, controlAmount, checks, returnTransmitGroup
    }) {
        if (!returnNumber) {
            throw new Error('return number not provided');
        };

        if (!returnedBy) {
            throw new Error('returnedBy not provided');
        }

        // if(!returnTo){
        //     throw new Error('returnTo not provided');
        // };

        if (!description) {
            description = "";
        };

        if (returnTransmitGroup == null) {
            throw new Error('Please select Transmitter Group')
        } else {
            if (returnTransmitGroup < 0) {
                throw new Error('invalid return Transmitter Group');
            };
        }
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
            getReturnNumber: () => returnNumber,
            getReturnedBy: () => returnedBy,
            getReturnTo: () => returnTo,
            getDescription: () => description,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getTransmitGroupID: () => returnTransmitGroup,
            getChecks: () => checks
        })

    };
};

module.exports = makeDocsReturnEntity;