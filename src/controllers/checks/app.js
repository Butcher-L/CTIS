const {
    addCheckUseCase,
    getAcctsPayableChecksUseCase,
    transferCheckUseCase,
    getAllTransferredUseCase,
    getByTransactionUseCase,
    getTransferredCheckUseCase,
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
    getCheckReturnReceiptUseCase,
    getCheckReturnReceiptsByTransactionUseCase,
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
    recallReceiptCheckUseCase,
    getAllCheckRecallReceiptsUseCase,
    getRecallReceiptByTransactionUseCase,
    getRecallReceiptUseCase,
    getAllRecalledChecksUseCase,
    getRecalledByTransactionUseCase,
    getRecalledCheckUseCase,
    voidCheckUseCase,
    getAllVoidedChecksUseCase,
    getVoidedCheckUseCase,
    getAllStaledChecksUseCase,

    findCheckUseCase,
    selectAllChecksUseeCase,
    updateReleaseDateUseCase,
    selectByDateUseCase
} = require('../../use-cases/checks/app');

const makeCheck = require('./check-add');
const getAcctsPayableChecks = require('./check-get-accts-payable');
const transferChecks = require('./transfer/check-transfer');
const getAllTransferred = require('./transfer/get-all-transferred');
const getByTransaction = require('./transfer/get-by-transaction');
const getTransferred = require('./transfer/get-transferred-check');
const transmitChecks = require('./transmit/check-transmit');
const getAllTransmitted = require('./transmit/get-all-transmitted');
const getTransmittedByTransaction = require('./transmit/get-by-transaction');
const getTransmittedCheck = require('./transmit/get-transmitted-check');
const receiveChecks = require('./receive/check-receive');
const getAllReceived = require('./receive/get-all-received');
const getReceivedByTransaction = require('./receive/get-by-transaction');
const getReceivedCheck = require('./receive/get-received-check');
const releaseChecks = require('./check-release/check-release');
const getAllReleased = require('./check-release/get-all-released');
const getReleased = require('./check-release/get-released-check');
const returnCheckDocs = require('./check-docs-return/check-docs-return');
const getAllReturned = require('./check-docs-return/get-all-returned');
const getReturnedByTransaction = require('./check-docs-return/get-returned-by-transaction');
const getReturnedCheck = require('./check-docs-return/get-returned-check');
const returnCheckReceipt = require('./check-docs-return/check-return-receipt');
const getAllCheckReturnReceipt = require('./check-docs-return/return-receipt-get-all')
const getCheckReturnReceipt = require('./check-docs-return/return-receipt-check-details')
const getCheckReturnReceiptsByTransaction = require('./check-docs-return/return-receipt-get-by-transaction')
const pulloutCheckDocs = require('./check-docs-pullout/check-docs-pullout');
const getAllPulledoutChecks = require('./check-docs-pullout/get-all-pulledout');
const getPulledoutByTransaction = require('./check-docs-pullout/get-pulledout-by-transaction');
const getPulledoutCheck = require('./check-docs-pullout/get-pulledout-check');
const pulloutCheckReceipt = require('./check-docs-pullout/check-pullout-receipt');
const getAllCheckPulloutReceipts = require('./check-docs-pullout/get-all-pullout-receipt');
const getPulloutReceiptByTransaction = require('./check-docs-pullout/get-pullout-receipt-by-transaction');
const getPulloutReceipt = require('./check-docs-pullout/get-pullout-receipt');
const recallCheckDocs = require('./check-docs-recall/check-docs-recall');
const getAllRecalledChecks = require('./check-docs-recall/get-all-recalled');
const getRecalledByTransaction = require('./check-docs-recall/get-recalled-by-transaction');
const getRecalledCheck = require('./check-docs-recall/get-recalled-check');
const recallCheckReceipt = require('./check-docs-recall/check-recall-receipt');
const getAllCheckRecallReceipts = require('./check-docs-recall/get-all-recall-receipt');
const getRecallReceiptByTransaction = require('./check-docs-recall/get-recall-receipt-by-transaction');
const getRecallReceipt = require('./check-docs-recall/get-recall-receipt');
const voidCheck = require('./void/check-void');
const getAllVoidedChecks = require('./void/get-all-voided');
const getVoidedCheck = require('./void/get-voided-check');
const getAllStaledChecks = require('./staled/get-all-staled');

const findCheck = require("./find-check")
const SelectAllChecks = require("./select_all_checks")
const updateReleaseDate = require("./update-release-date")
const selectByDate = require("./selectByDate-report")

const makeCheckController = makeCheck({ addCheckUseCase });
const getAcctsPayableChecksController = getAcctsPayableChecks({ getAcctsPayableChecksUseCase });
const transferChecksController = transferChecks({ transferCheckUseCase });
const getAllTransferredController = getAllTransferred({ getAllTransferredUseCase });
const getByTransactionController = getByTransaction({ getByTransactionUseCase });
const getTransferredCheckController = getTransferred({ getTransferredCheckUseCase });
const transmitChecksController = transmitChecks({ transmitCheckUseCase });
const getAllTransmittedController = getAllTransmitted({ getAllTransmittedUseCase });
const getTransmittedByTransactionController = getTransmittedByTransaction({ getTransmittedByTransactionUseCase });
const getTransmittedCheckController = getTransmittedCheck({ getTransmittedCheckUseCase });
const receiveChecksController = receiveChecks({ receiveCheckUseCase });
const getAllReceivedController = getAllReceived({ getAllReceivedUseCase });
const getReceivedByTransactionController = getReceivedByTransaction({ getReceivedByTransactionUseCase });
const getReceivedCheckController = getReceivedCheck({ getReceivedCheckUseCase });
const releaseChecksController = releaseChecks({ releaseCheckUseCase });
const getAllReleasedController = getAllReleased({ getAllReleasedUseCase });
const getReleasedController = getReleased({ getReleasedUseCase });
const returnCheckDocsController = returnCheckDocs({ docsReturnCheckUseCase });
const getAllReturnedController = getAllReturned({ getAllReturnedUseCase });
const getReturnedByTransactionController = getReturnedByTransaction({ getReturnedByTransactionUseCase });
const getReturnedCheckController = getReturnedCheck({ getReturnedCheckUseCase });
const returnCheckReceiptController = returnCheckReceipt({ returnReceiptCheckUseCase });
const getAllCheckReturnReceiptController = getAllCheckReturnReceipt({ getAllCheckReturnReceiptUseCase });
const getCheckReturnReceiptController = getCheckReturnReceipt({ getCheckReturnReceiptUseCase });
const getCheckReturnReceiptsByTransactionController = getCheckReturnReceiptsByTransaction({ getCheckReturnReceiptsByTransactionUseCase });
const pulloutCheckDocsController = pulloutCheckDocs({ docsPulloutCheckUseCase });
const getAllPulledoutChecksController = getAllPulledoutChecks({ getAllPulledoutChecksUseCase });
const getPulledoutByTransactionController = getPulledoutByTransaction({ getPulledoutByTransactionUseCase });
const getPulledoutCheckController = getPulledoutCheck({ getPulledoutCheckUseCase });
const pulloutCheckReceiptController = pulloutCheckReceipt({ pulloutReceiptUseCase });
const getAllCheckPulloutReceiptsController = getAllCheckPulloutReceipts({ getAllCheckPulloutReceiptsUseCase })
const getPulloutReceiptByTransactionController = getPulloutReceiptByTransaction({ getPulloutReceiptByTransactionUseCase })
const getPulloutReceiptController = getPulloutReceipt({ getPulloutReceiptUseCase })
const recallCheckDocsController = recallCheckDocs({ docsRecallCheckUseCase })
const getAllRecalledChecksController = getAllRecalledChecks({ getAllRecalledChecksUseCase })
const getRecalledByTransactionController = getRecalledByTransaction({ getRecalledByTransactionUseCase })
const getRecalledCheckController = getRecalledCheck({ getRecalledCheckUseCase })
const recallCheckReceiptController = recallCheckReceipt({ recallReceiptCheckUseCase });
const getAllCheckRecallReceiptsController = getAllCheckRecallReceipts({ getAllCheckRecallReceiptsUseCase });
const getRecallReceiptByTransactionController = getRecallReceiptByTransaction({ getRecallReceiptByTransactionUseCase });
const getRecallReceiptController = getRecallReceipt({ getRecallReceiptUseCase });
const voidCheckController = voidCheck({ voidCheckUseCase });
const getAllVoidedChecksController = getAllVoidedChecks({ getAllVoidedChecksUseCase });
const getVoidedCheckController = getVoidedCheck({ getVoidedCheckUseCase });
const getAllStaledChecksController = getAllStaledChecks({ getAllStaledChecksUseCase });

const findCheckController = findCheck({ findCheckUseCase })
const SelectAllChecksController = SelectAllChecks({ selectAllChecksUseeCase })
const updateReleaseDateController = updateReleaseDate({ updateReleaseDateUseCase })
const selectByDateController = selectByDate({ selectByDateUseCase })

const checkController = Object.freeze({
    makeCheckController,
    getAcctsPayableChecksController,
    transferChecksController,
    getAllTransferredController,
    getByTransactionController,
    getTransferredCheckController,
    transmitChecksController,
    getAllTransmittedController,
    getTransmittedByTransactionController,
    getTransmittedCheckController,
    receiveChecksController,
    getAllReceivedController,
    getReceivedByTransactionController,
    getReceivedCheckController,
    releaseChecksController,
    getAllReleasedController,
    getReleasedController,
    returnCheckDocsController,
    getAllReturnedController,
    getReturnedByTransactionController,
    getReturnedCheckController,
    returnCheckReceiptController,
    getAllCheckReturnReceiptController,
    getCheckReturnReceiptController,
    getCheckReturnReceiptsByTransactionController,
    pulloutCheckDocsController,
    getAllPulledoutChecksController,
    getPulledoutByTransactionController,
    getPulledoutCheckController,
    pulloutCheckReceiptController,
    getAllCheckPulloutReceipts,
    getAllCheckPulloutReceiptsController,
    getPulloutReceiptByTransactionController,
    getPulloutReceiptController,
    recallCheckDocsController,
    getAllRecalledChecksController,
    getRecalledByTransactionController,
    getRecalledCheckController,
    recallCheckReceiptController,
    getAllCheckRecallReceiptsController,
    getRecallReceiptByTransactionController,
    getRecallReceiptController,
    voidCheckController,
    getAllVoidedChecksController,
    getVoidedCheckController,
    getAllStaledChecksController,

    findCheckController,
    SelectAllChecksController,
    updateReleaseDateController,
    selectByDateController
});

module.exports = checkController;
module.exports = {
    makeCheckController,
    getAcctsPayableChecksController,
    transferChecksController,
    getAllTransferredController,
    getByTransactionController,
    getTransferredCheckController,
    transmitChecksController,
    getAllTransmittedController,
    getTransmittedByTransactionController,
    getTransmittedCheckController,
    receiveChecksController,
    getAllReceivedController,
    getReceivedByTransactionController,
    getReceivedCheckController,
    releaseChecksController,
    getAllReleasedController,
    getReleasedController,
    returnCheckDocsController,
    getAllReturnedController,
    getReturnedByTransactionController,
    getReturnedCheckController,
    returnCheckReceiptController,
    getAllCheckReturnReceiptController,
    getCheckReturnReceiptController,
    getCheckReturnReceiptsByTransactionController,
    pulloutCheckDocsController,
    getAllPulledoutChecksController,
    getPulledoutByTransactionController,
    getPulledoutCheckController,
    pulloutCheckReceiptController,
    getAllCheckPulloutReceiptsController,
    getPulloutReceiptByTransactionController,
    getPulloutReceiptController,
    recallCheckDocsController,
    getAllRecalledChecksController,
    getRecalledByTransactionController,
    getRecalledCheckController,
    recallCheckReceiptController,
    getAllCheckRecallReceiptsController,
    getRecallReceiptByTransactionController,
    getRecallReceiptController,
    voidCheckController,
    getAllVoidedChecksController,
    getVoidedCheckController,
    getAllStaledChecksController,

    findCheckController,
    SelectAllChecksController,
    updateReleaseDateController,
    selectByDateController
};