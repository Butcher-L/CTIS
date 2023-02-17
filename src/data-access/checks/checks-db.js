const checksDb = ({ dbs }) => {
    return Object.freeze({
        addCheck,
        getAccountsPayableChecks,
        getAllTransferredChecks,
        getTransferredCheckDetails,
        getTransferredByTransaction,
        transferCheck,
        transmitCheck,
        getAllTransmittedChecks,
        getTransmittedByTransaction,
        getTransmittedCheckDetails,
        receiveCheck,
        getAllReceivedChecks,
        getReceivedChecks,
        getReceivedByTransaction,
        getReceivedCheckDetails,
        releaseCheck,
        getAllReleasedChecks,
        getReleasedChecks,
        getReleasedCheckDetails,
        staleCheck,
        recallCheck,
        getAllRecalledChecks,
        getRecalledChecks,
        getRecalledByTransaction,
        getRecalledCheckDetails,
        pullOutCheck,
        getAllPulledoutChecks,
        getPulledoutByTransaction,
        getPulledoutCheckDetails,
        voidCheck,
        getAllVoidedChecks,
        getVoidedChecks,
        getVoidedCheckDetails,
        returnCheckDocs,
        getAllReturnedChecks,
        getReturnedByTransaction,
        getReturnedCheckDetails,
        checkReturnReceipt,
        getAllReturnCheckReceipts,
        getReturnCheckReceiptsByTransaction,
        getReturnCheckReceiptDetails,
        checkPulloutReceipt,
        getAllPulledoutCheckReceipts,
        getPulledoutReceiptsByTransaction,
        getPulledoutCheckReceiptDetails,
        checkRecallReceipt,
        getAllRecalledCheckReceipts,
        getRecalledReceiptsByTransaction,
        getRecalledCheckReceiptDetails,
        getAllStaledChecks,
        getStaledChecks,
        unpostCheck
    });

    async function addCheck(check){
        const db = await dbs();
        const sql = `
                        INSERT INTO checks 
                            ("checkNumber", "createdBy", "creationDate", payee, "paymentDate", "maturityDate", "checkAmount", "bank", "voucher", "description")
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    `;
        const params = [check.checkNumber, 
                        check.createdBy, 
                        check.creationDate, 
                        check.payee, 
                        check.paymentDate, 
                        check.maturityDate, 
                        check.checkAmount, 
                        check.bank, 
                        check.voucher, 
                        check.description];
        return db.query(sql, params);
    };

    async function getAccountsPayableChecks(datefilter){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "accountsPayableCheckDetails"
                            WHERE id NOT IN (SELECT id FROM "staledChecks")
                            ${datefilter != undefined? `AND "creationDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'`: ``}
                    `
        return db.query(sql);
    };

    //update check status to transferred
    //assigns transferNumber to checks
    async function transferCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 2, "transferNumber" = $2,
                            "updatedBy" = $3, "updatedAt" = NOW()
                            WHERE "check" = $1 
                            RETURNING *
                    `
        const params = [check.id, check.transferNumber, check.user_id];
        return db.query(sql, params);
    };

//========================= TRANSFER
    //get all transferred checks
    async function getAllTransferredChecks(){
        const db = await dbs();
        const sql = `SELECT * 
                        FROM "transferredChecks"
                        AND id NOT IN (SELECT id FROM "staledChecks")
                    `;
        return db.query(sql);
    };

    //get transferred check details
    async function getTransferredCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transferredChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

    //get transferred checks by transaction
    async function getTransferredByTransaction(transferId, datefilter){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transferredChecks" WHERE "transferId" = $1
                            ${datefilter != null ? `AND "creationDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'`: ``}
                    `;
        const params = [transferId];
        return db.query(sql, params);
    };

//========================= TRANSMIT
    //update check status to transmitted
    //assigns transmittalNumber to checks
    async function transmitCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 3, "transmittalNumber" = $2,
                            "updatedBy" = $3, "updatedAt" = NOW()
                            WHERE "check" = $1 
                            RETURNING *
                    `
        const params = [check.id, check.transmittalNumber, check.user_id];
        return db.query(sql, params);
    };

    //get all transmitted checks
    async function getAllTransmittedChecks(){
        const db = await dbs();
        const sql = `SELECT * FROM "transmittedChecks"`;
        return db.query(sql);
    };

    //get transmitted checks by transaction
    async function getTransmittedByTransaction(transferId, datefilter){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transmittedChecks" WHERE "transmittalId" = $1
                        ${datefilter != undefined ? `AND "creationDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'`: ``}
                    `;
        const params = [transferId];
        return db.query(sql, params);
    };

     //get transmitted check details
     async function getTransmittedCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transmittedChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//========================= RECEIVED
    //update check status to received
    //assigns receiveNumber to checks
    async function receiveCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 4, "receiveNumber" = $2,
                            "updatedBy" = $3, "updatedAt" = NOW()
                            WHERE "check" = $1 
                            RETURNING *
                    `
        const params = [check.id, check.receiveNumber, check.user_id];
        return db.query(sql, params);
    };

     //get all received checks
     async function getAllReceivedChecks(){
        const db = await dbs();
        const sql = `
                        SELECT rc.*, cs.name as "status" 
                            FROM "receivedChecks" rc LEFT JOIN "checkStatus" cs ON rc."checkStatus" = cs.id
                    `;
        return db.query(sql);
    };

    //get received checks with date range
    async function getReceivedChecks(dateRange){
        const db = await dbs();
        const sql = `
                        SELECT rc.*, cs.name as "status" 
                            FROM "receivedChecks" rc LEFT JOIN "checkStatus" cs ON rc."checkStatus" = cs.id
                            WHERE "creationDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };

    //get received checks by transaction
    async function getReceivedByTransaction(transferId){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "receivedChecks" WHERE "receivedId" = $1
                    `;
        const params = [transferId];
        return db.query(sql, params);
    };

     //get received check details
     async function getReceivedCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "receivedChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//========================= RELEASE

    //update check status to released
    async function releaseCheck(transaction){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions"
                            SET "releasedBy" = $1, "releaseDescription" = $2, "releasedTo" = $3, "releasedToEmail" = $4, 
                                "releasedToContactNumber" = $5, "checkStatus" = 5, "releaseDate" = NOW(),
                                "updatedBy" = $7, "updatedAt" = NOW()
                            WHERE "check" = $6
                            RETURNING *
                    `;
        const params = [
            transaction.releasedBy,
            transaction.releaseDescription,
            transaction.releasedTo,
            transaction.releasedToEmail,
            transaction.releasedToContactNumber,
            transaction.checkId,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    //get all released checks
    async function getAllReleasedChecks(){
        const db = await dbs();
        const sql = `SELECT rc.*, cs.name as "status" 
                        FROM "releasedChecks" rc 
                        LEFT JOIN "checkStatus" cs ON rc."checkStatus" = cs.id 
                        WHERE "returnNumber" IS NULL`;
        return db.query(sql);
    };

    //get released checks with date range
    async function getReleasedChecks(dateRange){
        const db = await dbs();
        const sql = `SELECT rc.*, cs.name as "status" 
                        FROM "releasedChecks" rc 
                        LEFT JOIN "checkStatus" cs ON rc."checkStatus" = cs.id 
                        WHERE "returnNumber" IS NULL
                        AND "creationDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };

     //get released check details
     async function getReleasedCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "releasedChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//========================= RETURN
    //update check return number
    async function returnCheckDocs(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "returnNumber" = $2,
                            "updatedBy" = $3,
                            "updatedAt" = NOW()
                            WHERE "check" = $1
                            RETURNING *
                    `
        const params = [check.id, check.returnNumber, check.user_id];
        return db.query(sql, params);
    };

      //get all returned checks
    async function getAllReturnedChecks(){
        const db = await dbs();
        const sql = `SELECT * FROM "returnedChecks"`;
        return db.query(sql);
    };

    //get returned checks by transaction
    async function getReturnedByTransaction(id, datefilter){

        const db = await dbs();
        const sql = `
                        SELECT * FROM "returnedChecks" WHERE "returnNumber" = $1
                            ${datefilter != undefined ? `AND "creationDate" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'`: ``}
                    `;
        const params = [id];
        return db.query(sql, params);
    };

     //get returned check details
     async function getReturnedCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "returnedChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

    //update check return receipt number
    async function checkReturnReceipt(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "returnReceiptNumber" = $2,
                            "updatedBy" = $3,
                            "updatedAt" = NOW()
                            WHERE "check" = $1
                            RETURNING *
                    `
        const params = [check.id, check.returnReceiptNumber, check.user_id];
        return db.query(sql, params);
    };
    
    async function getAllReturnCheckReceipts(){
        const db = await dbs();
        const sql = `SELECT * FROM "returnedCheckReceipts"`;
        return db.query(sql);
    };

    //get check receipts by transaction
    async function getReturnCheckReceiptsByTransaction(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "returnedCheckReceipts" WHERE "returnReceiptNumber" = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

     //get check receipt details
     async function getReturnCheckReceiptDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "returnedCheckReceipts" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//========================= STALE
    async function getAllStaledChecks(){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "staledChecks"
                    `;
        return db.query(sql);
    };

    //with date range
    async function getStaledChecks(dateRange){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "staledChecks" WHERE "creationDate" BETWEEN $1 AND $2
                    `;
        params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    };

    //update check status to staled
    async function staleCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 6
                            WHERE "check" = $1
                            RETURNING *
                    `
        const params = [check.id];
        return db.query(sql, params);
    };

//========================= PULL OUT

    //update check status to pulled out
    //assigns pullOutNumber to checks
    async function pullOutCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 7, "pullOutNumber" = $2, 
                            "updatedBy" = $3, "updatedAt" = NOW()
                            WHERE "check" = $1 
                            RETURNING *
                    `
        const params = [check.id, check.pullOutNumber, check.user_id];
        return db.query(sql, params);
    };

    //get all pulled out checks
    async function getAllPulledoutChecks(){
        const db = await dbs();
        const sql = `SELECT * FROM "pulledoutChecks" WHERE "pulloutId" IS NOT NULL AND "pulloutReceiptId" IS NULL`;
        return db.query(sql);
    };

    //get pulled out checks by transaction
    async function getPulledoutByTransaction(transferId){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "pulledoutChecks" WHERE "pulloutId" = $1 AND "pulloutReceiptId" IS NULL
                    `;
        const params = [transferId];
        return db.query(sql, params);
    };

     //get pulled out check details
     async function getPulledoutCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "pulledoutChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };


    //update check pullout receipt number
    async function checkPulloutReceipt(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "receiptNumber" = $2,
                            "updatedBy" = $3,
                            "updatedAt" = NOW()
                            WHERE "check" = $1
                            RETURNING *
                    `
        const params = [check.id, check.receiptNumber, check.user_id];
        return db.query(sql, params);
    };

    //get all pulled out checks receipts
    async function getAllPulledoutCheckReceipts(){
        const db = await dbs();
        const sql = `SELECT * FROM "pulledoutChecks" WHERE "pulloutId" IS NOT NULL AND "pulloutReceiptId" IS NOT NULL`;
        return db.query(sql);
    };

    //get pulled out checks by transaction receipts
    async function getPulledoutReceiptsByTransaction(pulloutId){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "pulledoutChecks" WHERE "pulloutReceiptId" = $1
                    `;
        const params = [pulloutId];
        return db.query(sql, params);
    };

     //get pulled out check receipt details
     async function getPulledoutCheckReceiptDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "pulledoutChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//========================= RECALL

    //update check status to recalled
    //assigns recallNumber to checks
    async function recallCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 8, "recallNumber" = $2,
                            "updatedBy" = $3, "updatedAt" = NOW()
                            WHERE "check" = $1 
                            RETURNING *
                    `
        const params = [check.id, check.recallNumber, check.user_id];
        return db.query(sql, params);
    };

    //get all recalled checks
    async function getAllRecalledChecks(){
        const db = await dbs();
        const sql = `SELECT * FROM "recalledChecks" WHERE "recallId" IS NOT NULL AND "recallReceiptId" IS NULL`;
        return db.query(sql);
    };

    //get recalled checks with date range
    async function getRecalledChecks(dateRange){
        const db = await dbs();
        const sql = `SELECT * FROM 
                        "recalledChecks" WHERE "recallId" IS NOT NULL AND "recallReceiptId" IS NULL
                        AND "receiptDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    };

    //get recalled checks by transaction
    async function getRecalledByTransaction(recallId){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "recalledChecks" WHERE "recallId" = $1 AND "recallReceiptId" IS NULL
                    `;
        const params = [recallId];
        return db.query(sql, params);
    };

     //get recalled check details
     async function getRecalledCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "recalledChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

    //update check recall receipt number
    async function checkRecallReceipt(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "recallReceiptNumber" = $2,
                            "updatedAt" = NOW(),
                            "updatedBy" = $3
                            WHERE "check" = $1
                            RETURNING *
                    `
        const params = [check.id, check.recallReceiptNumber, check.user_id];
        return db.query(sql, params);
    };

     //get all recalled check receipts
     async function getAllRecalledCheckReceipts(){
        const db = await dbs();
        const sql = `SELECT * FROM "recalledChecks" WHERE "recallId" IS NOT NULL AND "recallReceiptId" IS NOT NULL`;
        return db.query(sql);
    };

    //get recalled checks by transaction
    async function getRecalledReceiptsByTransaction(transferId){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "recalledChecks" WHERE "recallId" = $1 AND "recallReceiptId" IS NOT NULL
                    `;
        const params = [transferId];
        return db.query(sql, params);
    };

     //get recalled check details
     async function getRecalledCheckReceiptDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "recalledChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//========================= VOID

    //update check status to void
    async function voidCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions" 
                            SET "checkStatus" = 9 
                            WHERE "check" = $1 
                            RETURNING *
                    `
        const params = [check.id];
        return db.query(sql, params);
    };

    //get all voided checks
    async function getAllVoidedChecks(){
        const db = await dbs();
        const sql = `SELECT * FROM "voidedChecks"`;
        return db.query(sql);
    };

    //get voided checks for a given date range
    async function getVoidedChecks(dateRange){
        const db = await dbs();
        const sql = `SELECT * FROM "voidedChecks" WHERE "creationDate" BETWEEN $1 AND $2`;
        const params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    };

     //get voided check details
     async function getVoidedCheckDetails(id){
        const db = await dbs();
        const sql = `
                        SELECT * FROM "voidedChecks" WHERE id = $1
                    `;
        const params = [id];
        return db.query(sql, params);
    };

//unpost checks
    async function unpostCheck(check){
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransactions"
                            SET "checkStatus" = $1,
                            "${check.transactionNumber}" = null,
                            "updatedBy" = $3,
                            "updatedAt" = NOW()
                            WHERE "check" = $2
                            RETURNING id
                    `;
        const params = [check.checkStatus, check.checkId, check.user_id];
        return db.query(sql, params);
    };

};

module.exports = checksDb;