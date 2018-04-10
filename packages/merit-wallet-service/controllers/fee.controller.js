class FeeController {

    //TODO cache fee levels and ask blockchain once in a block (subscribe to new block event)
    /**
     *
     * @returns {
     *   regular: {
     *       urgent: 1234,
     *       normal: 123,
     *       ...
     *   },
     *   easyReceive: 123
     * }
     */
    async getFeeLevels(req, res) {

        return res.json({});
    }



}
module.exports = new FeeController();