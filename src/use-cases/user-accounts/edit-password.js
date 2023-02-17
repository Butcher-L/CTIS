const editPassword = ({  users, encrypt }) => {
    return async function put(id, info,SessionId){
            const fetched = info.U_PASSWORD
            password  = encrypt(fetched);
        
        
        const put = await users.editPassword({
            U_PASSWORD: password,
            U_UPDATED_BY: info.user_id
        },  id,info.SessionId);
        

        return {
            msg: "Edit Password successfully"
        }
    }
}

module.exports = editPassword