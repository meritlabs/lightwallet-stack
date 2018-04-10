module.exports = {
    'dev': {
        network: 'testnet',
        mwsPort: '3003',
        dbHost: 'mongodb://localhost:27017/mws',
        rpcallowid: '127.0.0.1',
        rpcuser: 'merit1',
        rpcpassword: 'local321',
        prcport:2336
    },
    'prod': {
        network: 'livenet',
        mwsPort: '3003',
        dbHost: 'mongodb://localhost:27017/mws'
    }
};