const resetPassword = ({ makeUser, users, encrypt }) => {
    return async function put(id, info,SessionId){
        info.id = id;


        let password = null;
        if(info.employeeId){
            password = encrypt(info.employeeId)
        } else{
            const fetchUser = await users.getUser(info.employeeId, SessionId);
   
            const fetched = fetchUser.value[0].U_USER_ACCOUNTS.U_USERNAME;
            password  = encrypt(fetched);
        }
        const put = await users.resetPassword({
            U_PASSWORD: password,
            U_IS_ACTIVE: 1,
            U_UPDATED_BY: info.user_id
        },  id,SessionId);

        return {
            msg: "Password reset successfully"
        }
    }
}

module.exports = resetPassword