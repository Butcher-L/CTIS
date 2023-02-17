
const getAutoReleases = ({ transactionsDb, transactions, checks, moment }) => {
    return async function get(info, SessionId,) {
        if (!Object.entries(info).length) {
            info = null;
        } else {
            info.startDate = moment(info.startDate).format('YYYY-MM-DD');
            info.endDate = moment(info.endDate).format('YYYY-MM-DD');
        };
        const res = []
        const data = [];
        let DataArray = [];
        //make the date format

        //fetch all auto release transaction
        const FetchAllAutoRelease = await transactions.selectAutoRelease(info, SessionId);
        //loop all result and query the check 

        for (let i = 0; i < FetchAllAutoRelease.length; i++) {
            const results = FetchAllAutoRelease[i];
            const FetchAutoReleaseLocation = await transactions.selectAutoReleaseLocation(results.U_RELEASING_LOC, SessionId);
            const Location = FetchAutoReleaseLocation[0].U_LOCATION;
            if (info.company) {
                //fetch if the company is biotech using includes

                if (info.company.includes('Biotech')) {
                    if (results.DETAILS_VIEW_COMPANY_NAME.includes('Biotech')) {

                        DataArray.push({
                            id: results.AUTOTRANSMITCODE,
                            autoReleaseCode: results.TRANSMATION_NUMBER,
                            controlCount: results.CONTROLCOUNT,
                            controlAmount: results.CONTROLAMOUNT,
                            releaseLocation: Location,
                            autoReleaseDate: results.AUTORELEASEDATE,
                            description: results.DESCRIPTION,
                            status: results.STATUS,
                            autoReleasedBy: results.TRANSMITED_BY_USER_FIRSTNAME + ' ' + results.TRANSMITED_BY_USER_LASTNAME,
                            transmitterGroupCode: results.TRANSMITATERGROUPCODE,
                            transmitterGroupName: results.USERGROUPNAME,
                            company: results.DETAILS_VIEW_COMPANY_NAME,
                            checks: results.CHECKS
                        });
                    }
                }

                //fetch if the company is revive using includes
                else if (info.company.includes('Revive')) {
                    if (results.DETAILS_VIEW_COMPANY_NAME.includes('Revive')) {
                        DataArray.push({
                            id: results.AUTOTRANSMITCODE,
                            autoReleaseCode: results.TRANSMATION_NUMBER,
                            controlCount: results.CONTROLCOUNT,
                            controlAmount: results.CONTROLAMOUNT,
                            releaseLocation: Location,
                            autoReleaseDate: results.AUTORELEASEDATE,
                            description: results.DESCRIPTION,
                            status: results.STATUS,
                            autoReleasedBy: results.TRANSMITED_BY_USER_FIRSTNAME + ' ' + results.TRANSMITED_BY_USER_LASTNAME,
                            transmitterGroupCode: results.TRANSMITATERGROUPCODE,
                            transmitterGroupName: results.USERGROUPNAME,
                            company: results.DETAILS_VIEW_COMPANY_NAME,
                            checks: results.CHECKS
                        });
                    }
                }
            }
            else {
                //fetch all if the company is null 

                DataArray.push({
                    id: results.AUTOTRANSMITCODE,
                    autoReleaseCode: results.TRANSMATION_NUMBER,
                    controlCount: results.CONTROLCOUNT,
                    controlAmount: results.CONTROLAMOUNT,
                    releaseLocation: Location,
                    autoReleaseDate: results.AUTORELEASEDATE,
                    description: results.DESCRIPTION,
                    status: results.STATUS,
                    autoReleasedBy: results.TRANSMITED_BY_USER_FIRSTNAME + ' ' + results.TRANSMITED_BY_USER_LASTNAME,
                    transmitterGroupCode: results.TRANSMITATERGROUPCODE,
                    transmitterGroupName: results.USERGROUPNAME,
                    company: results.DETAILS_VIEW_COMPANY_NAME,
                    checks: results.CHECKS
                });
            }
        }

        return DataArray;
    };
};

module.exports = getAutoReleases;