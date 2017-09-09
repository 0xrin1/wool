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
        this.echoMsg = {
            type: 'echo',
            name: os.hostname(),
            body: null,
        };
        this.pendingEchoes = new Set();
    }

    listen() {
        this.server.on('listening', () => {
            const info = this.server.address();
            this.emit('listening', info);
        });

        this.server.on('message', (messageBuffer, info) => {
            const message = JSON.parse(messageBuffer.toString());

            switch (message.type) {
            case 'greeting':
                this.onGreetingReceived(info, message);
                break;
            case 'confirmation':
                this.onConfirmationReceived(info, message);
                break;
            case 'echo':
                this.onEchoReceived(info, message);
                break;
            default:
                this.onMessageReceived(info, message);
                break;
            }
        });

        this.server.bind(this.port);
    }

    onGreetingReceived(info, message) {
        this.emit('greeting:received', info, message);
        this.confirm(info);
    }

    onConfirmationReceived(info, message) {
        this.emit('confirmation:received', info, message);
    }

    onEchoReceived(info, message) {
        this.emit('echo:received', info, message);
        this.pendingEchoes.delete(message.body.id);
    }

    onEchoLost(info, message) {
        this.emit('echo:lost', info, message);
    }

    onMessageSent(info, message) {
        const echoId = Date.now() + Math.random();
        this.pendingEchoes.add(echoId);

        this.emit('message:sent', info, message);
        this.echoTimeout(echoId, info, message);
    }

    onMessageReceived(info, message) {
        this.emit('message:received', info, message);
        this.echo(info, message);
    }

    message(target, data, callback, options = {}) {
        const {
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
            port: this.port,
            address,
        }, (err) => {
            if (err) {
                throw Error(err.message);
            }
            this.onMessageSent(target, message);
            callback();
        });
    }

    echoTimeout(id, target, message) {
        setTimeout(() => {
            if (this.pendingEchoes.has(id)) {
                this.onEchoLost(target, message);
            }
        }, 1000);
    }

    echo(info, message) {
        const msg = assign(clone(this.echoMsg), 'body', message.body);

        udpMessage(this.client, {
            address: info.address,
            port: this.port,
            broadcast: false,
            message: JSON.stringify(msg),
        }, (err) => {
            if (err) {
                throw Error(err);
            }
            this.emit('echo:sent', info, msg);
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
