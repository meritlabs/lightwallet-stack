const Cache = require('../schemes/cache.scheme');

class TxService {

    constructor(bcClient) {
        this.bcClient = bcClient;
        this.cachePrefix = 'utxos_';
    }

    getUtxos(address) {
        return this.getAllUtxos(address, false);
    }

    getInvites(address) {
        return this.getAllUtxos(address, true);
    }

    /**
     *
     * @param address
     * @param invites - search for invites (true) or regular transactions
     * @returns []
     */
    async getAllUtxos(address, invites) {

        const cacheKey = (invites ? 'i' : 't')+this.cachePrefix+address;

        let result = await Cache.findOne({key: cacheKey}, {value: 1}).lean();
        let cache = result ? result.value : {};
        if (!result) {
            await Cache.create({key: cacheKey, value: {}});
        }

        const addressesArg = { addresses: [address], invites: invites };
        let { result:mempoolUtxos, error } = await this.bcClient.getAddressMempool(addressesArg);
        if (error) throw  new Error(error);
        mempoolUtxos = mempoolUtxos.filter(t => t.isInvite == invites);

        let bcUtxos;
        if (cache[address]) {
            bcUtxos = cache[address];
        } else {
            const {result, error} = await this.bcClient.getAddressUtxos(addressesArg);
            if (error) throw  new Error(error);
            bcUtxos = result;
        }

        await Cache.update({key: cacheKey}, {value: cache});

        return mempoolUtxos.concat(bcUtxos);
    }


}

module.exports = TxService;