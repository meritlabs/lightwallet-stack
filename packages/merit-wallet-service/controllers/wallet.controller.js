class WalletController {

    /** temporary endpoint only to test if service is working */
    async test(req, res) {
        console.log(req.app.txService.getUtxos());
        res.json("ok");
    }

    async getStatus(req, res) {
        res.json({});
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