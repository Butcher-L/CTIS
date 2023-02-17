const moment = require("moment")
const selectByDate = ({ checks }) => {
    return async function patch(info,SessionId){

        const search = await checks.selectByDateReport(info);
        let total=0
        let array=[]
        for (const item of search) {
            if(item.U_CTIS_ChkStat==150 || item.U_CTIS_ChkStat==140){
               
                a=parseInt(item.CheckSum);
                total=total+a

            const month = (moment(item.U_RELEASE_DATE).format('MMM'));
            const release = (moment(item.U_RELEASE_DATE).format('MMM-YYYY'));
            const year = (moment(item.U_RELEASE_DATE).format('YYYY'))

            let date=[]
            if(month=='Jan'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)

            }
            if(month=='Feb'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Mar'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Apr'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='May'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Jun'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Jul'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Aug'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Sep'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Oct'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Nov'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            if(month=='Dec'){
                const data = {
                    month:month,
                    year:year,
                    date:release,
                    amount:item.CheckSum
                }
                date.push(data)
            }
            item.date=(date);


            array.push(item)


            }
            
        }
        return {
            total,
            array
        }
    }
}

module.exports = selectByDate;