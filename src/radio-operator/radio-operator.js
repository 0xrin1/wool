const os = require('os');
const dgram = require('dgram');
const EventEmitter = require('../event-emitter/event-emitter');
const udpMessage = require('../lib/udp-message');
const clone = require('../lib/clone');
const assign = require('../lib/assign');

module.exports = class RadioOperator extends EventEmitter {
    constructor(module) {
        super();

        this.port = 6024;
        this.addr = '192.168.1.255';
        this.server = dgram.createSocket('udp4');
        this.client = dgram.createSocket('udp4');
        this.greeting = JSON.stringify({
            type: 'greeting',
            name: os.hostname(),
            body: {
                module,
            },
        });
        this.confirmation = JSON.stringify({
            type: 'confirmation',
            name: os.hostname(),
            body: {
                module,
            },
        });
        this.msg = {
            type: 'message',
            name: os.hostname(),
            body: null,
        };
    }

    listen() {
        this.server.on('listening', () => {
            const info = this.server.address();
            this.emit('listening', info);
        });

        this.server.on('message', (messageBuffer, info) => {
            const message = JSON.parse(messageBuffer.toString());

            if (message.type === 'greeting') {
                this.emit('greeting:received', info, message);
                this.confirm(info);
            }

            if (message.type === 'confirmation') {
                this.emit('confirmation:received', info, message);
            }
        });

        this.server.bind(this.port);
    }

    message(target, data, callback, options = {}) {
        const {
            port = this.port,
            address,
        } = target;
        const {
            broadcast = false,
        } = options;
        const message = JSON.stringify(assign(clone(this.msg), 'body', data));

        if (!address) {
            throw Error('Wool: No address specified');
        }

        if (!message) {
            throw Error('Wool: No message provided');
        }

        udpMessage(this.client, {
            broadcast,
            message,
            port,
            address,
        }, (err) => {
            if (err) {
                throw Error(err.message);
            }
            callback();
        });
    }

    confirm(info) {
        udpMessage(this.client, {
            broadcast: false,
            message: this.confirmation,
            port: this.port,
            addr: info.address,
        }, (err) => {
            if (err) {
                throw Error(err.message);
            }
        });
    }

    greet() {
        this.client.bind(() => {
            udpMessage(this.client, {
                broadcast: true,
                message: this.greeting,
                port: this.port,
                addr: this.addr,
            }, () => {
                this.emit('greeting:sent', {
                    address: this.addr,
                    port: this.port,
                }, this.greeting);
            });
        });
    }
};
