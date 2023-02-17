const makeReleaseEntity = ({}) => {
    return function makeRelease({
        checkId, releasedBy, releaseDescription, releasedTo, releasedToEmail, releasedToContactNumber
    }){
        if(!checkId){
            throw new Error('no check to release');
        };

        if(!releasedBy){
            throw new Error('releasedBy not provided');
        };

        if(!releaseDescription){
            releaseDescription = "";
        };

        if(!releasedTo){
            throw new Error('releasedTo not provided');
        };

        if(!releasedToEmail){
            releasedToEmail = "";
        };

        if(!releasedToContactNumber){
            releasedToContactNumber = "";
        };

        return Object.freeze({
            getCheckId: () => checkId,
            getReleasedBy: () => releasedBy,
            getReleaseDescription: () => releaseDescription,
            getReleasedTo: () => releasedTo,
            getReleasedToEmail: () => releasedToEmail,
            getReleasedToContact: () => releasedToContactNumber
        });
    };
};

module.exports = makeReleaseEntity;