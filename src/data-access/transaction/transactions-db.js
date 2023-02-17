const transactionsDb = ({ dbs }) => {
    return Object.freeze({
        denyTransaction,
        getReceivedTransactions,
        getToReceiveTransactions,
        transactionSeriesNumber,
        createTransferTransaction,
        getAllTransferTransactions,
        getTransferTransactions,
        receiveTransferTransaction,
        postTransaction,
        unpostTransaction,
        getTransferTransaction,
        createTransmitTransaction,
        receiveTransmitTransaction,
        createReceiveTransaction,
        createDocsReturnTransaction,
        createPulloutTransaction,
        createPullOutReceiptTransaction,
        createRecallTransaction,
        createRecallReceiptTransaction,
        getAllTransmitTransactions,
        getTransmitTransactions,
        getTransmitTransaction,
        getAllReceiveTransactions,
        getReceiveTransactions,
        getReceiveTransaction,
        getDocsReturnTransaction,
        getAllDocsReturnTransactions,
        getDocsReturnTransactions,
        receiveDocsReturnTransaction,
        getAllDocsPulloutTransactions,
        getDocsPulloutTransactions,
        createReturnReceipt,
        getAllReturnReceipts,
        getReturnReceipts,
        getReturnReceipt,
        getDocsPulloutTransaction,
        getAllPulloutReceipts,
        getPulloutReceipts,
        getPulloutReceipt,
        receiveDocsPulloutTransaction,
        getAllDocsRecallTransactions,
        getDocsRecallTransactions,
        getDocsRecallTransaction,
        getAllRecallReceipts,
        getRecallReceipts,
        getRecallReceipt,
        receiveDocsRecallTransaction,
        isTransactionDenied
    });

    async function transactionSeriesNumber(transaction) {
        const db = await dbs();
        const sql = `
                        SELECT MAX(id) FROM "${transaction}"
                    `;
        return db.query(sql);
    };

    async function postTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "${transaction.transaction}" SET "isPosted" = 't' WHERE id = $1 RETURNING *
                    `;
        const params = [transaction.id];
        return db.query(sql, params);
    };


    async function unpostTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "${transaction.transaction}" 
                        SET "isPosted" = 'f', 
                        "updatedBy" = $2, "updatedAt" = NOW()  
                        WHERE id = $1 RETURNING *
                    `;
        const params = [transaction.id, transaction.user_id];
        return db.query(sql, params);
    };

    //========================= Transfer transactions

    //get all check transfer transactions
    async function getAllTransferTransactions() {
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transferredTransactions" WHERE "isPosted" = true AND "actualCount" IS NOT NULL
                    `;
        return db.query(sql);
    };

    //get transfer transactions with date range
    async function getTransferTransactions(dateRange) {
        const db = await dbs();
        const sql = `
                        SELECT * 
                            FROM "transferredTransactions" 
                            WHERE "isPosted" = true AND "actualCount" IS NOT NULL 
                                AND "transferDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };


    //get one transfer transaction
    async function getTransferTransaction(id) {
        const db = await dbs();
        const sql = `
                        SELECT * FROM "transferredTransactions" WHERE id = $1
                    `;
        const params = [id]
        return db.query(sql, params);
    };

    //creates check transfer transaction
    async function createTransferTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkTransfer" 
                            ("transferNumber", transmitter, "transferDate", "transferredBy", "isPosted", "controlCount", "controlAmount", description,
                            "createdBy", "createdAt")
                            VALUES ($1, $2, NOW(), $3, 't', $4, $5, $6, $7, NOW())
                            RETURNING id                        
                    `;
        const params = [
            transaction.transferNumber,
            transaction.transmitter,
            transaction.transferredBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.description,
            transaction.user_id
        ];
        return db.query(sql, params);
    };


    //========================= Transmit transactions
    //create transmit transaction
    async function createTransmitTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkTransmittal"
                            ("transmittalNumber", "specificReleaser", "autoReceiveBy", "autoReleaseBy", "transmittalDate", "transmittedBy", "isPosted", "controlCount", "controlAmount", "releasingLocation", "description",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, $4, NOW(), $5, 't', $6, $7, $8, $9, $10, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.transmittalNumber,
            transaction.specificReleaser,
            transaction.autoReceiveBy,
            transaction.autoReleaseBy,
            transaction.transmittedBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.releasingLocation,
            transaction.description,
            transaction.user_id
        ];
        return db.query(sql, params)
    };

    //get all transmit transactions
    async function getAllTransmitTransactions() {
        const db = await dbs();
        const sql = `SELECT * FROM "transmittalTransactions" WHERE "actualCount" IS NOT NULL`;
        return db.query(sql);
    };

    //gets one transmittal transaction
    async function getTransmitTransaction(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "transmittalTransactions" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);

    };

    //get transmit transactions with date range
    async function getTransmitTransactions(dateRange) {
        const db = await dbs();
        const sql = `
                        SELECT * 
                            FROM "transmittalTransactions" 
                            WHERE "actualCount" IS NOT NULL 
                                AND "transmittalDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };

    //========================= Receive transactions
    async function createReceiveTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkReceive"
                            ("receiveNumber", "receiveDescription", "receiveDate", "releaser", "isPosted", "controlCount", "controlAmount",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, NOW(), $3, 't', $4, $5, $6, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.receiveNumber,
            transaction.receiveDescription,
            transaction.releaser,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function getAllReceiveTransactions() {
        const db = await dbs();
        const sql = `SELECT * FROM "receiveTransactions" WHERE "actualCount" IS NOT NULL`;
        return db.query(sql);
    };

    //gets one transmittal transaction
    async function getReceiveTransaction(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "receiveTransactions" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);
    };

    //get with date range
    async function getReceiveTransactions(dateRange) {
        const db = await dbs();
        const sql = `SELECT * FROM 
                        "receiveTransactions" 
                        WHERE "actualCount" IS NOT NULL
                            AND "receiveDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };

    //========================= Return transactions
    async function createDocsReturnTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkDocsReturn"
                            ("returnNumber", "returnedBy", "returnTo", description, "returnDate", "isPosted", "controlCount", "controlAmount",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, $4, NOW(), 't', $5, $6, $7, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.returnNumber,
            transaction.returnBy,
            transaction.returnTo,
            transaction.description,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function getAllDocsReturnTransactions() {
        const db = await dbs();
        const sql = `SELECT * FROM "docsReturnTransactions" WHERE "actualCount" IS NOT NULL`;
        return db.query(sql);
    };

    //get docs return transactions with date range
    async function getDocsReturnTransactions(dateRange) {
        const db = await dbs();
        const sql = `SELECT * 
                        FROM "docsReturnTransactions" 
                        WHERE "actualCount" IS NOT NULL
                        AND "returnDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };

    async function getDocsReturnTransaction(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsReturnTransactions" WHERE id = $1 `;
        const params = [transaction.id];
        return db.query(sql, params);
    };

    async function createReturnReceipt(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkReturnReceipt"
                            ("returnReceiptNumber", "receivedFrom", "description", "receiptDate", "receivedBy", "isPosted", "controlCount", "controlAmount",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, NOW(), $4, 't', $5, $6, $7, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.returnReceiptNumber,
            transaction.receivedFrom,
            transaction.description,
            transaction.receivedBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function getAllReturnReceipts() {
        const db = await dbs();
        const sql = `SELECT * FROM "docsReturnReceipts"`;
        return db.query(sql);
    };

    //get return receipts with date range
    async function getReturnReceipts(dateRange) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsReturnReceipts" WHERE "receiptDate" BETWEEN $1 AND $2`;
        const params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    }

    //gets one return receipt transaction
    async function getReturnReceipt(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsReturnReceipts" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);

    };

    //========================= Pullout transactions
    async function createPulloutTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkDocsPullout"
                            ("pullOutNumber", "pullOutTo", description, "pullOutDate", "pullOutBy", "isPosted", "controlCount", "controlAmount",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, NOW(), $4, 't', $5, $6, $7, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.pullOutNumber,
            transaction.pullOutTo,
            transaction.description,
            transaction.pullOutBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function createPullOutReceiptTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkPulloutReceipt"
                            ("receiptNumber", "receivedFrom", "description", "receiptDate", "receivedBy", "isPosted", "controlCount", "controlAmount",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, NOW(), $4, 't', $5, $6, $7, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.receiptNumber,
            transaction.receivedFrom,
            transaction.description,
            transaction.receiveBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function getAllDocsPulloutTransactions() {
        const db = await dbs();
        const sql = `SELECT * 
                        FROM "docsPulloutTransactions" 
                        WHERE "isPosted" = 't' AND "receivedBy" IS NULL
                    `;
        return db.query(sql);
    };

    //get all docs pullout with date range
    async function getDocsPulloutTransactions(dateRange) {
        const db = await dbs();
        const sql = `SELECT * 
                        FROM "docsPulloutTransactions" 
                        WHERE "isPosted" = 't' AND "receivedBy" IS NULL
                            AND "pullOutDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    };

    //gets one transmittal transaction
    async function getDocsPulloutTransaction(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsPulloutTransactions" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);

    };

    async function getAllPulloutReceipts() {
        const db = await dbs();
        const sql = `SELECT * FROM "docsPulloutReceipts" WHERE "actualCount" IS NOT NULL AND "actualAmount" IS NOT NULL`;
        return db.query(sql);
    };

    //get pull out receipts with date range
    async function getPulloutReceipts(dateRange) {
        const db = await dbs();
        const sql = `SELECT *  
                        FROM "docsPulloutReceipts" 
                        WHERE "actualCount" IS NOT NULL AND "actualAmount" IS NOT NULL
                            AND "receiptDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    };

    //gets one transmittal transaction
    async function getPulloutReceipt(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsPulloutReceipts" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);

    };

    //========================= Recall transactions
    async function createRecallTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkDocsRecall"
                            ("recallNumber", "recallTo", description, "receiptDate", "receivedBy", "isPosted", "controlCount", "controlAmount", "recallBy",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, NOW(), $4, 't', $5, $6, $7, $8, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.recallNumber,
            transaction.recallTo,
            transaction.description,
            transaction.receivedBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.recallBy,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function createRecallReceiptTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        INSERT INTO "checkRecallReceipt"
                            ("recallReceiptNumber", "receivedFrom", "description", "receiptDate", "receivedBy", "isPosted", "controlCount", "controlAmount",
                            "createdBy", "createdAt")
                            VALUES ($1, $2, $3, NOW(), $4, 't', $5, $6, $7, NOW())
                            RETURNING id
                    `;
        const params = [
            transaction.recallReceiptNumber,
            transaction.receivedFrom,
            transaction.description,
            transaction.receivedBy,
            transaction.controlCount,
            transaction.controlAmount,
            transaction.user_id
        ];
        return db.query(sql, params);
    };

    async function getAllDocsRecallTransactions() {
        const db = await dbs();
        const sql = `SELECT * FROM "docsRecallTransactions" WHERE "receivedBy" IS NULL`;
        return db.query(sql);
    };

    async function getDocsRecallTransactions(dateRange) {
        const db = await dbs();
        const sql = `SELECT * 
                        FROM "docsRecallTransactions" 
                        WHERE "receivedBy" IS NULL
                        AND "receiptDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate]
        return db.query(sql, params);
    };

    //gets one recall transaction
    async function getDocsRecallTransaction(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsRecallTransactions" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);

    };

    async function getAllRecallReceipts() {
        const db = await dbs();
        const sql = `SELECT * FROM "docsRecallReceipts" WHERE "actualCount" IS NOT NULL AND "actualAmount" IS NOT NULL`;
        return db.query(sql);
    };

    //get recall receipts with date range
    async function getRecallReceipts(dateRange) {
        const db = await dbs();
        const sql = `SELECT * 
                        FROM "docsRecallReceipts" 
                        WHERE "actualCount" IS NOT NULL AND "actualAmount" IS NOT NULL
                        AND "receiptDate" BETWEEN $1 AND $2
                    `;
        const params = [dateRange.startDate, dateRange.endDate];
        return db.query(sql, params);
    };

    //gets one transmittal transaction
    async function getRecallReceipt(transaction) {
        const db = await dbs();
        const sql = `SELECT * FROM "docsRecallReceipts" WHERE id = $1`;
        const params = [transaction.id];
        return db.query(sql, params);
    };

    //RECEIVE TRANSACTIONS
    //receive transfer checks
    async function receiveTransferTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransfer" SET "receivedBy" = $1 WHERE id = $2
                    `;
        const params = [transaction.receivedBy, transaction.id];
        return db.query(sql, params);
    };

    async function receiveTransmitTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "checkTransmittal" SET "receivedBy" = $1 WHERE id = $2
                    `;
        const params = [transaction.receivedBy, transaction.id];
        return db.query(sql, params);
    };

    async function receiveDocsReturnTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "checkDocsReturn" SET "receivedBy" = $1, 
                        "receiptNumber" = $3 ,
                        "updatedBy" = $4,
                        "updatedAt" = NOW()
                        WHERE id = $2
                    `;
        const params = [transaction.receivedBy, transaction.id, transaction.receiptNumber, transaction.user_id];
        return db.query(sql, params);
    };

    async function receiveDocsRecallTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "checkDocsRecall" SET "receivedBy" = $1, "receiptNumber" = $3, "updatedBy" = $4, "updatedAt" = NOW() WHERE id = $2
                    `;
        const params = [transaction.receivedBy, transaction.id, transaction.receiptNumber, transaction.user_id];
        return db.query(sql, params);
    };

    async function receiveDocsPulloutTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "checkDocsPullout" SET "receivedBy" = $1, "receiptNumber" = $3, "updatedBy" = $4, "updatedAt" = NOW() WHERE id = $2
                    `;
        const params = [transaction.receivedBy, transaction.id, transaction.receiptNumber, transaction.user_id];
        return db.query(sql, params);
    };

    //view to receive transactions
    async function getToReceiveTransactions(transaction, datefilter) {

        const db = await dbs();
        const sql = `
                        SELECT * 
                            FROM "${transaction}" 
                            WHERE "isPosted" = true 
                                AND denied = false 
                                AND "receivedBy" IS NULL
                                ${datefilter ? `AND "${datefilter.dateFilter}" BETWEEN '${datefilter.startDate}' AND '${datefilter.endDate}'` : ``}
                    `;

        return db.query(sql);
    };

    //get received transactions
    async function getReceivedTransactions(transaction) {
        let sql = `SELECT * FROM "${transaction}" WHERE "isPosted" = true AND denied = false AND "receivedBy" IS NOT NULL AND "actualCount" IS NOT NULL`

        const receiptTransactions = ['docsReturnTransactions', 'docsRecallTransactions', 'docsPulloutTransactions'];

        if (receiptTransactions.includes(transaction)) {
            sql = `SELECT * FROM "${transaction}" WHERE "isPosted" = true AND denied = false AND "receivedBy" IS NOT NULL AND "receiptNumber" IS NULL`
        };

        const db = await dbs();
        return db.query(sql);
    };

    //deny transaction
    async function denyTransaction(transaction) {
        const db = await dbs();
        const sql = `
                        UPDATE "${transaction.transaction}" SET denied = 'true', "updatedBy" = $2, "updatedAt" = NOW() 
                        WHERE id = $1 RETURNING *
                    `
        const params = [transaction.id, transaction.user_id];
        return db.query(sql, params);
    };

    //check if transaction has been denied
    async function isTransactionDenied(transaction) {
        const db = await dbs();
        const sql = `
                        SELECT * FROM "${transaction.transaction}" WHERE denied = 'true' AND id = $1
                    `
        const params = [transaction.id];
        return db.query(sql, params);
    };
};

module.exports = transactionsDb;