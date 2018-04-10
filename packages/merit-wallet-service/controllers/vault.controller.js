class VaultController {

    async getVaults(req, res) {
        const vaults = await req.app.vaultService.getVaults(req.copayerId);
        return res.json({vaults});
    }


    async getVault(req, res) {
        res.json({});
    }

    async createVault(req, res) {
        res.json({});
    }

    async updateVault(req, res) {
        let vault = await Vaults.findOne({ _id: req.body._id,  copayerId: copayerId});
        if (!vault) return res.status(400).end();

        vault = await VaultService.updateVaultInfo(vault, req.body);
        return res.json(vault);
    }

}

module.exports = new VaultController();