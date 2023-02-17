const addCheckUseCase = ({ checksDb, makeCheck }) => {
    return async function add(info){
        const checkEntity = makeCheck(info);
    
        const posted = await checksDb.addCheck({
            checkNumber: checkEntity.getCheckNumber(),
            createdBy: checkEntity.getCreatedBy(),
            creationDate: checkEntity.getCreationDate(),
            payee: checkEntity.getPayee(),
            paymentDate: checkEntity.getPaymentDate(),
            maturityDate: checkEntity.getMaturityDate(),
            checkAmount: checkEntity.getCheckAmount(),
            bank: checkEntity.getBank(),
            voucher: checkEntity.getVoucher(),
            description: checkEntity.getDescription()
        });
        
        return {
            msg: `Check ${checkEntity.getCheckNumber()} added`
        }
    };
};

module.exports = addCheckUseCase;