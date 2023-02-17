const moment = require('moment')
const getActivityLogsUseCase = ({ reports,cma }) => {
    return async function get(dateRange,SessionId){
        
        if(!Object.entries(dateRange).length){
            dateRange = null;
        } else{
            dateRange.startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            dateRange.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
        };

        const fetch = await reports.selectAllActivityLogs(dateRange,SessionId);    

        return fetch
    }
};

module.exports = getActivityLogsUseCase;