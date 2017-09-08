const chai = require('chai');
const Wool = require('../src/wool');

describe('wool', () => {
    describe('.message', () => {
        const wool = new Wool();

        before(() => {
            wool.start();
        });

        it('invokes callback', (done) => {
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
            const callback = (info, message) => {
                chai.expect(message.body).to.equal(messageBody);
                done();
            };
            const target = {
                address: '127.0.0.1',
            };

            wool.on('message:received', callback);
            wool.message(target, messageBody);
        });
    });
});
