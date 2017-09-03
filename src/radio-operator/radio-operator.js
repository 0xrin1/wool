const dgram = require('dgram');
const udpMessage = require('../lib/udp-message');

class RadioOperator {
    constructor() {
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

    expectMessage(options = {}) {
        const {
            listeningStarted,
            onGreeting,
            onConfirmation,
        } = options;

        this.server.on('listening', () => {
            const info = this.server.address();
            listeningStarted(info);
        });

        this.server.on('message', (messageBuffer, info) => {
            const message = JSON.parse(messageBuffer.toString());

            if (message.type === 'greeting') {
                onGreeting(info, message);
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

            if (message.type === 'confirmation') {
                onConfirmation(info, message);
            }
        });

        this.server.bind(this.port);
    }

    sendGreeting(cb = () => {}) {
        this.client.bind(() => {
            udpMessage(this.client, {
                broadcast: true,
                message: this.greeting,
                port: this.port,
                addr: this.addr,
            }, cb);
        });
    }
}

module.exports = RadioOperator;
