const modulesDb = ({ dbs }) => {
    return Object.freeze({
        addModule,
        updateModule,
        getAllModules,
        getModule
    });

    async function addModule(description, isActive, user_id){
        const db = await dbs();
        const sql = `INSERT INTO modules (description, "isActive", "createdBy", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *`;
        const params = [description, isActive, user_id];
        return db.query(sql, params);
    };

    async function updateModule(desciption, isActive, id, user_id){
        const db = await dbs();
        const sql = `UPDATE modules SET description = $1, "isActive" = $2, "updatedAt" = NOW(), "updatedBy" = $4 WHERE id = $3 RETURNING *`;
        const params = [desciption, isActive, id, user_id];
        return db.query(sql, params);
    };

    async function getModule(id){
        const db =  await dbs();
        const sql = `SELECT * FROM modules WHERE id = $1`;
        const params = [id];
        return db.query(sql, params);
    };

    async function getAllModules(){
        const db = await dbs();
        const sql = `SELECT * FROM modules`;
        return db.query(sql);
    }

}

module.exports = modulesDb;