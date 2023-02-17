const locationsDb = ({ dbs }) => {
    return Object.freeze({
        getAllLocations,
        updateLocation,
        addLocation,
        getLocation
    });

    async function addLocation(location){
        const db = await dbs();
        const sql = `
                        INSERT INTO locations ("locationCode", location, "isActive", "createdBy", "createdAt")
                            VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
                    `;
        const params = [location.locationCode, location.location, location.isActive, location.user_id];
        return db.query(sql, params);
    };

    async function updateLocation(location){
        const db = await dbs();
        const sql = `
                        UPDATE locations
                            SET "locationCode" = $1, location = $2, "isActive" = $3, "updatedBy" = $5, "updatedAt" = NOW()
                            WHERE id = $4
                    `;
        const params = [location.locationCode, location.location, location.isActive, location.id, location.user_id];
        return db.query(sql, params);
    };

    async function getAllLocations(){
        const db = await dbs();
        const sql = `
                        SELECT * FROM locations
                    `
        return db.query(sql);
    };

    async function getLocation(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM locations WHERE id = $1;
                    `;
        const params = [id];
        return db.query(sql, params);
    };

};

module.exports = locationsDb;