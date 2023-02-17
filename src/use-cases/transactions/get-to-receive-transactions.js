const moment = require("moment")
const getToReceiveTransactionsUseCase = ({ transactions }) => {
    return async function get(transaction, datefilter, SessionId) {
        if (!Object.entries(datefilter).length) {
            datefilter = null;
        } else {
            datefilter.startDate = moment(datefilter.startDate).format('YYYY-MM-DD');
            datefilter.endDate = moment(datefilter.endDate).format('YYYY-MM-DD');
        };
        // console.log("weeeeeee", { transaction: transaction, datefilter: datefilter, SessionId: SessionId });
        let fetched;
        let data = [];
        const groupCode = datefilter.groupCode;
        switch (transaction) {
            case 'transferredTransactions':
                fetched = await transactions.selectAllToReceiveTransfer(datefilter, SessionId);
                // console.log("heee", { fetched: fetched })
                for await (transactionss of fetched) {
                    const dataValue = {}
                    if (groupCode && groupCode != 'ADMIN') {
                        if (transactionss.TRANSMITTERGROUPCODE == groupCode) {
                            dataValue.id = transactionss.TRANSMITTERCODE;
                            dataValue.description = transactionss.U_DESC;
                            dataValue.transferNumber = transactionss.U_TRANSFER_NUM;
                            dataValue.receivedBy = transactionss.U_RCVD_BY;
                            dataValue.transmitter = transactionss.U_TRANSMITTER;
                            dataValue.transferDate = transactionss.U_TRANSFER_DATE;
                            dataValue.transferredBy = transactionss.U_TRANSFERRED_BY;
                            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
                            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
                            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
                            dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
                            dataValue.actualAmount = transactionss.actualAmount;
                            dataValue.actualCount = transactionss.actualCount;
                            dataValue.transmitterName = transactionss.transmitterName;
                            dataValue.transferredByName = transactionss.transferredByName;
                            dataValue.receivedByName = transactionss.receivedByName;
                            dataValue.userGroupName = transactionss.GROUPDESCRIPTION
                            dataValue.writerGroup = transactionss.writerGroup;
                            dataValue.CheckNum = transactionss.CheckNum;
                            dataValue.CompanyName = transactionss.CompanyName;
                            data.push(dataValue)
                        }
                    } else {
                        dataValue.id = transactionss.TRANSMITTERCODE;
                        dataValue.description = transactionss.U_DESC;
                        dataValue.transferNumber = transactionss.U_TRANSFER_NUM;
                        dataValue.receivedBy = transactionss.U_RCVD_BY;
                        dataValue.transmitter = transactionss.U_TRANSMITTER;
                        dataValue.transferDate = transactionss.U_TRANSFER_DATE;
                        dataValue.transferredBy = transactionss.U_TRANSFERRED_BY;
                        dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
                        dataValue.controlCount = transactionss.U_CONTROL_COUNT;
                        dataValue.controlAmount = transactionss.U_CONTROL_AMT;
                        dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
                        dataValue.actualAmount = transactionss.actualAmount;
                        dataValue.actualCount = transactionss.actualCount;
                        dataValue.transmitterName = transactionss.transmitterName;
                        dataValue.transferredByName = transactionss.transferredByName;
                        dataValue.receivedByName = transactionss.receivedByName;
                        dataValue.userGroupName = transactionss.GROUPDESCRIPTION
                        dataValue.writerGroup = transactionss.writerGroup;
                        dataValue.CheckNum = transactionss.CheckNum;
                        dataValue.CompanyName = transactionss.CompanyName;
                        data.push(dataValue)
                    }
                }

                break;
            case 'transmittalTransactions':
                fetched = await transactions.selectAllToReceiveTransmit(datefilter, SessionId);
                for await (transactionss of fetched) {
                    const dataValue = {}
                    dataValue.id = transactionss.Code;
                    dataValue.transmittalNumber = transactionss.U_TRANSMIT_NUM;
                    dataValue.specificReleaser = transactionss.U_SPCFC_RELEASER;
                    dataValue.autoReceiveBy = transactionss.U_AUTO_RCVD_BY;
                    dataValue.autoReleaseBy = transactionss.U_AUTO_RLSD_BY;
                    dataValue.transmittalDate = transactionss.U_TRANSMIT_DATE;
                    dataValue.transmittedBy = transactionss.U_TRANSMIT_BY;
                    dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
                    dataValue.controlCount = transactionss.U_CONTROL_COUNT;
                    dataValue.controlAmount = transactionss.U_CONTROL_AMT;
                    dataValue.releasingLocation = transactionss.U_RELEASING_LOC;
                    dataValue.description = transactionss.U_DESC;
                    dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
                    dataValue.actualCount = transactionss.actualCount;
                    dataValue.actualAmount = transactionss.actualAmount;
                    dataValue.specificReleaserName = transactionss.specificReleaserName;
                    dataValue.autoReceiveByName = transactionss.autoReceiveByName;
                    dataValue.autoReleaseByName = transactionss.autoReleaseByName;
                    dataValue.transmittedByName = transactionss.transmittedByName;
                    dataValue.receivedBy = transactionss.U_RCVD_BY;
                    dataValue.receivedByName = transactionss.receivedByName;
                    dataValue.releasingLocationName = transactionss.releasingLocationName;
                    dataValue.transmittingGroup = transactionss.transmittingGroup;
                    dataValue.CheckNum = transactionss.CheckNum;
                    dataValue.CompanyName = transactionss.CompanyName;

                    data.push(dataValue);
                }

                break;
            case "docsReturnTransactions":
                fetched = await transactions.selectAllToReturnTransmit(datefilter, SessionId)
                // CompareData = await transactions.selectReturnUsers(datefilter,SessionId)
                for await (transactionss of fetched) {
                    const dataValue = {}
                    if (groupCode && groupCode != 'ADMIN') {
                        if (transactionss.U_RETURNED_TO && datefilter.user == transactionss.U_RETURNED_TO) {
                            dataValue.id = transactionss.Code;
                            dataValue.returnNumber = transactionss.U_RETURN_NUM;
                            dataValue.returnedBy = transactionss.U_RETURNED_BY;
                            dataValue.returnTo = transactionss.U_RETURNED_TO;
                            dataValue.description = transactionss.U_DESC;
                            dataValue.returnDate = transactionss.U_RETURN_DATE;
                            dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
                            dataValue.controlCount = transactionss.U_CONTROL_COUNT;
                            dataValue.controlAmount = transactionss.U_CONTROL_AMT;
                            dataValue.actualCount = transactionss.actualCount;
                            dataValue.actualAmount = transactionss.actualAmount;
                            dataValue.returnedByName = transactionss.returnedByName;
                            dataValue.returnToName = transactionss.returnToName;
                            dataValue.receivedBy = transactionss.U_RCVD_BY;
                            dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
                            dataValue.releaserGroup = transactionss.releaserGroup;
                            dataValue.CheckNum = transactionss.CheckNum
                            dataValue.CompanyName = transactionss.CompanyName;
                            data.push(dataValue);
                        }
                        else {
                            if (transactionss.GroupCode && groupCode == transactionss.GroupCode) {
                                dataValue.id = transactionss.Code;
                                dataValue.returnNumber = transactionss.U_RETURN_NUM;
                                dataValue.returnedBy = transactionss.U_RETURNED_BY;
                                dataValue.returnTo = transactionss.U_RETURNED_TO;
                                dataValue.description = transactionss.U_DESC;
                                dataValue.returnDate = transactionss.U_RETURN_DATE;
                                dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
                                dataValue.controlCount = transactionss.U_CONTROL_COUNT;
                                dataValue.controlAmount = transactionss.U_CONTROL_AMT;
                                dataValue.actualCount = transactionss.actualCount;
                                dataValue.actualAmount = transactionss.actualAmount;
                                dataValue.returnedByName = transactionss.returnedByName;
                                dataValue.returnToName = transactionss.returnToName;
                                dataValue.receivedBy = transactionss.U_RCVD_BY;
                                dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
                                dataValue.releaserGroup = transactionss.releaserGroup;
                                dataValue.CheckNum = transactionss.CheckNum
                                dataValue.CompanyName = transactionss.CompanyName;
                                data.push(dataValue);
                            }
                        }
                    } else {
                        dataValue.id = transactionss.Code;
                        dataValue.returnNumber = transactionss.U_RETURN_NUM;
                        dataValue.returnedBy = transactionss.U_RETURNED_BY;
                        dataValue.returnTo = transactionss.U_RETURNED_TO;
                        dataValue.description = transactionss.U_DESC;
                        dataValue.returnDate = transactionss.U_RETURN_DATE;
                        dataValue.isPosted = transactionss.U_IS_POSTED == 1 ? true : false;
                        dataValue.controlCount = transactionss.U_CONTROL_COUNT;
                        dataValue.controlAmount = transactionss.U_CONTROL_AMT;
                        dataValue.actualCount = transactionss.actualCount;
                        dataValue.actualAmount = transactionss.actualAmount;
                        dataValue.returnedByName = transactionss.returnedByName;
                        dataValue.returnToName = transactionss.returnToName;
                        dataValue.receivedBy = transactionss.U_RCVD_BY;
                        dataValue.denied = transactionss.U_DENIED == 1 ? true : false;
                        dataValue.releaserGroup = transactionss.releaserGroup;
                        dataValue.CheckNum = transactionss.CheckNum
                        dataValue.CompanyName = transactionss.CompanyName;
                        data.push(dataValue);
                    }

                }

                break;
        };
        return {
            transactions: data
        }
    };
}

module.exports = getToReceiveTransactionsUseCase;