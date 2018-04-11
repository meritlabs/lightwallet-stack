const Wallets = require('./../schemes/wallet.scheme');

class WalletController {

    async getStatus(req, res) {

        //debug data
        const address = 'meBrB81T8bTyvq9vxVUzxHaoA9fnRLcz7E';

        //todo run in parallel
        const utxos = await req.app.txService.getUtxos(address);
        const invites = await req.app.txService.getInvites(address);
        const wallet  =  await Wallets.findOne({rootAddress: address}); //todo change to copayer id

        res.json({
            utxos: utxos,
            invites: invites,
            wallet: wallet
        });
    }

    async getUnlockRequests(req, res) {
        res.json({});
    }

    async getHistory(req, res) {
        res.json({});
    }

    async getPreferences(req, res) {
       res.json({});
    }

    async createWallet(req, res) {
        res.json({});
    }

    async importWallet(req, res) {
        res.json({});
    }

    async setPreferences(req, res) {
        res.json({});
    }

}
module.exports = new WalletController();