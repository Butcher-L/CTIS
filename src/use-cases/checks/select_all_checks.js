const moment= require('moment')

const selectAllChecks = ({ checks }) => {
    return async function find(info){
        let date

        if(info){
            date={
                startDate:moment(info.dateRange.startDate).format('YYYY-MM-DD'),
                endDate:moment(info.dateRange.endDate).format('YYYY-MM-DD')
            }
        }
        
        const find = await checks.findChecks(date)

        return find
       
    };
};

module.exports = selectAllChecks;