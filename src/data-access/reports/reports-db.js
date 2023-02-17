const reportsDb = ({ dbs }) => {
    return Object.freeze({
        getTransferredChecksReport,
        getTransmittedChecksReport,
        getVoidedChecksReport,
        getCheckTransactions
    });

    async function getTransferredChecksReport(dateFilter){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transferredChecksReport"
                            WHERE "creationDate" BETWEEN $1 AND $2
                    `;
        const params = [dateFilter.startDate, dateFilter.endDate];
        return db.query(sql, params);
    };

    async function getTransmittedChecksReport(dateFilter){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transmittedChecksReport"
                            WHERE "creationDate" BETWEEN $1 AND $2
                    `;
        const params = [dateFilter.startDate, dateFilter.endDate];
        return db.query(sql, params);
    };
    
    async function getVoidedChecksReport(dateFilter){
        
        const db = await dbs();
        const sql = `
                        SELECT * FROM "voidedChecks"
                            WHERE "creationDate" BETWEEN $1 AND $2
                    `;
        const params = [dateFilter.startDate, dateFilter.endDate];
        return db.query(sql, params);
    };

    //get check transactions
    async function getCheckTransactions(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "checkTransactions" WHERE "check" = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };
}

module.exports = reportsDb;