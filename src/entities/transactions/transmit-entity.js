const makeTransmitEntity = ({}) => {
    return function makeTransmit({
        transmittalNumber, specificReleaser, autoReceiveBy, autoReleaseBy, transmittedBy, controlCount, controlAmount, releasingLocation, description, checks
    }){
        if(!transmittalNumber){
            throw new Error('no transmittal number provided');
        };

        if(!transmittedBy){
            throw new Error('transmittedBy not provided');
        };

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
            getTransmittalNumber: () => transmittalNumber,
            getSpecificReleaser: () => specificReleaser,
            getAutoReceivedBy: () => autoReceiveBy,
            getAutoReleasedBy: () => autoReleaseBy,
            getTransmittedBy: () => transmittedBy,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getDescription: () => description,
            getReleasingLocation: () => releasingLocation,
            getChecks: () => checks
        })

    }
};

module.exports = makeTransmitEntity;