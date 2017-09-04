const EventEmitter = require('./event-emitter/event-emitter');
const RadioOperator = require('./radio-operator/radio-operator');
const winston = require('winston');

winston.add(winston.transports.File, { filename: `logs/${(new Date()).toISOString()}` });

module.exports = class Wool extends EventEmitter {
    constructor() {
        super();

        this.module = {
            name: 'wool',
            traits: [],
        };
        this.radioOperator = (new RadioOperator(this.module))
        .on('listening', this.onListening.bind(this))
        .on('greeting:sent', this.onGreetingSent.bind(this))
        .on('greeting:received', this.onGreetingReceived.bind(this))
        .on('confirmation:received', this.onConfirmationReceived.bind(this));
        this.ledger = new Map();
    }

    start() {
        this.radioOperator.listen();
        this.radioOperator.greet();
    }

    onListening(info) {
        winston.info(`Wool: listening to port ${info.port}\n`);
        this.emit('listening', info);
    }

    onGreetingSent(info) {
        winston.info(`greeting sent to ${info.address}\n`);
        this.emit('greeting:sent', info);
    }

    onGreetingReceived(info, message) {
        winston.info('greeting received', message);
        this.ledger.set(info.address, message);
        winston.info('ledger', this.ledger, '\n');
        this.emit('greeting:received', info, message);
    }

    onConfirmationReceived(info, message) {
        winston.info('confirmation received', message);
        this.ledger.set(info.address, message);
        winston.info('ledger', this.ledger, '\n');
        this.emit('confirmation:received', info, message);
    }
};
