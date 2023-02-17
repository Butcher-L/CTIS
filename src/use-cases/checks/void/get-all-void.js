const getAllVoidedUseCase = ({ checksDb }) => {
    return async function get(dateRange){

        if(Object.entries(dateRange).length){
            const fetched = await checksDb.getVoidedChecks(dateRange);
            return fetched.rows;
        };
        
        const fetched = await checksDb.getAllVoidedChecks();
        return fetched.rows;
    };
};

module.exports = getAllVoidedUseCase;