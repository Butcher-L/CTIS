const getPulledoutCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getPulledoutCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getPulledoutCheckUseCase;