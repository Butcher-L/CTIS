const makeReturnReceiptEntity = ({}) => {
    return function makeReturnReceipt({
        returnReceiptNumber, description, receivedFrom, receivedBy, controlCount, controlAmount, checks
    }){
        if(!returnReceiptNumber){
            throw new Error('no Return receipt number provided');
        };

        if(!description){
            description = "";
        };

        if(!receivedBy){
            throw new Error('receiveBy not provided');
        };

        if(!receivedFrom){
            throw new Error('receivedFrom not provided')
        }

        if(!controlCount){
            controlCount = 0;
        } else{
            if(controlCount < 0){
                throw new Error('invalid control count');
            };
        };

        if(!controlAmount){
            controlAmount = 0;
        } else{
            if(controlAmount < 0){
                throw new Error('invalid control count');
            };
        };

        if(!checks){
            throw new Error('variable \'checks\' not defined');
        } else{
            if(!Array.isArray(checks)){
                throw new Error('variable checks should be an array');
            }

            if(!checks.length){
                throw new Error('transaction should contain at least one (1) check');
            }
        };

        return Object.freeze({
            getReturnReceiptNumber: () => returnReceiptNumber,
            getDescription: () => description,
            getReceiveBy: () => receivedBy,
            getReceivedFrom: () => receivedFrom,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getChecks: () => checks
        });
    };
}

module.exports = makeReturnReceiptEntity;