const RadioPresenter = require('./radio-presenter/radio-presenter');
const winston = require('winston');

winston.add(winston.transports.File, { filename: `logs/${(new Date()).toISOString()}` });

module.exports = class Wool {
    constructor() {
        this.radioPresenter = new RadioPresenter();
        this.ledger = [];
    }

    start() {
        this.radioPresenter.expectMessage({
            listeningStarted: Wool.onListening,
            onGreeting: this.onGreeting.bind(this),
            onConfirmation: this.onConfirmation.bind(this),
        });
        this.radioPresenter.sendBroadcast();
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
