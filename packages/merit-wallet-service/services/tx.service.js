const util = require('util');

class TxService {

    constructor(bcClient) {
        this.bcClient = bcClient;
    }

    async getUtxos(address) {

        const cacheKey = address;
        const addressesArg = { addresses: [address] };

        //todo query mempool and blockchain in parallel?
        const mempoolUtxos = await util.promisify( this.bcClient.getAddressMempool(addressesArg) );
        let bcUtxos = [];
        if (cache.utxos[cacheKey]) {
           bcUtxos = cache.utxos[cacheKey];
        } else {
           bcUtxos = await this.promisify( this.bcClient.getAddressUtxos(addressesArg));
        }

    }

    getInvites(address) {

    }

    //calling on new block event
    clearCache() {
        this.cache = { utxos: {}, invites: {} };
    }

}

module.exports = TxService;