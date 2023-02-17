const getTransferredCheckUseCase = ({ checksDb }) => {
    return async function get(id){
        const fetched = await checksDb.getTransferredCheckDetails(id);
        return fetched.rows;
    };
};

module.exports = getTransferredCheckUseCase;