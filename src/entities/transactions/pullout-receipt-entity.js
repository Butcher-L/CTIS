const makePulloutReceiptEntity = ({}) => {
    return function makePulloutReceipt({
        receiptNumber, description, receivedFrom, receivedBy, controlCount, controlAmount, checks
    }){
        if(!receiptNumber){
            throw new Error('receipt number provided');
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
            getReceiptNumber: () => receiptNumber,
            getDescription: () => description,
            getReceiveBy: () => receivedBy,
            getReceivedFrom: () => receivedFrom,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getChecks: () => checks
        });
    };
}

module.exports = makePulloutReceiptEntity;