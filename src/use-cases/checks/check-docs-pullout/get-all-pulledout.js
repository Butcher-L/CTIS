const getAllPulledoutUseCase = ({ checksDb }) => {
    return async function get(){
        const fetched = await checksDb.getAllPulledoutChecks();
        return fetched.rows;
    };
};

module.exports = getAllPulledoutUseCase;