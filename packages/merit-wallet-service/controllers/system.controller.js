const moment = require('moment');

class SystemController {

    async getSystemStatus(req, res) {

        const blockChainInfo = await req.app.systemService.getBlockChainInfo();

        return res.end(`
            System is working
            \n
            chain height: ${blockChainInfo.chainHeight}
            last block created at: ${moment(blockChainInfo.time)}
        `)
    }


}
module.exports = new SystemController();