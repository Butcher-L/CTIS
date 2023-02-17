const getCheckDocsreturnUseCases = ({ transactionsDb, transactions, checks, moment }) => {
    return async function fetch(toView, SessionId) {
        if (!toView.id || !toView.company) { throw new Error(`Must have id and company name.`) };

        const DocsReturnsChecs = await checks.getReturnChecks(toView.id, toView.company, SessionId);

        const DocsReturnTransact = await transactions.getDocsReturnTransaction(toView.id, toView.company, SessionId);


        let transaction = [];
        let cheque = [];
        for await (returnChecks of DocsReturnsChecs) {
            const dataValue = {}
            dataValue.id = { DocEntry: returnChecks.DocEntry, LineNum: returnChecks.LineID };
            dataValue.checkNumber = returnChecks.CheckNum;
            dataValue.createdBy = returnChecks.createdBy;
            dataValue.creationDate = returnChecks.CreateDate;
            dataValue.paymentDate = returnChecks.DocDate;
            dataValue.maturityDate = returnChecks.DueDate;
            dataValue.checkAmount = returnChecks.CheckSum;
            dataValue.bank = returnChecks.BankCode;
            dataValue.accountNumber = returnChecks.AcctNum;
            dataValue.voucherNo = returnChecks.Vouchers;
            dataValue.voucherDate = returnChecks.VoucherDate;
            dataValue.cardName = returnChecks.CardName;
            dataValue.U_APP_PayeeName = returnChecks.U_APP_PayeeName;
            dataValue.description = returnChecks.Comments;
            dataValue.companyName = returnChecks.CompanyName;
            cheque.push(dataValue);
        }

        for await (returnTransaction of DocsReturnTransact) {
            const dataValue = {}
            // dataValue.autoReleasedCode = returnTransaction.U_TRANSMIT_NUM;
            dataValue.id = returnTransaction.Code;
            dataValue.returnNumber = returnTransaction.U_RETURN_NUM;
            dataValue.returnedBy = returnTransaction.U_RETURNED_BY;
            dataValue.returnedTo = (returnTransaction.U_RETURNED_BY == returnTransaction.U_RETURNED_TO) ? null : returnTransaction.U_RETURNED_TO;
            dataValue.returnDate = returnTransaction.U_RETURN_DATE;
            dataValue.returnedByName = returnTransaction.returnedByName;
            dataValue.returnedToName = (returnTransaction.returnedByName == returnTransaction.returnedToName) ? null : returnTransaction.returnedToName;
            dataValue.transmittalNumber = returnTransaction.U_TRANSMIT_NUM;
            dataValue.transmitterGroup = (returnTransaction.returnedByName == returnTransaction.returnedToName) ? (returnTransaction.groupDesc) ? returnTransaction.groupDesc : null : (returnTransaction.releaserGroup == returnTransaction.TransmitterGroup) ? (returnTransaction.groupDesc) ? returnTransaction.groupDesc : null : (returnTransaction.groupDesc) ? returnTransaction.groupDesc : returnTransaction.TransmitterGroup;
            dataValue.releasingLocation = returnTransaction.U_LOCATION;
            dataValue.isPosted = returnTransaction.U_IS_POSTED == 1 ? true : false;
            dataValue.controlCount = returnTransaction.U_CONTROL_COUNT;
            dataValue.controlAmount = returnTransaction.U_CONTROL_AMT;
            dataValue.description = returnTransaction.U_DESC;
            dataValue.denied = returnTransaction.U_DENIED == 1 ? true : false;
            dataValue.actualCount = returnTransaction.actualCount;
            dataValue.actualAmount = returnTransaction.actualAmount;
            dataValue.releaserGroup = returnTransaction.releaserGroup;
            dataValue.to_be_staled = returnTransaction.to_be_staled;
            dataValue.receivedBy = returnTransaction.U_RCVD_BY;
            dataValue.companyName = returnTransaction.CompanyName;
            transaction.push(dataValue)
        }
        return {
            transaction: {
                details: transaction[0],
                checks: cheque
            },
        }
    }
}
module.exports = getCheckDocsreturnUseCases;