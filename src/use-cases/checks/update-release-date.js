const updateReleaseDate = ({ checks}) => {
    return async function put(info){

        if(!info.date){
            throw new Error("Please select date")
        }

        const update = await checks.updateReleaseDate(info)


        return {
            msg: `Update Release Date Successfully...`
        }
    };
};

module.exports = updateReleaseDate;