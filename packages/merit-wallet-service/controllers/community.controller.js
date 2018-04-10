//todo consider if we should use separate endpoints or just getCommunityInfo method
class CommunityController {

    /**
     * get ANV for given address
     */
    async getAnv(req, res) {
        return res.json({});
    }

    /**
     * get Rewards for each given address
     */
    async getRewards(req, res) {
        return res.json({});
    }

    /**
     * get number of people you invited
     */
    async getCommunitySize(req, res) {
        return res.json({});
    }

    /**
     * combine all controllers method calls in one object
     */
    async getCommunityInfo(req, res) {
        return res.json({});
    }


}
module.exports = new CommunityController();