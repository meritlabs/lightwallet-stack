const Cache = require('../schemes/cache.scheme');

class TxService {

    constructor(bcClient) {
        this.bcClient = bcClient;
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

        const cacheKey = (invites ? 'i' : 't')+'utxos'+address;

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

    async getHistory(address) {

        const addressesArg = { addresses: [address] };
        const cacheKey ='txhistory_'+address;

        let result = await Cache.findOne({key: cacheKey}, {value: 1}).lean();
        let bcTxs = result ? result.value : [];
        if (!result) {
            await Cache.create({key: cacheKey, value: []});
        }

        if (!bcTxs.length) {
            const {result:txids, error} = await this.bcClient.getAddressTxids(addressesArg);
            if (error) throw  new Error(error);

            for (let txid of txids) {
                let tx = await this.bcClient.getTransaction(txid);
                if (error) throw  new Error(error);

                bcTxs.push(tx);
            }
            await Cache.update({key: cacheKey}, {value: bcTxs});
        }

        const {result:mempoolTxs, error} = await this.bcClient.getAddressMempool(addressesArg);
        if (error) throw  new Error(error);

        return mempoolTxs.concat(bcTxs);
    }




}

module.exports = TxService;