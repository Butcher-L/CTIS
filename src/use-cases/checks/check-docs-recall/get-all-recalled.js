const getAllRecalledUseCase = ({ checksDb }) => {
    return async function get(dateRange){

        if(Object.entries(dateRange).length){
            const fetched = await checksDb.getRecalledChecks(dateRange);
            return fetched.rows;
        };

        const fetched = await checksDb.getAllRecalledChecks();
        return fetched.rows;
    };
};

module.exports = getAllRecalledUseCase;