const os = require('os');
const dgram = require('dgram');
const EventEmitter = require('../event-emitter/event-emitter');
const udpMessage = require('../lib/udp-message');

class RadioOperator extends EventEmitter {
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
}

module.exports = RadioOperator;
