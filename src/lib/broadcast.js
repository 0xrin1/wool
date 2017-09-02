
module.exports = function broadcast(client, options = {}) {
    const {
        addr,
        port,
        message,
    } = options;

    if (!message) {
        throw Error('Broadcasting: falsy message cannot be broadcast');
    }

    const messageBuffer = new Buffer(message);

    client.setBroadcast(true);
    client.send(messageBuffer, 0, messageBuffer.length, port, addr, () => {
        console.log(`Sent '${message}'`);
        client.close();
    });
};
