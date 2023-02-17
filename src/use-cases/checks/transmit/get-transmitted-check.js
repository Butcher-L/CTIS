const getTransmittedCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getTransmittedCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getTransmittedCheckUseCase;