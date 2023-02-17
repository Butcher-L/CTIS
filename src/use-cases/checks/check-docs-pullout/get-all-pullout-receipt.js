const getAllPulledoutCheckReceiptsUseCase = ({ checksDb }) => {
    return async function get(){
        const fetched = await checksDb.getAllPulledoutCheckReceipts();
        return fetched.rows;
    };
};

module.exports = getAllPulledoutCheckReceiptsUseCase;