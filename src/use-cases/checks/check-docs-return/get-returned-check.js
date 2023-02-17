const getReturnedCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getReturnedCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getReturnedCheckUseCase
;