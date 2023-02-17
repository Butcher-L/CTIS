
const docReturn = ({ transactionsDb, transactions, checks, moment }) => {
    return async function get(info, SessionId,) {
        const res = []
        const data = [];
        let DataArray = [];
        //make the date format 
        const DateObject = { dateFrom: info.dateFrom, dateTo: info.dateTo };

        if (!Object.entries(DateObject).length) {
            DateObject = null;
        } else {
            DateObject.dateFrom = moment(DateObject.dateFrom).format('YYYY-MM-DD');
            DateObject.dateTo = moment(DateObject.dateTo).format('YYYY-MM-DD');
        };
        // fetch all auto release transaction
        const FetchAllRetrunDocs = await transactions.getDocsAllReturnDocsTransaction(info.groupDesc, DateObject.dateFrom, DateObject.dateTo, SessionId);
        // loop all result and query the check  
        for (let i = 0; i < FetchAllRetrunDocs.length; i++) {
            const results = FetchAllRetrunDocs[i];
            // const FetchAutoReleaseLocation = await transactions.selectAutoReleaseLocation(results.U_RELEASING_LOC, SessionId);
            // const Location = FetchAutoReleaseLocation[0].U_LOCATION; 

            //fetch if the company is biotech using includes  
            DataArray.push({
                code: results.Code,
                returnCode: results.U_RETURN_NUM,
                description: results.U_DESC,
                returnDate: results.U_RETURN_DATE,
                controlCount: results.U_CONTROL_COUNT,
                controlAmount: results.U_CONTROL_AMT,
                actualCount: results.actualCount,
                actualAmount: results.actualAmount,
                returnByName: results.returnedByName,
                returnToName: (results.returnedByName == results.returnedToName) ? null : results.returnedToName,

                releaserGroup: results.releaserGroup,
                transmitterGroup: (results.returnedByName == results.returnedToName) ? (results.groupDesc) ? results.groupDesc : null : (results.releaserGroup == results.TransmitterGroup) ? (results.groupDesc) ? results.groupDesc : null : (results.groupDesc) ? results.groupDesc : results.TransmitterGroup,
                checkNum: results.CheckNum,
                vouchers: results.Vouchers,
                dueDate: results.DueDate,
                to_be_staled: results.to_be_staled,
                companyName: results.CompanyName,
                status: 'Return',
                releaseLocation: results.releaserGroup
            });

            //fetch if the company is revive using includes


        }

        return DataArray;
    };
};

module.exports = docReturn;