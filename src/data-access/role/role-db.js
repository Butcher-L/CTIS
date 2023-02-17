const rolesDb = ({ dbs }) => {
    return Object.freeze({
        addRole,
        updateRole,
        getAllRoles,
        getRole,
        getRoleByName
    });

    async function addRole(name, isActive, user_id){
        const db = await dbs();
        const sql = `INSERT INTO roles (name, "isActive", "createdBy", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *`;
        const params = [name, isActive, user_id];
        return db.query(sql, params);
    };

    async function updateRole(name, isActive, id, user_id){
        const db = await dbs();
        const sql = `UPDATE roles SET "name" = $1, "isActive" = $2, "updatedBy" = $4, "updatedAt" = NOW() WHERE id = $3 RETURNING *`;
        const params = [name, isActive, id, user_id];
        return db.query(sql, params);
    };

    async function getRole(id){
        const db = await dbs();
        const sql = `SELECT * FROM roles WHERE id = $1`;
        const params = [id];
        return db.query(sql, params);
    };

    async function getRoleByName(name){
        const db = await dbs();
        const sql = `SELECT * FROM roles WHERE name = $1`;
        const params = [name];
        return db.query(sql, params);
    };

    async function getAllRoles(){
        const db = await dbs();
        const sql = `SELECT * FROM roles`;
        return db.query(sql);
    };

};

module.exports = rolesDb;