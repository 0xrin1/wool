const RadioOperator = require('./radio-operator/radio-operator');
const winston = require('winston');

winston.add(winston.transports.File, { filename: `logs/${(new Date()).toISOString()}` });

module.exports = class Wool {
    constructor() {
        this.radioOperator = (new RadioOperator())
        .on('listening', Wool.onListening)
        .on('greeting:sent', Wool.onGreetingSent)
        .on('greeting:received', this.onGreetingReceived.bind(this))
        .on('confirmation', this.onConfirmation.bind(this));
        this.ledger = new Map();
    }

    start() {
        this.radioOperator.listen();
        this.radioOperator.greet();
    }

    static onListening(info) {
        winston.info(`listening to port ${info.port}\n`);
    }

    static onGreetingSent(info) {
        winston.info(`greeting broadcast to ${info.address}\n`);
    }

    onGreetingReceived(info, message) {
        winston.info('greeting received', message);
        this.ledger.set(info.address, {
            address: info.address,
        });
        winston.info('ledger', this.ledger, '\n');
    }

    onConfirmation(info, message) {
        winston.info('confirmation received', message);
        this.ledger.set(info.address, {
            address: info.address,
        });
        winston.info('ledger', this.ledger, '\n');
    }
};
