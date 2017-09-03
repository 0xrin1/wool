const RadioOperator = require('./radio-operator/radio-operator');
const winston = require('winston');

winston.add(winston.transports.File, { filename: `logs/${(new Date()).toISOString()}` });

module.exports = class Wool {
    constructor() {
        this.radioOperator = (new RadioOperator())
        .on('listening', Wool.onListening)
        .on('greeting', this.onGreeting.bind(this))
        .on('confirmation', this.onConfirmation.bind(this));
        this.ledger = [];
    }

    start() {
        this.radioOperator.expectMessage();
        this.radioOperator.sendGreeting();
    }

    static onListening(info) {
        winston.info(`listening to port ${info.port}\n`);
    }

    onGreeting(info, message) {
        winston.info('greeting received', message);
        this.ledger.push({
            address: info.address,
        });
        winston.info('ledger', this.ledger, '\n');
    }

    onConfirmation(info, message) {
        winston.info('confirmation received', message);
        this.ledger.push({
            address: info.address,
        });
        winston.info('ledger', this.ledger, '\n');
    }
};
