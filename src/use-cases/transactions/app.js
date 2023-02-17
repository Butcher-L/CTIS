const transactionsDb = require('../../data-access/transaction/app');
const checksDb = require('../../data-access/checks/app')
const moment = require("moment")

const { transactions } = require("../../sl-access/transaction/transaction")
const { checks } = require("../../sl-access/checks/checks")
const { cma } = require("../../hdb-query/hdb")

const getCheckDocsreturnUseCases = require("./get-check-docs-return")
const getAllCheckDocsreturnUseCases = require("./get-check-docs-returns")
const getAutoReleased = require("../transactions/get-autoreleased")
const getAutoReleases = require("./get-auto-released");
const denyTransaction = require('./transaction-deny');
const getTransmitReportUseCases = require("./get-transmit-report");
const getToReceiveTransactions = require('./get-to-receive-transactions');
const getReceivedTransactions = require('./get-received-transaction');
const receiveTransferTransaction = require('./transfer/receive-transfer');
const receiveTransmittedTransaction = require('./transmit/receive-transmit');
const postTransaction = require('./transaction-post');
const unpostTransaction = require('./transaction-unpost');
const getAllTransferTransactions = require('./transfer/get-all-transferred');
const getTransferredTransaction = require('./transfer/transaction-get-transfer');
const getAllTransmitTransactions = require('./transmit/get-all-transmitted');
const getTransmitTransaction = require('./transmit/transaction-get-transmit');
const getAllReceive = require('./receive/get-all-received');
const getReceiveTransaction = require('./receive/transaction-get-receive');
const getAllDocsReturnTransactions = require('./docs-return/get-all-docs-return');
const getDocsReturnTransaction = require('./docs-return/transaction-get-docs-return');
const receiveDocsReturnTransaction = require('./docs-return/receive-docs-return');
const getAllReturnReceipts = require('./docs-return/get-all-return-receipt');
const getReturnReceipt = require('./docs-return/get-return-reciept');
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
const getAllTransmitreportUseCases = require("./get-transmit-reports");

const getAllTransmitreportUseCase = getAllTransmitreportUseCases({ transactions, moment });
const getAutoReleasewithCompanyUseCase = getAutoReleased({ transactionsDb, transactions, checks, moment });
const getAutoReleaseUseCase = getAutoReleases({ transactionsDb, transactions, checks, moment });
const denyTransactionUseCase = denyTransaction({ transactions });
const getToReceiveTransactionsUseCase = getToReceiveTransactions({ transactionsDb, transactions });
const getReceivedTransactionsUseCase = getReceivedTransactions({ transactionsDb, transactions });
const receiveTransferTransactionUseCase = receiveTransferTransaction({ transactionsDb, checksDb, checks, transactions });
const receiveTransmittedTransactionUseCase = receiveTransmittedTransaction({ transactionsDb, checksDb, checks, transactions });
const postTransactionUseCase = postTransaction({ transactionsDb });
const unpostTransactionUseCase = unpostTransaction({ transactionsDb, checksDb, transactions, checks });
const getAllTransferTransactionsUseCase = getAllTransferTransactions({ transactionsDb, transactions });
const getTransferredTransactionUseCase = getTransferredTransaction({ transactionsDb, checksDb, transactions, checks });
const getAllTransmitTransactionsUseCase = getAllTransmitTransactions({ transactionsDb, checksDb, transactions });
const getTransmitTransactionUseCase = getTransmitTransaction({ transactionsDb, checksDb, transactions, checks });
const getAllReceiveTransactionsUseCase = getAllReceive({ transactionsDb, transactions });
const getReceiveTransactionUseCase = getReceiveTransaction({ transactionsDb, checksDb, transactions, checks });
const getAllDocsReturnTransactionsUseCase = getAllDocsReturnTransactions({ transactionsDb, transactions });
const getDocsReturnTransactionsUseCase = getDocsReturnTransaction({ transactionsDb, checksDb, transactions, checks });
const receiveDocsReturnTransactionUseCase = receiveDocsReturnTransaction({ transactionsDb, checksDb, transactions, checks });
const getAllReturnReceiptsUseCase = getAllReturnReceipts({ transactionsDb, transactions });
const getReturnReceiptUseCase = getReturnReceipt({ transactionsDb, checksDb, transactions, checks });
const getAllDocsRecallTransactionsUseCase = getAllDocsRecallTransactions({ transactionsDb, transactions });
const getDocsRecallTransactionUseCase = getDocsRecallTransaction({ transactionsDb, checksDb, transactions, checks });
const receiveDocsRecallTransactionUseCase = receiveDocsRecallTransaction({ transactionsDb, checksDb });
const getAllRecallReceiptsUseCase = getAllRecallReceipts({ transactionsDb, transactions });
const getRecallReceiptUseCase = getRecallReceipt({ transactionsDb, checksDb, transactions, checks });
const getAllPulloutTransactionsUseCase = getAllPulloutTransactions({ transactionsDb, transactions });
const getPulloutTransactionUseCase = getPulloutTransaction({ transactionsDb, checksDb, transactions, checks });
const receivePulloutTransactionUseCase = receivePulloutTransaction({ transactionsDb });
const getAllPulloutReceiptsUseCase = getAllPulloutReceipts({ transactionsDb, transactions });
const getPulloutReceiptUseCase = getPulloutReceipt({ transactionsDb, checksDb, transactions, checks });
const selectAllOrganizationUseCase = selectAllOrganization({ cma })
const selectByOrganizationUseCase = selectByOrganization({ cma })
const unpostReceiveTransactionUseCase = unpostReceiveTransaction({ transactions })
const getTransmitReportUseCase = getTransmitReportUseCases({ transactions, checks })
const getCheckDocsreturnUseCase = getCheckDocsreturnUseCases({ transactionsDb, transactions, checks, moment });
const getAllCheckDocsreturnUseCase = getAllCheckDocsreturnUseCases({ transactionsDb, transactions, checks, moment });

getAllCheckDocsreturnUseCases

const transactionsService = Object.freeze({
    getAutoReleaseUseCase,
    getAllTransmitreportUseCase,
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
    getCheckDocsreturnUseCase,
    getAllCheckDocsreturnUseCase

});

module.exports = transactionsService;
module.exports = {
    getAutoReleaseUseCase,
    denyTransactionUseCase,
    getReceivedTransactionsUseCase,
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
    getTransmitReportUseCase,
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
    getAllTransmitreportUseCase,
    getCheckDocsreturnUseCase,
    getAllCheckDocsreturnUseCase
};