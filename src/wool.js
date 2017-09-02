const dgram = require('dgram');

const server = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');
const PORT = 6024;
const BROADCAST_ADDR = '192.168.1.255';

function broadcastNew() {
    const message = new Buffer('Broadcast message!');
    client.send(message, 0, message.length, PORT, BROADCAST_ADDR, () => {
        console.log(`Sent '${message}'`);
    });
}

// ---- server-side ----

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Client listening on ${address.address}: ${address.port}`);
    server.setBroadcast(true);
});

server.on('message', (message, rinfo) => {
    console.log(`Message from: ${rinfo.address}: ${rinfo.port} - ${message}`);
});

server.bind(PORT);

// ---- client-side ----

client.bind(() => {
    client.setBroadcast(true);
    setInterval(broadcastNew, 3000);
});
