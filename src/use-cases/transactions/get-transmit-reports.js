
const getAllTransmitreportUseCases = ({ transactions, moment }) => {
    return async function fetch(info, SessionID) {
        const res = [];
        const data = [];
        let DataArray = [];
        const DateObject = { dateFrom: info.startDate, dateTo: info.endDate };

        if (!Object.entries(DateObject).length) {
            DateObject = null;
        } else {
            DateObject.dateFrom = moment(DateObject.dateFrom).format('YYYY-MM-DD');
            DateObject.dateTo = moment(DateObject.dateTo).format('YYYY-MM-DD');
        };
        const FetchAllTransmitalReports = await transactions.selectTransmitReport(info.GroupID, DateObject, SessionID);
        for (let i = 0; i < FetchAllTransmitalReports.length; i++) {
            const results = FetchAllTransmitalReports[i];

            DataArray.push({
                id: results.TRANSMITCODE,
                name: results.TRANSMITNAME,
                transmitNum: results.TRANSMITNUM,
                specificReleaser: results.SPECIFICRELEASER,
                transmitDate: results.TRANSMITDATE,
                description: results.DESCRIPTION,
                isDenied: results.ISDENIED == 1 ? true : false,
                isPosted: results.ISPOSTED == 1 ? true : false,
                controlCount: results.CONTROLCOUNT,
                controlAmount: results.CONTROLAMOUNT,
                actualAmount: results.ACTUALAMOUNT,
                actualCount: results.ACTUALCOUNT,
                transmitChecknum: results.TRANSMITCHECKNUM,
                createdBy: results.CREATEDBY,
                releasingLocation: results.RELEASINGLOCATION,
                transmitedBy: results.TRANSMITEDBY,
                transmittedByName: results.TRANSMITTEDBYNAME,
                transmittedTo: results.TRANSMITTERGROUPDESC,
                releaseLocation: results.RELEASELOCATION,
                checkNum: results.CHECKNUM,
                vouchers: results.VOUCHERS,
                companyName: results.DETAILS_VIEW_COMPANY_NAME,
                status: results.STATUS,
            })

        }
        return DataArray
    }

}

module.exports = getAllTransmitreportUseCases