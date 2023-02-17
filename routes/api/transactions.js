const express = require('express');
const router = express.Router();
const makeExpressCallback = require('../../src/express-callback/app');
const { verifytoken } = require('../../middlewares/middleware');

const {
    getAutoReleaseController,
    denyTransactionController,
    getReceivedTransactionsController,
    getToReceiveTransactionsController,
    getAllTransferTransactionsController,
    postTransactionController,
    unpostTransactionController,
    getTransferTransactionController,
    receiveTransferTransactionController,
    receiveTransmittedTransactionController,
    getTransmitTransactionController,
    getAllTransmitTransactionController,
    getAllReceiveTransactionController,
    getReceiveTransactionController,
    getAllDocsReturnTransactionsController,
    getDocsReturnTransactionController,
    receiveDocsReturnTransactionController,
    getAllReturnReceiptsController,
    getReturnReceiptController,
    getAllDocsRecallTransactionsController,
    getDocsRecallTransactionController,
    receiveDocsRecallTransactionController,
    getAllRecallReceiptsController,
    getRecallReceiptController,
    getAllPulloutTransactionsController,
    getPulloutTransactionController,
    receivePulloutTransactionController,
    getAllPulloutReceiptsController,
    getPulloutReceiptController,
    selectAllOrganizationController,
    selectByOrganizationController,
    unpostReceiveTransactionController,
    getAutoReleasedController,
    getTransmitReportController,
    getAllTransmitReportsController,
    getCheckDocsreturnController,
    getAllCheckDocsreturnController
} = require('../../src/controllers/transactions/app');


router.get('/checks-return-docs', verifytoken, makeExpressCallback(getAllCheckDocsreturnController))
router.get('/checks-return-docs/:id', verifytoken, makeExpressCallback(getCheckDocsreturnController))
//check get return docs
router.get('/transmit-report', verifytoken, makeExpressCallback(getAllTransmitReportsController))
router.get('/transmit-report/:id', verifytoken, makeExpressCallback(getTransmitReportController))
//release/{id}/?company={}
router.get('/auto-released/:id', verifytoken, makeExpressCallback(getAutoReleasedController));

router.get('/auto-released', verifytoken, makeExpressCallback(getAutoReleaseController));

router.get('/transferred', verifytoken, makeExpressCallback(getAllTransferTransactionsController));
router.get('/transferred/:id', verifytoken, makeExpressCallback(getTransferTransactionController));
router.put('/transferred/receive-transaction/:id', verifytoken, makeExpressCallback(receiveTransferTransactionController));

router.get('/transmit', verifytoken, makeExpressCallback(getAllTransmitTransactionController));
router.get('/transmit/:id', verifytoken, makeExpressCallback(getTransmitTransactionController));
router.put('/transmitted/receive-transaction/:id', verifytoken, makeExpressCallback(receiveTransmittedTransactionController));

router.get('/receive', verifytoken, makeExpressCallback(getAllReceiveTransactionController));
router.get('/receive/:id', verifytoken, makeExpressCallback(getReceiveTransactionController));

router.get('/check-docs-return', verifytoken, makeExpressCallback(getAllDocsReturnTransactionsController));
router.get('/check-docs-return/:id', verifytoken, makeExpressCallback(getDocsReturnTransactionController));
router.put('/check-docs-return/receive-transaction/:id', verifytoken, makeExpressCallback(receiveDocsReturnTransactionController));

router.get('/check-return-receipt/', verifytoken, makeExpressCallback(getAllReturnReceiptsController));
router.get('/check-return-receipt/:id/:company', verifytoken, makeExpressCallback(getReturnReceiptController));

router.get('/check-docs-recall', verifytoken, makeExpressCallback(getAllDocsRecallTransactionsController));
router.get('/check-docs-recall/:id', verifytoken, makeExpressCallback(getDocsRecallTransactionController));
router.put('/check-docs-recall/receive-transaction/:id', verifytoken, makeExpressCallback(receiveDocsRecallTransactionController));

router.get('/check-recall-receipt/', verifytoken, makeExpressCallback(getAllRecallReceiptsController));
router.get('/check-recall-receipt/:id', verifytoken, makeExpressCallback(getRecallReceiptController));

router.get('/check-docs-pullout', verifytoken, makeExpressCallback(getAllPulloutTransactionsController));
router.get('/check-docs-pullout/:id', verifytoken, makeExpressCallback(getPulloutTransactionController));
router.put('/check-docs-pullout/receive-transaction/:id', verifytoken, makeExpressCallback(receivePulloutTransactionController));

router.get('/check-pullout-receipt/', verifytoken, makeExpressCallback(getAllPulloutReceiptsController));
router.get('/check-pullout-receipt/:id', verifytoken, makeExpressCallback(getPulloutReceiptController));

router.put('/deny', verifytoken, makeExpressCallback(denyTransactionController));
router.put('/get-received', verifytoken, makeExpressCallback(getReceivedTransactionsController));
router.put('/get-to-receive', verifytoken, makeExpressCallback(getToReceiveTransactionsController));
router.put('/post', verifytoken, makeExpressCallback(postTransactionController));
router.put('/unpost', verifytoken, makeExpressCallback(unpostTransactionController));

router.get('/selectOrganization', makeExpressCallback(selectAllOrganizationController))
router.post('/selectByOrganization', makeExpressCallback(selectByOrganizationController))
router.put('/unpost-receive', makeExpressCallback(unpostReceiveTransactionController))




module.exports = router;