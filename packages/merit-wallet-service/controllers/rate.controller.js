class RateController {

    /**
     * Returns known fiat rates
     *
     * @returns [{code: string, name: string, rate: number}]
     */
   async getRates(req, res) {
       let dummy =  [{"code": "USD", "name": "US Dollar", "rate": 0}];
       return res.json(dummy);
   }

}
module.exports = new RateController();