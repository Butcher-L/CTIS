const userGroupsDb = ({ dbs }) => {
    return Object.freeze({
        getTransmitterGroups,
        getCMTGroups,
        getUserGroup,
        addUserGroup,
        updateUserGroup,
        getAllUserGroups,
        getUserGroup,
        getAllAcctgGroups,
        getByAcctgGroup
    });    

    //get all transmitter groups
    async function getTransmitterGroups(){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "userGroups" WHERE "acctgGroup" = 2
                    `;
        return db.query(sql);
    };

     //get all CMT groups
     async function getCMTGroups(){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "userGroups" WHERE "acctgGroup" = 4
                    `;
        return db.query(sql);
    };

    // //get users by user groups
    // async function getUserGroup(id){
    //     const db = await dbs();
    //     const sql = `
    //                     SELECT * FROM "userGroups" WHERE "id" = $1
    //                 `;
    //     const params = [id];
    //     return db.query(sql, params);
    // };

    async function addUserGroup(info){
        const db = await dbs();
        const sql = `
                        INSERT INTO "userGroups" ("groupCode", "groupDesc", "locationId", "acctgGroup", "isActive", "createdBy", "createdAt")
                            VALUES ($1, $2, $3, $4, 't', $5, NOW()) RETURNING *;
                    `;
        const params = [info.groupCode, info.groupDesc, info.locationId, info.acctgGroup, info.user_id];
        return db.query(sql, params);
    };

    async function updateUserGroup(info){
        const db = await dbs();
        const sql = `
                        UPDATE "userGroups" 
                            SET "groupCode" = $1, "groupDesc" = $2, "locationId" = $3, "acctgGroup" = $4, "isActive" = $5, "updatedBy" = $7, "updatedAt" = NOW()
                            WHERE id = $6;
                    `;
        const params = [info.groupCode, info.groupDesc, info.locationId, info.acctgGroup, info.isActive, info.id, info.user_id];
        return db.query(sql, params);
    };

    async function getAllUserGroups(){
        const db = await dbs();
        const sql = `
                        SELECT ug.*, l."locationCode", l.location, ag."acctgGroup" as "acctgGroupName"
                            FROM "userGroups" ug 
                            LEFT JOIN locations l ON ug."locationId" = l.id
                            LEFT JOIN "acctgGroups" ag ON ug."acctgGroup" = ag.id
                    `;
        return db.query(sql);
    };

    async function getUserGroup(id){
        const db = await dbs();
        const sql = `
                        SELECT ug.*, l."locationCode", l.location, ag."acctgGroup" as "acctgGroupName"
                            FROM "userGroups" ug 
                            LEFT JOIN locations l ON ug."locationId" = l.id
                            LEFT JOIN "acctgGroups" ag ON ug."acctgGroup" = ag.id
                            WHERE ug.id = $1
                    `;
        const params = [id]
        return db.query(sql, params);
    };

    async function getAllAcctgGroups(){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "acctgGroups"
                    `;
        return db.query(sql);
    };

    async function getByAcctgGroup(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "userGroups" WHERE "acctgGroup" = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };
    
};

module.exports = userGroupsDb;