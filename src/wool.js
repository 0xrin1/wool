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
        .on('confirmation:received', this.onConfirmationReceived.bind(this))
        .on('message:received', this.onMessageReceived.bind(this))
        .on('echo:sent', this.onEchoSent.bind(this))
        .on('echo:received', this.onEchoReceived.bind(this))
        .on('echo:lost', this.onEchoLost.bind(this));
        this.ledger = new Map();
    }

    start() {
        this.radioOperator.listen();
        this.radioOperator.greet();
    }

    message(target, data, callback = () => {}, options = {}) {
        winston.info(`Wool: sending message to ${target.address}:${this.radioOperator.port}`);
        this.radioOperator.message(target, data, callback, options);
    }

    onListening(info) {
        winston.info(`Wool: listening to port ${info.port}\n`);
        this.emit('listening', info);
    }

    onMessageReceived(info, message) {
        winston.info(`Wool: message received from ${info.address}:${info.port}: ${message}`);
        this.emit('message:received', info, message);
    }

    onEchoReceived(info, message) {
        winston.info(`Wool: echo received from ${info.address}:${info.port}: ${message}`);
        this.emit('echo:received', info, message);
    }

    onEchoLost(info, message) {
        winston.info(`Wool: echo lost from ${info.address}:${info.port}: ${message}`);
        delete this.ledger[info.address];
        this.emit('echo:lost', info, message);
    }

    onEchoSent(info, message) {
        winston.info(`Wool: echo sent to ${info.address}:${info.port}: ${message}`);
        this.emit('echo:sent', info, message);
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
