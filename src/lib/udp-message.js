
module.exports = function udpMessage(client, options = {}, callback) {
    const {
        broadcast = false,
        addr,
        port,
        message,
    } = options;

    if (!message) {
        throw Error('UDP message: message of type falsy cannot be sent');
    }

    const messageBuffer = new Buffer(message);

    client.setBroadcast(broadcast);
    client.send(messageBuffer, 0, messageBuffer.length, port, addr, (err, messageLength) => {
        callback(err, messageLength);
    });
};
