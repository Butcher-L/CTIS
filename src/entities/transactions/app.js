const makeTransferEntity = require('./transfer-entity');
const makeTransmitEntity = require('./transmit-entity');
const makeReceiveEntity = require('./receive-entity');
const makeReleaseEntity = require('./release-entity');
const makeDocsReturnEntity = require('./docs-return-entity');
const makeDocsPullOutEntity = require('./docs-pull-out');
const makePulloutReceiptEntity = require('./pullout-receipt-entity');
const makeDocsRecallEntity = require('./docs-recall-entity');
const makeRecallReceiptEntity = require('./recall-receipt-entity');
const makeReturnReceiptEntity = require('./return-receipt-entity');

const makeTransfer = makeTransferEntity({});
const makeTransmit = makeTransmitEntity({});
const makeReceive = makeReceiveEntity({});
const makeRelease = makeReleaseEntity({});
const makeDocsReturn = makeDocsReturnEntity({});
const makeDocsPullout = makeDocsPullOutEntity({});
const makePulloutReceipt = makePulloutReceiptEntity({});
const makeDocsRecall = makeDocsRecallEntity({});
const makeRecallReceipt = makeRecallReceiptEntity({});
const makeReturnReceipt = makeReturnReceiptEntity({});


module.exports = {
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
}