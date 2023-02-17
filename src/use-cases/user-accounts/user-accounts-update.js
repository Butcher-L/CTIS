const updateUserAccountUseCase = ({ makeUser, users, encrypt,cma }) => {
    return async function put(id, info,SessionId){
        info.id = id;
        const userEntity = makeUser.makeUserAccount(info);

        let password = null;
        if(userEntity.getPassword()){
            password = encrypt(userEntity.getPassword())
        }
        if(info.CompanyName){
            const check = await cma.checkUser(info.employeeId)
        } 
        else{
            const fetchUser = await users.getUser(info.employeeId, SessionId);
            
            const fetched = fetchUser.value[0].U_USER_ACCOUNTS;
              password  = fetched.U_PASSWORD;
        }
        
        const put = await users.updateUser({
            U_EMPLOYEE_ID: userEntity.getEmployeeId(),
            U_FIRSTNAME: userEntity.getFirstname(),
            U_LASTNAME: userEntity.getLastname(),
            U_MIDDLENAME: userEntity.getMiddlename(),
            U_ROLE: userEntity.getRole(),
            U_USERNAME: userEntity.getUsername(),
            U_USER_GROUP: userEntity.getUserGroup(),
            U_IS_ACTIVE: userEntity.getIsActive() == true || userEntity.getIsActive() == "true" ? 1 : 0,
            U_UPDATED_BY: info.user_id,
            
            U_ORG:info.CompanyName==="null" ? "CMA" :info.CompanyName ,
        },  id,SessionId);

        return {
            msg: "updated successfully"
        }
    }
}

module.exports = updateUserAccountUseCase