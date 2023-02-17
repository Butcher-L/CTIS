const actionsDb = ({ dbs }) => {
    return Object.freeze({
        addAction,
        updateAction,
        getAction,
        getAllActions,
        checkExists
    });

    async function addAction(module, description, isActive){
        const db = await dbs();
        const sql = `INSERT INTO actions (module, description, "isActive") VALUES ($1, $2, $3) RETURNING *`;
        const params = [module, description, isActive];
        return db.query(sql, params);
    };

    async function updateAction(module, desciption, isActive, id){
        const db = await dbs();
        const sql = `UPDATE actions SET module=$1, description = $2, "isActive" = $3 WHERE id = $4`;
        const params = [module, desciption, isActive, id];
        return db.query(sql, params);
    };

    async function getAction(id){
        const db =  await dbs();
        const sql = `
                        SELECT a.*, m.description as "moduleName" 
                            FROM "actions" a
                            LEFT JOIN modules m ON a.module = m.id
                            WHERE a.id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

    async function getAllActions(){
        const db = await dbs();
        const sql = `
                        SELECT a.*, m.description as "moduleName" 
                            FROM "actions" a
                            LEFT JOIN modules m ON a.module = m.id
                            ORDER BY a.id ASC
                    `;
        return db.query(sql);
    };

    async function checkExists(description){
        const db = await dbs();
        const sql = `SELECT * FROM actions WHERE LOWER(description) = LOWER($1)`;
        const params = [description];
        return db.query(sql, params);
    };

}

module.exports = actionsDb;