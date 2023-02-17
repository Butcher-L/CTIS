const makePullOutEntity = ({}) => {
    return function makePullOut({
        pullOutNumber, pullOutTo, pullOutBy, description, controlCount, controlAmount, checks
    }){
        if(!pullOutNumber){
            throw new Error('pull-out number not provided');
        };

        // if(!pullOutTo){
        //     throw new Error('pullOutTo not provided');
        // }

        if(!pullOutBy){
            throw new Error('pullOutBy not provided');
        };

        if(!description){
            description = "";
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
            getPulloutNumber: () => pullOutNumber,
            getPulloutTo: () => pullOutTo,
            getPulloutBy: () => pullOutBy,
            getDescription: () => description,
            getControlCount: () => controlCount,
            getControlAmount: () => controlAmount,
            getChecks: () => checks
        })

    };
};

module.exports = makePullOutEntity;