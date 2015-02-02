'use strict';

var moment = moment || require('moment');
var RateService = copay.RateService;

describe('RateService model', function() {
  it('should create an instance', function() {
    var rs = new RateService();
    should.exist(rs);
  });

  describe('Fetching currencies', function() {
    var clock;
    before(function() {
      clock = sinon.useFakeTimers();
    });
    after(function() {
      clock.restore();
    });
    it('should retry fetching currencies on error', function() {
      var request = sinon.stub();
      request.get = sinon.stub().yields('dummy error');

      var rs = new RateService({
        request: request
      });
      should.exist(rs);
      request.get.calledOnce.should.be.true;
      clock.tick(1000);
      request.get.calledTwice.should.be.false;
      clock.tick(4000);
      request.get.calledTwice.should.be.true;

      request.get = sinon.stub().yields(null, null, [{
        code: 'USD',
        name: 'United States Dollar',
        rate: 2
      }]);
      clock.tick(7500);
      request.get.calledOnce.should.be.true;
      clock.tick(15000);
      request.get.callCount.should.equal(1);
    });

    it('should refresh exchange rates after 1 hour', function() {
      var request = sinon.stub();
      request.get = sinon.stub().yields(null, null, [{
        code: 'USD',
        name: 'United States Dollar',
        rate: 2
      }]);

      var rs = new RateService({
        request: request
      });
      should.exist(rs);
      request.get.calledOnce.should.be.true;
      rs.toFiat(1e8, 'USD').should.equal(2);

      request.get = sinon.stub().yields(null, null, [{
        code: 'USD',
        name: 'United States Dollar',
        rate: 3
      }]);
      clock.tick(3600 * 1000);
      request.get.calledOnce.should.be.true;
      rs.toFiat(1e8, 'USD').should.equal(3);
    });
  });

  describe('Conversion methods', function() {
    before(function() {
      sinon.stub(RateService.prototype, '_fetchCurrencies').returns();
    });
    after(function() {
      RateService.prototype._fetchCurrencies.restore();
    });

    describe('#toFiat', function() {
      it('should throw error when unavailable', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(false);
        (function() {
          rs.toFiat(10000, 'USD');
        }).should.throw('not available');
      });
      it('should return current valuation', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(true);
        var getRateStub = sinon.stub(rs, 'getRate')
        getRateStub.withArgs('USD').returns(300.00);
        getRateStub.withArgs('EUR').returns(250.00);
        var params = [{
          satoshis: 0,
          code: 'USD',
          expected: '0.00'
        }, {
          satoshis: 1e8,
          code: 'USD',
          expected: '300.00'
        }, {
          satoshis: 10000,
          code: 'USD',
          expected: '0.03'
        }, {
          satoshis: 20000,
          code: 'EUR',
          expected: '0.05'
        }, ];

        _.each(params, function(p) {
          rs.toFiat(p.satoshis, p.code).toFixed(2).should.equal(p.expected);
        });
      });
    });

    describe('#toFiatHistoric', function() {
      it('should return historic valuation', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(true);
        var today = Date.now();
        var yesterday = today - 24 * 3600;
        var getHistoricalRateStub = sinon.stub(rs, 'getHistoricRate');
        getHistoricalRateStub.withArgs('USD', today).yields(null, 300.00);
        getHistoricalRateStub.withArgs('USD', yesterday).yields(null, 250.00);
        getHistoricalRateStub.withArgs('EUR', today).yields(null, 250.00);
        getHistoricalRateStub.withArgs('EUR', yesterday).yields(null, 200.00);
        var params = [{
          satoshis: 0,
          code: 'USD',
          date: today,
          expected: '0.00'
        }, {
          satoshis: 1e8,
          code: 'USD',
          date: today,
          expected: '300.00'
        }, {
          satoshis: 10000,
          code: 'USD',
          date: today,
          expected: '0.03'
        }, {
          satoshis: 0,
          code: 'USD',
          date: today,
          expected: '0.00'
        }, {
          satoshis: 1e8,
          code: 'USD',
          date: today,
          expected: '300.00'
        }, {
          satoshis: 10000,
          code: 'USD',
          date: today,
          expected: '0.03'
        }, {
          satoshis: 20000,
          code: 'EUR',
          date: today,
          expected: '0.05'
        }, {
          satoshis: 20000,
          code: 'EUR',
          date: yesterday,
          expected: '0.04'
        }, ];

        _.each(params, function(p) {
          rs.toFiatHistoric(p.satoshis, p.code, p.date, function(err, rate) {
            rate.toFixed(2).should.equal(p.expected);
          });
        });
      });

      it('should return an error', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(true);
        var today = Date.now();
        var yesterday = today - 24 * 3600;
        var getHistoricalRateStub = sinon.stub(rs, 'getHistoricRate');
        getHistoricalRateStub.withArgs('XXX', today).yields('Not found', null);


        var params = [{
          satoshis: 0,
          code: 'XXX',
          date: today,
          expected: '0.00'
        }];
        _.each(params, function(p) {
          rs.toFiatHistoric(p.satoshis, p.code, p.date, function(err, rate) {
            err.should.equal('Not found');
          });
        });
      });

    });

    describe('#getHistoricRate', function() {
      it('should return historic rate', function() {
        var yesterday = moment().subtract(1, 'day');
        var reqStub = sinon.stub();
        reqStub.get = sinon.stub().yields(null, {
          statusCode: 200
        }, {
          ts: yesterday,
          rate: 100
        });

        var rs = new RateService({
          request: reqStub
        });
        rs.isAvailable = sinon.stub().returns(true);

        var params = [{
          code: 'USD',
          date: yesterday,
          expected: '100.00'
        }];

        _.each(params, function(p) {
          rs.getHistoricRate('USD', yesterday, function(err, rate) {
            rate.toFixed(2).should.equal(p.expected);
          });
        });
      });

      it('should return error', function() {
        var yesterday = moment().subtract(1, 'day');
        var reqStub = sinon.stub();
        reqStub.get = sinon.stub().yields(null, {
          statusCode: 500
        });

        var rs = new RateService({
          request: reqStub
        });
        rs.isAvailable = sinon.stub().returns(true);

        rs.getHistoricRate('USD', yesterday, function(err, rate) {
          err.statusCode.should.equal(500);
        });

      });
    });

    describe('#getHistoricRates', function() {
      it('should return historic rates for many dates', function() {
        var yesterday = moment().subtract(1, 'day');
        var lastWeekday = moment().subtract(7, 'day');
        var reqStub = sinon.stub();
        reqStub.get = sinon.stub().yields(null, {
          statusCode: 200
        }, [{
          ts: lastWeekday,
          rate: 90,
        }, {
          ts: yesterday,
          rate: 100,
        }, ]);

        var rs = new RateService({
          request: reqStub
        });
        rs.isAvailable = sinon.stub().returns(true);

        var params = [{
          code: 'USD',
          date: lastWeekday,
          expected: '90.00'
        }, {
          code: 'USD',
          date: yesterday,
          expected: '100.00'
        }];

        var dates = [lastWeekday, yesterday];
        rs.getHistoricRates('USD', dates, function(err, r) {
          r.length.should.equal(2);
        });

        //same input dates should return only two values
        dates.push(lastWeekday);
        dates.push(yesterday);
        rs.getHistoricRates('USD', dates, function(err, r) {
          r.length.should.equal(2);
        });
      });

      it('should return a value', function() {
        var yesterday = moment().subtract(1, 'day');
        var reqStub = sinon.stub();

        var statusIn = {
          statusCode: 200
        };

        var rateIn = {
          rate: 50
        };
        reqStub.get = sinon.stub().yields(null, statusIn, rateIn);

        var rs = new RateService({
          request: reqStub
        });
        rs.isAvailable = sinon.stub().returns(true);

        var dates = [yesterday, yesterday];
        rs.getHistoricRates('USD', dates, function(err, status, rate) {
          status[0].rate.should.equal(50);
        });
      });

      it('should return error', function() {
        var yesterday = moment().subtract(1, 'day');
        var reqStub = sinon.stub();
        reqStub.get = sinon.stub().yields(null, {
          statusCode: 500
        });

        var rs = new RateService({
          request: reqStub
        });
        rs.isAvailable = sinon.stub().returns(true);

        var dates = [yesterday, yesterday];
        rs.getHistoricRates('USD', dates, function(err, rate) {
          err.statusCode.should.equal(500);
        });
      });
    });

    describe('#fromFiat', function() {
      it('should throw error when unavailable', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(false);
        (function() {
          rs.fromFiat(300, 'USD');
        }).should.throw('not available');
      });
      it('should return current valuation', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(true);
        var getRateStub = sinon.stub(rs, 'getRate')
        getRateStub.withArgs('USD').returns(300.00);
        getRateStub.withArgs('EUR').returns(250.00);
        var params = [{
          amount: 0,
          code: 'USD',
          expected: 0
        }, {
          amount: 300.00,
          code: 'USD',
          expected: 1e8
        }, {
          amount: 600.00,
          code: 'USD',
          expected: 2e8
        }, {
          amount: 250.00,
          code: 'EUR',
          expected: 1e8
        }, ];

        _.each(params, function(p) {
          rs.fromFiat(p.amount, p.code).should.equal(p.expected);
        });
      });
    });
    describe('#listAlternatives', function() {
      it('should throw error when unavailable', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(false);
        (function() {
          rs.listAlternatives();
        }).should.throw('not available');
      });
      it('should return list of available currencies', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(true);
        sinon.stub(rs, 'getAlternatives').returns([{
          name: 'United States Dollar',
          isoCode: 'USD',
          rate: 300.00,
        }, {
          name: 'European Union Euro',
          isoCode: 'EUR',
          rate: 250.00,
        }, ])

        var list = rs.listAlternatives();
        list.should.exist;
        list.length.should.equal(2);
      });
    });
    describe('#getAlternatives', function() {
      it('should return nothing when trying to get the list of available currencies', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(false);
        rs.whenAvailable(function() {});
        rs.getAlternatives().length.should.equal(0);
      });

    });

    describe('#whenAvailable is available', function() {
      it('should return callback ', function() {
        var rs = new RateService();
        rs.isAvailable = sinon.stub().returns(true);
        rs.whenAvailable(function() {});
      });
    });

    describe('#whenAvailable is not available', function() {
      it('should queue the callback ', function() {

        var rs = new RateService();
        var count = rs._queued.length;
        rs.isAvailable = sinon.stub().returns(false);
        rs.whenAvailable(function() {});
        rs._queued.length.should.be.equal(count + 1);
      });
    });

    describe('#singleton', function() {
      it('should create only one instance', function() {
        var rs = RateService.singleton();
        rs.should.be.not.null;
        var rs2 = RateService.singleton();
        rs2.should.be.not.null;
        rs.should.deep.equal(rs2);
      });
    });
  });
});
