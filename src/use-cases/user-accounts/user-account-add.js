const addUserUseCase = ({ makeUser, usersDb, encrypt, users }) => {
    return async function add(info,SessionId){
        const userEntity = makeUser.makeUserAccount(info);

        // const fetchUser = await usersDb.getUserAccount(userEntity.getEmployeeId());

        const _slFetchUser = await users.getUser(info.employeeId,SessionId);

        if(_slFetchUser.value.length){
            throw new Error('account already exists')
        };

        const maxCode = await users.getMaxCode();
        const max = maxCode.data.castmax + 1;

        const posted = await users.addUser({
            Code: max,
            Name: max,
            U_EMPLOYEE_ID: userEntity.getEmployeeId(),
            U_FIRSTNAME: userEntity.getFirstname(),
            U_LASTNAME: userEntity.getLastname(),
            U_MIDDLENAME: userEntity.getMiddlename(),
            U_ROLE: userEntity.getRole(),
            U_USERNAME: userEntity.getUsername(),
            U_PASSWORD: encrypt(userEntity.getPassword()),
            U_USER_GROUP: userEntity.getUserGroup(),
            U_IS_ACTIVE: userEntity.getIsActive() == true || userEntity.getIsActive() == "true" ? 1 : 0,
            U_CREATED_BY: info.user_id
        }, SessionId);


        return {
            msg: `user ${userEntity.getEmployeeId()} added successfully`,
        };
    };
};

module.exports = addUserUseCase;