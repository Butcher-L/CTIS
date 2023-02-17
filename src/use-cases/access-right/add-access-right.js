const addAccessRightUseCase = ({ accessRightsDb, makeAccessRight  }) => {
    return async function add(info){
        const accessRightEntity = makeAccessRight(info);

        const exists = await accessRightsDb.checkExists(
            accessRightEntity.getRole(),
            accessRightEntity.getAction()
        );

        if(exists.rows.length){
            throw new Error('Access right already exists');
        }

        const posted = await accessRightsDb.addAccessRight(
            accessRightEntity.getAction(),
            accessRightEntity.getRole(),
            accessRightEntity.getIsActive()
        );

        return {
            msg: `Access right added successfully`
        };
    };
};

module.exports = addAccessRightUseCase;