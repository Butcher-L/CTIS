const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');


const {
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
} = require('../../src/controllers/checks/app');
const { findCheckUseCase } = require('../../src/use-cases/checks/app');

router.post('/add', verifytoken, makeExpressCallback(makeCheckController));

router.get('/get/accounts-payable', verifytoken, makeExpressCallback(getAcctsPayableChecksController));

router.post('/transfer', verifytoken, makeExpressCallback(transferChecksController));
router.get('/transferred', verifytoken, makeExpressCallback(getAllTransferredController));
router.get('/transferred/:id', verifytoken, makeExpressCallback(getTransferredCheckController));
router.get('/transferred/transaction/:id', verifytoken, makeExpressCallback(getByTransactionController));

router.post('/transmit', verifytoken, makeExpressCallback(transmitChecksController));
router.get('/transmitted', verifytoken, makeExpressCallback(getAllTransmittedController));
router.get('/transmitted/:id', verifytoken, makeExpressCallback(getTransmittedCheckController));
router.get('/transmitted/transaction/:id', verifytoken, makeExpressCallback(getTransmittedByTransactionController));

router.post('/receive', verifytoken, makeExpressCallback(receiveChecksController));
router.get('/received', makeExpressCallback(getAllReceivedController));
router.get('/received/:id', verifytoken, makeExpressCallback(getReceivedCheckController));
router.get('/received/transaction/:id', verifytoken, makeExpressCallback(getReceivedByTransactionController));

router.put('/release', verifytoken, makeExpressCallback(releaseChecksController));
router.get('/released', makeExpressCallback(getAllReleasedController));
router.get('/release/:id', verifytoken, makeExpressCallback(getReleasedController));

router.post('/return-check-docs', verifytoken,makeExpressCallback(returnCheckDocsController));
router.get('/return', verifytoken, makeExpressCallback(getAllReturnedController));
router.get('/return/:id', verifytoken, makeExpressCallback(getReturnedCheckController));
router.get('/return/transaction/:id', verifytoken, makeExpressCallback(getReturnedByTransactionController));
router.post('/return-receipt', verifytoken, makeExpressCallback(returnCheckReceiptController));
router.get('/return-receipt', verifytoken, makeExpressCallback(getAllCheckReturnReceiptController));
router.get('/return-receipt/transaction/:id', verifytoken, makeExpressCallback(getCheckReturnReceiptsByTransactionController));
router.get('/return-receipt/:id', verifytoken, makeExpressCallback(getCheckReturnReceiptController));

router.post('/pullout-check-docs', verifytoken, makeExpressCallback(pulloutCheckDocsController));
router.get('/pullout-check-docs', verifytoken, makeExpressCallback(getAllPulledoutChecksController));
router.get('/pullout-check-docs/transaction/:id', verifytoken, makeExpressCallback(getPulledoutByTransactionController));
router.get('/pullout-check-docs/:id', verifytoken, makeExpressCallback(getPulledoutCheckController));
router.post('/pullout-receipt', verifytoken, makeExpressCallback(pulloutCheckReceiptController));
router.get('/pullout-receipt', verifytoken, makeExpressCallback(getAllCheckPulloutReceiptsController));
router.get('/pullout-receipt/transaction/:id', verifytoken, makeExpressCallback(getPulloutReceiptByTransactionController));
router.get('/pullout-receipt/:id', verifytoken, makeExpressCallback(getPulloutReceiptController));

router.post('/recall-check-docs', verifytoken, makeExpressCallback(recallCheckDocsController));
router.get('/recall', verifytoken, makeExpressCallback(getAllRecalledChecksController))
router.get('/recall/transaction/:id', verifytoken, makeExpressCallback(getRecalledByTransactionController));
router.get('/recall/:id', verifytoken, makeExpressCallback(getRecalledCheckController))
router.post('/recall-receipt', verifytoken, makeExpressCallback(recallCheckReceiptController));
router.get('/recall-receipt', verifytoken, makeExpressCallback(getAllCheckRecallReceiptsController));
router.get('/recall-receipt/transaction/:id', makeExpressCallback(getRecallReceiptByTransactionController));
router.get('/recall-receipt/:id', verifytoken, makeExpressCallback(getRecallReceiptController));

router.put('/void', verifytoken, makeExpressCallback(voidCheckController));
router.get('/void/', verifytoken, makeExpressCallback(getAllVoidedChecksController));
router.get('/void/:id', verifytoken, makeExpressCallback(getVoidedCheckController));

router.get('/staled', verifytoken, makeExpressCallback(getAllStaledChecksController));
router.post("/find", makeExpressCallback(findCheckController))
router.post("/allChecks", makeExpressCallback(SelectAllChecksController))
router.put("/update-release-date", makeExpressCallback(updateReleaseDateController))
router.post("/selectByDate", makeExpressCallback(selectByDateController))

module.exports = router;