const { promisify } = require('util');
const Cache = require('../schemes/cache.scheme');

class SystemService {

    constructor(bcClient, mongoClient) {
        this.bcClient = bcClient;
        this.cacheKey = 'system';
    }

    async getBlockChainInfo() {

        let result = await Cache.findOne({key: this.cacheKey}, {value: 1}).lean();
        let cache = result ? result.value : {};

        if (!cache.hash) {
            const { result:hash, error } = await this.bcClient.getBestBlockHash();
            if (error) throw new Error(error);
            cache.hash = hash;
        }

        if (!cache.info) {
            const { result:info, error } = await this.bcClient.getBlock(cache.hash);
            if (error) throw new Error(error);
            cache.info = info;
        }

        await Cache.update({key: this.cacheKey}, {value: cache});

        return {
          chainHeight: cache.info.height,
          lastCreatedAt: cache.info.time
        };

    }

    //calling on new block event
    clearCache() {
        Cache.update({key: this.cacheKey}, {value: {}});
    }


}

module.exports = SystemService;