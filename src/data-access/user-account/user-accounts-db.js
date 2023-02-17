const userAccountsDb = ({ dbs }) => {
    return Object.freeze({
        createAccount,
        getUserAccount,
        getUserByUserGroup,
        getUserAccounts,
        updateUserAccount,
        getUser
    });

    async function createAccount(user){
        const db = await dbs();
        const sql = `
                    INSERT INTO "userAccounts" 
                        ("employeeId", firstname, lastname, middlename, role, username, password, "userGroup", "isActive", "createdAt", "updatedAt", "createdBy") 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10) RETURNING id;
                    `;
        const params = [user.employeeId, user.firstname, user.lastname, user.middlename, user.role, user.username, user.password, user.userGroup, user.isActive, user.user_id];
        return db.query(sql, params); 
    };

    //get user account by employee id
    async function getUserAccount(employeeId){
        const db = await dbs();
        const sql = `
                        SELECT ua.id, ua."employeeId", ua.firstname, ua.lastname, ua.middlename, ua.role, ua."userGroup", ua.password, 
                            r.name 
                            FROM "userAccounts" ua
                            LEFT JOIN roles r ON ua.role = r.id
                            LEFT JOIN "userGroups" ug ON ua."userGroup" = ug.id
                            WHERE ua."employeeId" = $1 AND ua."isActive" = true
                    `;
        const params = [employeeId];
        return db.query(sql, params); 
    };

    async function getUserByUserGroup(id){
        const db = await dbs();
        const sql = `
                        SELECT id, firstname, lastname, middlename
                            FROM "userAccounts"
                            WHERE "userGroup" = $1                    
                    `;
        const params = [id];
        return db.query(sql, params);
    };

    async function getUserAccounts(){
        const db = await dbs();
        const sql = `
                        SELECT id, "employeeId", firstname, middlename, username,
                            lastname, role, "userGroup", "roleName", "userGroupName",
                            "isActive", "groupCode" 
                            FROM "userProfileView"             
                    `;
        return db.query(sql);
    };


    async function updateUserAccount(user){
        const db = await dbs();
        const sql= `
                        UPDATE "userAccounts" SET
                            firstname =  $1,
                            lastname = $2,
                            middlename = $3,
                            role = $4,
                            "employeeId" = $5,
                            username = $6,
                            password = $7,
                            "userGroup" = $8,
                            "isActive" = $9,
                            "updatedAt" = NOW(),
                            "updatedBy" = $11
                            WHERE id = $10
                   `
        const params = [
            user.firstname,
            user.lastname,
            user.middlename,
            user.role,
            user.employeeId,
            user.username,
            user.password,
            user.userGroup,
            user.isActive,
            user.id,
            user.user_id
        ];

        return db.query(sql, params)
    };

    async function getUser(id){
        const db = await dbs();
        const sql = `
                        SELECT id, "employeeId", firstname, middlename, 
                            lastname, role, "userGroup", "roleName", "userGroupName",
                            "isActive", "groupCode" , username
                            FROM "userProfileView" WHERE id = $1            
                    `;
        const params = [id]
        return db.query(sql, params);
    }

}

module.exports = userAccountsDb;