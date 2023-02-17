const getAllReturnedReceiptsUseCase = ({ checksDb, checks}) => {
    return async function get(){
        const fetched = await checks.getAllReturnCheckReceipts()
        // const fetched = await checksDb.getAllReturnCheckReceipts();
        // return fetched.rows;
    };
};

module.exports = getAllReturnedReceiptsUseCase;