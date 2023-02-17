const {
    getAutoReleaseUseCase,
    getReceivedTransactionsUseCase,
    denyTransactionUseCase,
    getToReceiveTransactionsUseCase,
    receiveTransferTransactionUseCase,
    receiveTransmittedTransactionUseCase,
    getAllTransferTransactionsUseCase,
    postTransactionUseCase,
    unpostTransactionUseCase,
    getTransferredTransactionUseCase,
    getAllTransmitTransactionsUseCase,
    getTransmitTransactionUseCase,
    getAllReceiveTransactionsUseCase,
    getReceiveTransactionUseCase,
    getAllDocsReturnTransactionsUseCase,
    getDocsReturnTransactionsUseCase,
    receiveDocsReturnTransactionUseCase,
    getAllReturnReceiptsUseCase,
    getReturnReceiptUseCase,
    getAllDocsRecallTransactionsUseCase,
    getDocsRecallTransactionUseCase,
    receiveDocsRecallTransactionUseCase,
    getAllRecallReceiptsUseCase,
    getRecallReceiptUseCase,
    getAllPulloutTransactionsUseCase,
    getPulloutTransactionUseCase,
    receivePulloutTransactionUseCase,
    getAllPulloutReceiptsUseCase,
    getPulloutReceiptUseCase,
    selectAllOrganizationUseCase,
    selectByOrganizationUseCase,
    unpostReceiveTransactionUseCase,
    getAutoReleasewithCompanyUseCase,
    getTransmitReportUseCase,
    getAllTransmitreportUseCase,
    getCheckDocsreturnUseCase,
    getAllCheckDocsreturnUseCase
} = require('../../use-cases/transactions/app');

const getAllCheckDocsreturnControllers = require('./get-check-docs-returns')
const getAutoReleasedControllers = require('./transmit/get-auto-release');
const getTransmitReportControllers = require('./get-transmit-report');
const getAutoReleased = require('./transmit/getAutoRelease');
const getReceivedTransactions = require('./get-received-transaction');
const denyTransaction = require('./transaction-deny');
const getToReceiveTransactions = require('./get-to-receive-transactions');
const postTransaction = require('./transaction-post');
const unpostTransaction = require('./transanction-unpost');
const receiveTransferTransaction = require('./transfer/receive-transfer');
const receiveTransmittedTransaction = require('./transmit/receive-transmit');
const getAllTransferTransactions = require('./transfer/get-all-transferred');
const getTransferTransaction = require('./transfer/transaction-get-transfer');
const getAllTransmitTransaction = require('./transmit/get-all-transmitted');
const getTransmitTransaction = require('./transmit/transaction-get-transmit');
const getAllReceive = require('./receive/get-all-received');
const getReceiveTransaction = require('./receive/transaction-get-receive');
const getAllDocsReturnTransactions = require('./docs-return/get-all-docs-return');
const getDocsReturnTransaction = require('./docs-return/transaction-get-docs-return');
const receiveDocsReturnTransaction = require('./docs-return/receive-docs-return');
const getAllReturnReceipts = require('./docs-return/get-all-return-receipt');
const getReturnReceipt = require('./docs-return/get-return-recipt');
const getAllDocsRecallTransactions = require('./docs-recall/get-all-docs-recall');
const getDocsRecallTransaction = require('./docs-recall/get-docs-recall');
const receiveDocsRecallTransaction = require('./docs-recall/receive-docs-recall');
const getAllRecallReceipts = require('./docs-recall/get-all-recall-receipt');
const getRecallReceipt = require('./docs-recall/get-recall-receipt');
const getAllPulloutTransactions = require('./docs-pullout/get-all-docs-pullout');
const getPulloutTransaction = require('./docs-pullout/get-docs-pullout');
const receivePulloutTransaction = require('./docs-pullout/receive-docs-pullout');
const getAllPulloutReceipts = require('./docs-pullout/get-all-pullout-receipt');
const getPulloutReceipt = require('./docs-pullout/get-pullout-receipt');
const selectAllOrganization = require("./select_all_organization")
const selectByOrganization = require("./select-by-organization")
const unpostReceiveTransaction = require("./transaction-unpost-recieve")
const getAllTransmitReportsControllers = require("./get-transmit-reports")
const getCheckDocsreturnControllers = require("./get-check-docs-return")



const getAllTransmitReportsController = getAllTransmitReportsControllers({ getAllTransmitreportUseCase })
const getAutoReleasedController = getAutoReleasedControllers({ getAutoReleasewithCompanyUseCase });
const getAutoReleaseController = getAutoReleased({ getAutoReleaseUseCase });
const denyTransactionController = denyTransaction({ denyTransactionUseCase });
const getReceivedTransactionsController = getReceivedTransactions({ getReceivedTransactionsUseCase });
const receiveTransmittedTransactionController = receiveTransmittedTransaction({ receiveTransmittedTransactionUseCase })
const getToReceiveTransactionsController = getToReceiveTransactions({ getToReceiveTransactionsUseCase });
const getAllTransferTransactionsController = getAllTransferTransactions({ getAllTransferTransactionsUseCase });
const postTransactionController = postTransaction({ postTransactionUseCase });
const unpostTransactionController = unpostTransaction({ unpostTransactionUseCase });
const getTransferTransactionController = getTransferTransaction({ getTransferredTransactionUseCase });
const receiveTransferTransactionController = receiveTransferTransaction({ receiveTransferTransactionUseCase });
const getAllTransmitTransactionController = getAllTransmitTransaction({ getAllTransmitTransactionsUseCase });
const getTransmitTransactionController = getTransmitTransaction({ getTransmitTransactionUseCase });
const getAllReceiveTransactionController = getAllReceive({ getAllReceiveTransactionsUseCase });
const getReceiveTransactionController = getReceiveTransaction({ getReceiveTransactionUseCase });
const getAllDocsReturnTransactionsController = getAllDocsReturnTransactions({ getAllDocsReturnTransactionsUseCase });
const getDocsReturnTransactionController = getDocsReturnTransaction({ getDocsReturnTransactionsUseCase });
const receiveDocsReturnTransactionController = receiveDocsReturnTransaction({ receiveDocsReturnTransactionUseCase });
const getAllReturnReceiptsController = getAllReturnReceipts({ getAllReturnReceiptsUseCase });
const getReturnReceiptController = getReturnReceipt({ getReturnReceiptUseCase });
const getAllDocsRecallTransactionsController = getAllDocsRecallTransactions({ getAllDocsRecallTransactionsUseCase });
const getDocsRecallTransactionController = getDocsRecallTransaction({ getDocsRecallTransactionUseCase });
const receiveDocsRecallTransactionController = receiveDocsRecallTransaction({ receiveDocsRecallTransactionUseCase });
const getAllRecallReceiptsController = getAllRecallReceipts({ getAllRecallReceiptsUseCase });
const getRecallReceiptController = getRecallReceipt({ getRecallReceiptUseCase });
const getAllPulloutTransactionsController = getAllPulloutTransactions({ getAllPulloutTransactionsUseCase });
const getPulloutTransactionController = getPulloutTransaction({ getPulloutTransactionUseCase });
const receivePulloutTransactionController = receivePulloutTransaction({ receivePulloutTransactionUseCase });
const getAllPulloutReceiptsController = getAllPulloutReceipts({ getAllPulloutReceiptsUseCase });
const getPulloutReceiptController = getPulloutReceipt({ getPulloutReceiptUseCase });
const selectAllOrganizationController = selectAllOrganization({ selectAllOrganizationUseCase })
const selectByOrganizationController = selectByOrganization({ selectByOrganizationUseCase })
const unpostReceiveTransactionController = unpostReceiveTransaction({ unpostReceiveTransactionUseCase })
const getTransmitReportController = getTransmitReportControllers({ getTransmitReportUseCase })
const getCheckDocsreturnController = getCheckDocsreturnControllers({ getCheckDocsreturnUseCase })
const getAllCheckDocsreturnController = getAllCheckDocsreturnControllers({ getAllCheckDocsreturnUseCase })

const transactionsController = {
    getAutoReleaseController,
    getTransmitReportController,
    getReceivedTransactionsController,
    denyTransactionController,
    getToReceiveTransactionsController,
    getAllTransferTransactionsController,
    postTransactionController,
    unpostTransactionController,
    getTransferTransactionController,
    receiveTransferTransactionController,
    receiveTransmittedTransactionController,
    getAllTransmitTransactionController,
    getTransmitTransactionController,
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
    getAllTransmitReportsController,
    getCheckDocsreturnController,
    getAllCheckDocsreturnController
};

module.exports = transactionsController;
module.exports = {
    getAutoReleaseController,
    getTransmitReportController,
    getReceivedTransactionsController,
    denyTransactionController,
    getToReceiveTransactionsController,
    getAllTransferTransactionsController,
    postTransactionController,
    unpostTransactionController,
    getTransferTransactionController,
    receiveTransferTransactionController,
    receiveTransmittedTransactionController,
    getAllTransmitTransactionController,
    getTransmitTransactionController,
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
    getAllTransmitReportsController,
    getCheckDocsreturnController,
    getAllCheckDocsreturnController
}

