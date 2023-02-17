const makeDocsRecallEntity = ({ }) => {
    return function makeDocsRecall({
        recallNumber, recallTo, receivedBy, recallBy, description, controlCount, controlAmount, checks, recallTransmitGroup
    }) {
        if (!recallNumber) {
            throw new Error('recall number not provided');
        };

        // if(!recallTo){
        //     throw new Error('recallTo not provided');
        // }

        if (!recallBy) {
            throw new Error('recallBy not provided');
        }

        if (recallTransmitGroup == null) {
            throw new Error('Please select Transmitter Group')
        } else {
            if (recallTransmitGroup < 0) {
                throw new Error('invalid recall Transmitter Group');
            };
        }
        // if(!receivedBy){
        //     throw new Error('receivedBy not provided');
        // };

        if (!description) {
            description = "";
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
            getRecallNumber: () => recallNumber,
            getRecallTo: () => recallTo,
            getReceivedBy: () => receivedBy,
            getDescription: () => description,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getRecallBy: () => recallBy,
            getChecks: () => checks,
            getrecallTransmitGroup: () => recallTransmitGroup
        })

    };
};

module.exports = makeDocsRecallEntity;