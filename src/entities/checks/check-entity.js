const makeCheckEntity = ({moment}) => {
    return function makeCheck({
        checkNumber,
        createdBy,
        creationDate,
        payee,
        paymentDate,
        maturityDate,
        checkAmount,
        bank,
        voucher,
        description
    }){

        if(!checkNumber){
            throw new Error('indicate check number');
        };

        if(!createdBy){
            throw new Error('indicate check creator');
        };

        if(!creationDate){
            throw new Error('indicate check creation date');
        };

        if(!payee){
            throw new Error('indicate payee');
        }

        if(!paymentDate){
            throw new Error('indicate check payment date');
        };

        if(!moment(paymentDate, "MM/DD/YYYY", true).isValid()){
            throw new Error('indicate valid payment date');
        }

        if(maturityDate){
            // throw new Error('indicate maturity date');
            if(!moment(maturityDate, "MM/DD/YYYY", true).isValid()){
                throw new Error('indicate valid maturity date');
            }
        } else{
            maturityDate = moment(creationDate).add(6, 'M');
        }

        if(!checkAmount){
            throw new Error('indicate check amount');
        }

        // if(!isNaN(checkAmount)){
        //     throw new Error('check amount should be a number');
        // }

        if(checkAmount <= 0){
            throw new Error('indicate a valid check amount');
        }

        // if(!bank){
        //     throw new Error('indicate bank');
        // }

        // if(!voucher){
        //     throw new error('indicate accompanying check voucher');
        // }


        return Object.freeze({
            getCheckNumber: () => checkNumber,
            getCreatedBy: () => createdBy,
            getCreationDate: () => moment(creationDate).format('YYYY-MM-DD'),
            getPayee: () => payee,
            getPaymentDate: () => moment(paymentDate).format('YYYY-MM-DD'),
            getMaturityDate: () => moment(maturityDate).format('YYYY-MM-DD'),
            getCheckAmount: () => checkAmount,
            getBank: () => bank,
            getVoucher: () => voucher,
            getDescription: () => description
        });
    };
};

module.exports = makeCheckEntity;