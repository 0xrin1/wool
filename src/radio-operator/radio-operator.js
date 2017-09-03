const EventEmitter = require('../event-emitter/event-emitter');
const dgram = require('dgram');
const udpMessage = require('../lib/udp-message');

class RadioOperator extends EventEmitter {
    constructor() {
        super();

        this.port = 6024;
        this.addr = '192.168.1.255';
        this.server = dgram.createSocket('udp4');
        this.client = dgram.createSocket('udp4');
        this.greeting = JSON.stringify({
            type: 'greeting',
            message: 'Hello world!',
        });
        this.confirmation = JSON.stringify({
            type: 'confirmation',
            message: 'Hello dude!',
        });
    }

    listen() {
        this.server.on('listening', () => {
            const info = this.server.address();
            this.eventEmitter.emit('listening', info);
        });

        this.server.on('message', (messageBuffer, info) => {
            const message = JSON.parse(messageBuffer.toString());

            if (message.type === 'greeting') {
                this.eventEmitter.emit('greeting:received', info, message);
                this.confirm(info);
            }

            if (message.type === 'confirmation') {
                this.eventEmitter.emit('confirmation', info);
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
