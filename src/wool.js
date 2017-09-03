const RadioPresenter = require('./radio-presenter/radio-presenter');

module.exports = class Wool {
    constructor() {
        this.radioPresenter = new RadioPresenter();
        this.ledger = [];
    }

    start() {
        this.radioPresenter.expectMessage({
            listeningStarted: (info) => { console.log(`listening to port ${info.port}\n`); },
            onGreeting: this.onGreeting.bind(this),
            onConfirmation: this.onConfirmation.bind(this),
        });
        this.radioPresenter.sendBroadcast();
    }

    onGreeting(info, message) {
        console.log('greeting received', message);
        this.ledger.push({
            address: info.address,
        });
        console.log('ledger', this.ledger);
        console.log('');
    }

    onConfirmation(info, message) {
        console.log('confirmation received', message);
        this.ledger.push({
            address: info.address,
        });
        console.log('ledger', this.ledger);
        console.log('');
    }
};
