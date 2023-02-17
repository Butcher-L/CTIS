const getCheckTrailUseCase = ({ reportsDb, transactionsDb, checksDb, transactions, checks }) => {
    return async function get(id, SessionId){
        const trail = await transactions.findCheckTransactionDetails(id, SessionId)
        
        let checkTrail = [];
        check = trail[0];

        let statusArray = [
            "None",
            "None",
            "None",
            "None",
            "None",
            "None",
            "None",
            "None",
            "None",
            "None"
        ];
        //check transfer
        if(check.U_TRANSFER_NUM != null){
            const transfer = await transactions.getTransferTransaction(check.U_TRANSFER_NUM, SessionId)
            if(transfer.length==0){
    
            }else{
                const {U_TRANSFER_NUM, writerGroup, U_TRANSFER_DATE, transferredByName} = transfer[0];
                checkTrail.push({
                    stage: "Transfer",
                    "Transfer Number": U_TRANSFER_NUM, 
                    "Transferred by": transferredByName,
                    "Writer Group": writerGroup, 
                    transactionDate: U_TRANSFER_DATE, 
                });
            }
            statusArray[0] = "Transferred";
        };

        //check transmit
        if(check.U_TRANSMIT_NUM != null ){
            const transmit = await transactions.getTransmitTransaction(check.U_TRANSMIT_NUM, SessionId);
            if(transmit.length==0){
            
            }else{
                const {transmittingGroup, U_TRANSMIT_NUM, transmittedByName, U_TRANSMIT_DATE} = transmit[0];
                checkTrail.push({
                    stage: "Transmit",
                    "Transmittal Number": U_TRANSMIT_NUM, 
                    "Transmitted by": transmittedByName, 
                    "Transmitting Group": transmittingGroup, 
                    transactionDate: U_TRANSMIT_DATE
                });
            }
            
            statusArray[1] = "Transmitted";
        };
        
        //check receive
        if(check.U_RECEIVE_NUM != null){
            const receive = await transactions.getReceiveTransaction(check.U_RECEIVE_NUM, SessionId);
            const {U_RCV_DATE, U_RECEIVE_NUM, releaserName, releaserGroup} = receive[0];
            checkTrail.push({
                stage: "Receive",
                "Receive Number": U_RECEIVE_NUM, 
                "Releaser": releaserName, 
                "Releaser Group": releaserGroup,
                transactionDate: U_RCV_DATE, 
            });
            statusArray[2] = "Received";
        };

        //check release
        if(check.U_RETURN_NUM != null){
            const release = await checks.getReleasedCheckDetails(id.data, SessionId);
            const {U_RELEASE_DATE, releasedBy, releaserGroup} = release[0];
            checkTrail.push({
                stage: "Release",
                "Released by": releasedBy, 
                "Realeaser Group": releaserGroup,
                transactionDate: U_RELEASE_DATE
            });
            statusArray[3] = "Released";
        };

        //check return
        if(check.U_RETURN_NUM != null){
            const returnTransaction = await transactions.getDocsReturnTransaction(check.U_RETURN_NUM, SessionId);
           
            if(returnTransaction.length==0){
    
            }else{
                const {U_RETURN_NUM, U_RETURN_DATE, returnedByName, releaserGroup} = returnTransaction[0];
                checkTrail.push({
                    stage: "Return",
                    "Return Number": U_RETURN_NUM,
                    "Returned by": returnedByName,
                    "Releaser Group": releaserGroup,
                    transactionDate: U_RETURN_DATE,
                });
            }
            statusArray[4] = "Returned";
        };

        //check return receipt
        if(check.U_RETURN_RCPT_NUM != null){
            const returnReceipt = await transactions.getReturnReceipt({
                id:check.U_RETURN_RCPT_NUM,
                company:check.U_ORGANIZATION
            }, SessionId);
            const {U_RETURN_RCPT_NUM, U_RCPT_DATE, receivedByName, transmittingGroup} = returnReceipt[0];
           
            checkTrail.push({
                stage: "Return Receipt",
                "Receipt Number": U_RETURN_RCPT_NUM,
                "Received by": receivedByName,
                "Transmitting Group": transmittingGroup,
                transactionDate: U_RCPT_DATE
            })
            statusArray[5] = "Return Receipt";
        };

        //check pullout
        if(check.U_PULLOUT_NUM != null){
            const pullout = await transactions.getDocsPulloutTransaction(check.U_PULLOUT_NUM, SessionId);
            if(pullout.length==0){

            }else{  const {U_PULLOUT_NUM, U_PULLOUT_DATE, pullOutByName, releasingGroup} = pullout[0];
            checkTrail.push({
                stage: "Pull-out",
                "Pull-out Number": U_PULLOUT_NUM,
                "Pull-out by": pullOutByName,
                "Releasing Group": releasingGroup,
                transactionDate: U_PULLOUT_DATE,
            })}
          
            statusArray[6] = "Pulled-out";
        };

        // check pullout receipt
        if(check.U_PULLOUT_RCPT_NUM != null){
            const pulloutReceipt = await transactions.getPulloutReceipt(check.U_PULLOUT_RCPT_NUM, SessionId);
            const {U_PULLOUT_RCPT_NUM, U_RCPT_DATE, receivedByName, cmtGroup} = pulloutReceipt[0];
            checkTrail.push({
                stage: "Pull-out Receipt",
                "Receipt Number": U_PULLOUT_RCPT_NUM,
                "Received by": receivedByName,
                "CMT Group": cmtGroup,
                transactionDate: U_RCPT_DATE,
            })
            statusArray[7] = "Pull-out Receipt";
        };

        // check recall
        if(check.U_RECALL_NUM != null){
            const recall = await transactions.getDocsRecallTransaction(check.U_RECALL_NUM, SessionId);
            if(recall.length==0){

            }else{
                const {U_RECALL_NUM, U_RECALL_DATE, recallByName, cmtGroup} = recall[0];
                checkTrail.push({
                    stage: "Recall",
                    "Recall Number": U_RECALL_NUM,
                    "Recalled by": recallByName,
                    "CMT Group": cmtGroup,
                    transactionDate: U_RECALL_DATE
                })
            }
           
            statusArray[8] = "Recalled";
        };

        // check recall receipt
        if(check.U_RECALL_RCPT_NUM != null){
            const recallReceipt = await transactions.getRecallReceipt(check.U_RECALL_RCPT_NUM, SessionId);
            if(recallReceipt.length==0){

            }else{
                const {U_RECALL_RCPT_NUM, U_RCPT_DATE, receivedByName, transmittingGroup} = recallReceipt[0];
                checkTrail.push({
                    stage: "Recall Receipt",
                    "Receipt Number": U_RECALL_RCPT_NUM,
                    "Received by": receivedByName,
                    "Transmitting Group": transmittingGroup,
                    transactionDate: U_RCPT_DATE,
    
                })
            }
           
            statusArray[9] = "Recall Receipt";
        };
        
        checkStatus = "";
        statusArray.forEach(status => {
            checkStatus += "/" + status
        });

        return {
            checkStatus,
            checkTrail
        };

    };
};

module.exports = getCheckTrailUseCase;