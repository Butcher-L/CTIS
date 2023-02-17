const getReturnedReceiptsCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getReturnCheckReceiptDetails(id);
        return fetched.rows;
    };
};

module.exports = getReturnedReceiptsCheckUseCase;