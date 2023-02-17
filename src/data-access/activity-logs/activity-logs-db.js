const activityLogsDb = ({ dbs }) => {
    return Object.freeze({
        getActivityLogs
    });

    async function getActivityLogs(dateFilter){
        const db = await dbs();
        const sql = `
                SELECT al.id,
		        	ua.firstname,
                    ua.lastname,
                    ua.username,
		        	al.operation,
		        	al."tableAffected",
		        	al."oldValue",
		        	al."newValue",
		        	al."activityTimestamp"
		        	FROM "activityLogs" al
		        	LEFT JOIN "userAccounts" ua ON al.user = ua.id
                    WHERE date_trunc('day', al."activityTimestamp") BETWEEN $1 AND $2
                    ORDER BY al."activityTimestamp" DESC
        `;
        const params = [dateFilter.startDate, dateFilter.endDate];
        return db.query(sql, params);    
    };
};

module.exports = activityLogsDb;
