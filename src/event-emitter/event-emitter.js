const EE = require('eventemitter3');

module.exports = class EventEmitter {
    constructor() {
        this.eventEmitter = new EE();
    }

    on(eventName, cb) {
        this.eventEmitter.on(eventName, cb, this);
        return this;
    }

    emit(eventName, ...args) {
        this.eventEmitter.emit(eventName, ...args);
        return this;
    }
};
