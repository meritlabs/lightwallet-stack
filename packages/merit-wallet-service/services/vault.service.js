const Vaults = require('./../models/vault.model');

//todo what if we've created vault outside mws??
// add 'import vault' method
class VaultService {

    constructor(test) {
        //console.log(test, 'test');
    }

    async getVaults(copayerId) {
        let vaults = await Vaults.find({ copayerId }).lean();

        vaults = await Promise.all(vaults.map(async (v) => {
            v.coins = await this.txService.getUtxos(v.address);
            v.amount = this.calculateAmount(v.coins);
        }));


        return vaults;
    }

    calculateAmount(coins) {
        return coins.reduce((amount, coin) => {
            return amount + coin.micros
        }, 0) || 0;
    }

}

module.exports = (app) => new VaultService(app);

