const makeReceiveEntity = ({}) => {
    return function makeReceive({
        receiveNumber, receiveDescription, receiveBy, releaser, controlCount, controlAmount, checks
    }){
        if(!receiveNumber){
            throw new Error('no receive number provided');
        };

        if(!receiveDescription){
            receiveDescription = "";
        };

        // if(!receiveBy){
        //     throw new Error('receiveBy not provided');
        // };

        // if(!releaser){
        //     throw new Error('releaser not provided')
        // }

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
            getReceiveNumber: () => receiveNumber,
            getReceiveDescription: () => receiveDescription,
            getReceiveBy: () => receiveBy,
            getReleaser: () => releaser,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getChecks: () => checks
        })
    };
};

module.exports = makeReceiveEntity;