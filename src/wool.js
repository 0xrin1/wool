const Ledger = require('./ledger/ledger');

module.exports = class Wool {
    constructor() {
        this.ledger = new Ledger();
    }

    start() {
        this.ledger.sendBroadcast();
        this.ledger.expectBroadcast();
    }
};
