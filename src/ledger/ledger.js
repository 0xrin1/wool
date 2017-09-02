const dgram = require('dgram');
const broadcast = require('../lib/broadcast');

class Ledger {
    constructor() {
        this.port = 6024;
        this.addr = '192.168.1.255';
        this.server = dgram.createSocket('udp4');
        this.client = dgram.createSocket('udp4');
    }

    expectBroadcast() {
        this.server.on('listening', () => {
            const address = this.server.address();

            console.log(`UDP Client listening on ${address.address}: ${address.port}`);
        });

        this.server.on('message', (message, rinfo) => {
            console.log(`Message from: ${rinfo.address}: ${rinfo.port} - ${message}`);
        });

        this.server.bind(this.port);
    }

    sendBroadcast() {
        this.client.bind(() => {
            broadcast(this.client, {
                message: "I'm here!",
                port: this.port,
                addr: this.addr,
            });
        });
    }
}

module.exports = Ledger;
