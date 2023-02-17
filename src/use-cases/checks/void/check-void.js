const voidCheckUseCase = ({ checksDb }) => {
    return async function patch(info){
        const patch = await checksDb.voidCheck({
            id: info.id
        });
        if(!patch.rowCount){
            throw new Error('Something went wrong');
        };

        return {
            patch: `Check ${info.checkNumber} voided`
        }
    };
};

module.exports = voidCheckUseCase;