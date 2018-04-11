const MeritRPC = require('meritd-rpc');
const ENV = require('./../environment.js')[process.env.NODE_ENV];
const { promisify } = require('util');

class BlockchainClient {

    constructor() {
        let client = new MeritRPC({
            protocol:  'http',
            host: ENV.rpchost || '127.0.0.1',
            port: ENV.rpcport,
            user: ENV.rpcuser,
            pass: ENV.rpcpassword,
            rejectUnauthorized: ENV.rpcstrict == undefined ? true : ENV.rpcstrict
        });

        for (let method of Object.keys(MeritRPC.callspec)) {
            this[method] = promisify(
                client[method].bind(this.client)
            );
        }
    }
}

module.exports = new BlockchainClient();