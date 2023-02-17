const actionDb = ({ dbs }) => {
    return Object.freeze({
        addAccessRight,
        getRoleAdminAccessRights,
        getRoleReportsAccessRights,
        getRoleTransactionAccessRights,
        listAccessRightsByRole,
        editAccessRight,
        checkExists
    });

    async function addAccessRight(accessRight){
        const db = await dbs();
        const sql = `INSERT INTO "accessRights" (action, role, "isActive") VALUES ($1, $2, $3) RETURNING *`;
        const params = [accessRight.action, accessRight.role, accessRight.isActive];
        return db.query(sql, params);
    };

    async function editAccessRight(accessRight){
        const db = await dbs();
        const sql = `UPDATE "accessRights" SET action = $1, role = $2, "isActive" = $3 WHERE id = $4`;
        const params = [accessRight.action, accessRight.role, accessRight.isActive, accessRight.id];
        return db.query(sql, params);
    };

    async function listAccessRightsByRole(id){
        const db  = await dbs();
        const sql = `
                        SELECT * FROM "accessRights" WHERE "isActive" = 't' AND role = $1
                    `
        const params = [id];
        return db.query(sql, params);
    }

    async function getRoleTransactionAccessRights(id){
        const db  = await dbs();
        const sql = `
                        SELECT r.name as role, a.id AS "accessRightId", a.description
                            FROM roles r
                            JOIN "accessRights" ar ON r.id = ar.role
                            JOIN actions a ON ar.action = a.id 
                            WHERE r.id = $1 AND r."isActive" = true AND ar."isActive" = true AND a.module = 1
                    `
        const params = [id];
        return db.query(sql, params);
    };

    async function getRoleAdminAccessRights(id){
        const db  = await dbs();
        const sql = `
                        SELECT r.name, a.id AS "accessRightId", a.description
                            FROM roles r
                            JOIN "accessRights" ar ON r.id = ar.role
                            JOIN actions a ON ar.action = a.id 
                            WHERE r.id = $1 AND r."isActive" = true AND ar."isActive" = true AND a.module = 2
                    `
        const params = [id];
        return db.query(sql, params);
    };

    async function getRoleReportsAccessRights(id){
        const db  = await dbs();
        const sql = `
                        SELECT r.name, a.id AS "accessRightId", a.description
                            FROM roles r
                            JOIN "accessRights" ar ON r.id = ar.role
                            JOIN actions a ON ar.action = a.id 
                            WHERE r.id = $1 AND r."isActive" = true AND ar."isActive" = true AND a.module = 3
                    `
        const params = [id];
        return db.query(sql, params);
    };

    async function checkExists(role, action){
        const db = await dbs();
        const sql = `SELECT * FROM "accessRights" WHERE role = $1 AND action = $2`;
        const params = [role, action];
        return db.query(sql, params);
    };


}

module.exports = actionDb