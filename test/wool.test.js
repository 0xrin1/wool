const chai = require('chai');
const Wool = require('../src/wool');
const once = require('../src/lib/once');

describe('wool', () => {
    const wool = new Wool();

    before(() => {
        wool.start();
    });

    it('invokes callback on message sent', (done) => {
        const callback = () => {
            chai.expect(true).to.equal(true);
            done();
        };
        const target = {
            port: 80,
            address: '127.0.0.1',
        };
        const data = {
            message: 'stuff',
        };
        const options = {};

        wool.message(target, data, callback, options);
    });

    it('listens to messages', (done) => {
        const messageBody = 'awesome';
        const callback = once((info, message) => {
            chai.expect(message.body).to.equal(messageBody);
            done();
        });
        const target = {
            address: '127.0.0.1',
        };

        wool.on('message:received', callback);
        wool.message(target, messageBody);
    });

    it('sends an echo', (done) => {
        const callback = once(() => {
            chai.expect(true).to.equal(true);
            done();
        });
        const target = {
            address: '127.0.0.1',
        };

        wool.on('echo:sent', callback);
        wool.message(target, '');
    });

    it('receives an echo', (done) => {
        const callback = once((info, message) => {
            chai.expect(message.type).to.equal('echo');
            done();
        });
        const target = {
            address: '127.0.0.1',
        };

        wool.on('echo:received', callback);
        wool.message(target, '');
    });

    it('drops a node from the ledger if echo lost', (done) => {
        const target = {
            address: '192.168.0.123',
        };
        const callback = once(() => {
            chai.expect(wool.ledger.has(target.address)).to.equal(false);
            done();
        });

        wool.on('echo:lost', callback);
        wool.message(target, '');
    });
});
