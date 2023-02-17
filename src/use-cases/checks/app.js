const makeCheck = require('../../entities/checks/app');
const checksDb = require('../../data-access/checks/app');
const transactionsDb = require('../../data-access/transaction/app');

//sl
const {checks} = require('../../sl-access/checks/checks');
const {transactions} = require('../../sl-access/transaction/transaction')
const {cma} = require("../../hdb-query/hdb")

const {
    makeTransfer,
    makeTransmit,
    makeReceive,
    makeRelease,
    makeDocsReturn,
    makeDocsPullout,
    makePulloutReceipt,
    makeDocsRecall,
    makeRecallReceipt,
    makeReturnReceipt
} = require('../../entities/transactions/app');


const addCheck = require('./check-add');
const getAcctsPayableChecks = require('./check-get-accounts-payable');
const getAllTransferred = require('./transfer/get-all-transferred');
const getTransferredCheck = require('./transfer/get-transfered-check');
const getByTransaction = require('./transfer/get-by-transaction');
const transferCheck = require('./transfer/check-transfer');
const transmitCheck = require('./transmit/check-transmit');
const getAllTransmitted = require('./transmit/get-all-transmittal');
const getTransmittedByTransaction = require('./transmit/get-by-transaction');
const getTransmittedCheck = require('./transmit/get-transmitted-check');
const receiveCheck = require('./check-receive/check-receive');
const getAllReceived = require('./check-receive/get-all-received');
const getReceivedByTransaction = require('./check-receive/get-by-transaction');
const getReceivedCheck = require('./check-receive/get-received-check');
const releaseCheck = require('./check-release/check-release');
const getAllReleased = require('./check-release/get-all-released');
const getReleased = require('./check-release/get-released-check');
const docsReturnCheck = require('./check-docs-return/check-docs-return');
const getAllReturned =require('./check-docs-return/get-all-returned');
const getReturnedByTransaction = require('./check-docs-return/get-returned-by-transaction');
const getReturnedCheck = require('./check-docs-return/get-returned-check');
const returnReceiptCheck = require('./check-docs-return/check-return-receipt');
const getAllCheckReturnReceipt = require('./check-docs-return/return-receipt-get-all');
const getCheckReturnReceiptsByTransaction = require('./check-docs-return/return-receipt-get-by-transaction');
const getCheckReturnReceipt = require('./check-docs-return/return-receipt-check-details');
const docsPulloutCheck = require('./check-docs-pullout/check-docs-pullout');
const getAllPulledoutChecks = require('./check-docs-pullout/get-all-pulledout');
const getPulledoutByTransaction = require('./check-docs-pullout/get-pulledout-by-transaction');
const getPulledoutCheck = require('./check-docs-pullout/get-pulledout-check');
const pulloutReceiptCheck = require('./check-docs-pullout/check-pullout-receipt');
const getAllCheckPulloutReceipts = require('./check-docs-pullout/get-all-pullout-receipt');
const getPulloutReceiptByTransaction = require('./check-docs-pullout/get-pullout-receipt-by-transaction');
const getPulloutReceipt = require('./check-docs-pullout/get-pullout-receipt');
const docsRecallCheck = require('./check-docs-recall/check-docs-recall');
const recallReceiptCheck = require('./check-docs-recall/check-recall-receipt');
const getAllRecalledChecks = require('./check-docs-recall/get-all-recalled');
const getRecalledByTransaction = require('./check-docs-recall/get-recalled-by-transaction');
const getRecalledCheck = require('./check-docs-recall/get-recalled-check');
const getAllCheckRecallReceipts = require('./check-docs-recall/get-all-recall-receipt');
const getRecallReceiptByTransaction = require('./check-docs-recall/get-recall-receipt-by-transaction');
const getRecallReceipt = require('./check-docs-recall/get-recall-receipt');
const voidCheck = require('./void/check-void');
const getAllVoidedChecks = require('./void/get-all-void');
const getVoidedCheck = require('./void/get-void-check');
const getAllStaledChecks = require('./staled/get-all-staled');

const findCheck = require("./find-check")
const selectAllChecks = require("./select_all_checks")
const updateReleaseDate = require("./update-release-date")
const selectByDate = require("./selectByDate-report")

const addCheckUseCase = addCheck({ checksDb, makeCheck });
const getAcctsPayableChecksUseCase = getAcctsPayableChecks({ checksDb, checks });
const getAllTransferredUseCase = getAllTransferred({ checksDb, transactions });
const getTransferredCheckUseCase = getTransferredCheck({ checksDb, checks });
const getByTransactionUseCase = getByTransaction({ checksDb, checks });
const transferCheckUseCase = transferCheck({ checksDb, makeTransfer, transactionsDb, transactions, checks });
const transmitCheckUseCase = transmitCheck({ makeTransmit, transactions, checks });
const getAllTransmittedUseCase = getAllTransmitted({ checksDb });
const getTransmittedByTransactionUseCase = getTransmittedByTransaction({ checksDb });
const getTransmittedCheckUseCase = getTransmittedCheck({ checksDb });
const receiveCheckUseCase = receiveCheck({ checksDb, transactionsDb, makeReceive, checks, transactions ,cma});
const getAllReceivedUseCase = getAllReceived({ checksDb , checks});
const getReceivedByTransactionUseCase = getReceivedByTransaction({ checksDb });
const getReceivedCheckUseCase = getReceivedCheck({ checksDb });
const releaseCheckUseCase = releaseCheck({ makeRelease, checks, transactions });
const getAllReleasedUseCase = getAllReleased({ checksDb, checks});
const getReleasedUseCase = getReleased({ checksDb });
const docsReturnCheckUseCase = docsReturnCheck({ checksDb, transactionsDb, makeDocsReturn,transactions, checks, cma});
const returnReceiptCheckUseCase = returnReceiptCheck({ checksDb, transactionsDb, makeReturnReceipt , checks, transactions});
const getAllCheckReturnReceiptUseCase = getAllCheckReturnReceipt({ checksDb , checks});
const getCheckReturnReceiptsByTransactionUseCase = getCheckReturnReceiptsByTransaction({ checksDb });
const getCheckReturnReceiptUseCase = getCheckReturnReceipt({ checksDb });
const getAllReturnedUseCase = getAllReturned({ checksDb, checks });
const getReturnedByTransactionUseCase = getReturnedByTransaction({ checksDb, checks });
const getReturnedCheckUseCase = getReturnedCheck({ checksDb });
const docsPulloutCheckUseCase = docsPulloutCheck({ checksDb, transactionsDb, makeDocsPullout, checks, transactions });
const getAllPulledoutChecksUseCase = getAllPulledoutChecks({ checksDb, checks });
const getPulledoutByTransactionUseCase = getPulledoutByTransaction({ checksDb })
const getPulledoutCheckUseCase = getPulledoutCheck({ checksDb });
const pulloutReceiptUseCase = pulloutReceiptCheck({ checksDb, transactionsDb, makePulloutReceipt, checks, transactions});
const getAllCheckPulloutReceiptsUseCase = getAllCheckPulloutReceipts({ checksDb });
const getPulloutReceiptByTransactionUseCase = getPulloutReceiptByTransaction({ checksDb });
const getPulloutReceiptUseCase = getPulloutReceipt({ checksDb });
const docsRecallCheckUseCase = docsRecallCheck({ checksDb, transactionsDb, makeDocsRecall, checks, transactions });
const recallReceiptCheckUseCase = recallReceiptCheck({ checksDb, transactionsDb, makeRecallReceipt, checks, transactions });
const getAllCheckRecallReceiptsUseCase = getAllCheckRecallReceipts({ checksDb });
const getRecallReceiptByTransactionUseCase = getRecallReceiptByTransaction({ checksDb });
const getRecallReceiptUseCase = getRecallReceipt({ checksDb });
const getAllRecalledChecksUseCase = getAllRecalledChecks({ checksDb });
const getRecalledByTransactionUseCase = getRecalledByTransaction({ checksDb });
const getRecalledCheckUseCase = getRecalledCheck({ checksDb });
const voidCheckUseCase = voidCheck({ checksDb });
const getAllVoidedChecksUseCase = getAllVoidedChecks({ checksDb })
const getVoidedCheckUseCase = getVoidedCheck({ checksDb });
const getAllStaledChecksUseCase = getAllStaledChecks({ checksDb, checks });

const findCheckUseCase = findCheck({checks})
const selectAllChecksUseeCase = selectAllChecks({checks})
const updateReleaseDateUseCase = updateReleaseDate({checks})
const selectByDateUseCase = selectByDate({checks})

const checksService = Object.freeze({
    addCheckUseCase,
    getAcctsPayableChecksUseCase,
    transferCheckUseCase,
    getAllTransferredUseCase,
    getTransferredCheckUseCase,
    getByTransactionUseCase,
    transmitCheckUseCase,
    getAllTransmittedUseCase,
    getTransmittedByTransactionUseCase,
    getTransmittedCheckUseCase,
    receiveCheckUseCase,
    getAllReceivedUseCase,
    getReceivedByTransactionUseCase,
    getReceivedCheckUseCase,
    releaseCheckUseCase,
    getAllReleasedUseCase,
    getReleasedUseCase,
    docsReturnCheckUseCase,
    returnReceiptCheckUseCase,
    getAllCheckReturnReceiptUseCase,
    getCheckReturnReceiptsByTransactionUseCase,
    getCheckReturnReceiptUseCase,
    getAllReturnedUseCase,
    getReturnedByTransactionUseCase,
    getReturnedCheckUseCase,
    docsPulloutCheckUseCase,
    getAllPulledoutChecksUseCase,
    getPulledoutByTransactionUseCase,
    getPulledoutCheckUseCase,
    pulloutReceiptUseCase,
    getAllCheckPulloutReceiptsUseCase,
    getPulloutReceiptByTransactionUseCase,
    getPulloutReceiptUseCase,
    docsRecallCheckUseCase,
    getAllRecalledChecksUseCase,
    getRecalledByTransactionUseCase,
    getRecalledCheckUseCase,
    recallReceiptCheckUseCase,
    getAllCheckRecallReceiptsUseCase,
    getRecallReceiptByTransactionUseCase,
    getRecallReceiptUseCase,
    voidCheckUseCase,
    getAllVoidedChecksUseCase,
    getVoidedCheckUseCase,
    getAllStaledChecksUseCase,

    findCheckUseCase,
    selectAllChecksUseeCase,
    updateReleaseDateUseCase,
    selectByDateUseCase
});

module.exports = checksService;
module.exports = {
    addCheckUseCase,
    getAcctsPayableChecksUseCase,
    transferCheckUseCase,
    getAllTransferredUseCase,
    getTransferredCheckUseCase,
    getByTransactionUseCase,
    transmitCheckUseCase,
    getAllTransmittedUseCase,
    getTransmittedByTransactionUseCase,
    getTransmittedCheckUseCase,
    receiveCheckUseCase,
    getAllReceivedUseCase,
    getReceivedByTransactionUseCase,
    getReceivedCheckUseCase,
    releaseCheckUseCase,
    getAllReleasedUseCase,
    getReleasedUseCase,
    docsReturnCheckUseCase,
    returnReceiptCheckUseCase,
    getAllCheckReturnReceiptUseCase,
    getCheckReturnReceiptsByTransactionUseCase,
    getCheckReturnReceiptUseCase,
    getAllReturnedUseCase,
    getReturnedByTransactionUseCase,
    getReturnedCheckUseCase,
    docsPulloutCheckUseCase,
    pulloutReceiptUseCase,
    getAllCheckPulloutReceiptsUseCase,
    getPulloutReceiptByTransactionUseCase,
    getPulloutReceiptUseCase,
    getAllPulledoutChecksUseCase,
    getPulledoutByTransactionUseCase,
    getPulledoutCheckUseCase,
    docsRecallCheckUseCase,
    getAllRecalledChecksUseCase,
    getRecalledByTransactionUseCase,
    getRecalledCheckUseCase,
    recallReceiptCheckUseCase,
    getAllCheckRecallReceiptsUseCase,
    getRecallReceiptByTransactionUseCase,
    getRecallReceiptUseCase,
    voidCheckUseCase,
    getAllVoidedChecksUseCase,
    getVoidedCheckUseCase,
    getAllStaledChecksUseCase,

    findCheckUseCase,
    selectAllChecksUseeCase,
    updateReleaseDateUseCase,
    selectByDateUseCase
};