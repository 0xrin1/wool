const chai = require('chai');
const Wool = require('../src/wool');

describe('wool', () => {
    describe('wool.message', () => {
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
    });
});
