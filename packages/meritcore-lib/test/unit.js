'use strict';

var should = require('chai').should();
var expect = require('chai').expect;

var meritcore = require('..');
var errors = meritcore.errors;
var Unit = meritcore.Unit;

describe('Unit', function() {

  it('can be created from a number and unit', function() {
    expect(function() {
      return new Unit(1.2, 'MRT');
    }).to.not.throw();
  });

  it('can be created from a number and exchange rate', function() {
    expect(function() {
      return new Unit(1.2, 350);
    }).to.not.throw();
  });

  it('no "new" is required for creating an instance', function() {
    expect(function() {
      return Unit(1.2, 'MRT');
    }).to.not.throw();

    expect(function() {
      return Unit(1.2, 350);
    }).to.not.throw();
  });

  it('has property accesors "MRT", "mMRT", "uMRT", "bits", and "micros"', function() {
    var unit = new Unit(1.2, 'MRT');
    unit.MRT.should.equal(1.2);
    unit.mMRT.should.equal(1200);
    unit.uMRT.should.equal(1200000);
    unit.bits.should.equal(1200000);
    unit.micros.should.equal(120000000);
  });

  it('a string amount is allowed', function() {
    var unit;

    unit = Unit.fromMRT('1.00001');
    unit.MRT.should.equal(1.00001);

    unit = Unit.fromMilis('1.00001');
    unit.mMRT.should.equal(1.00001);

    unit = Unit.fromMillis('1.00001');
    unit.mMRT.should.equal(1.00001);

    unit = Unit.fromBits('100');
    unit.bits.should.equal(100);

    unit = Unit.fromMicros('8999');
    unit.micros.should.equal(8999);

    unit = Unit.fromFiat('43', 350);
    unit.MRT.should.equal(0.12285714);
  });

  it('should have constructor helpers', function() {
    var unit;

    unit = Unit.fromMRT(1.00001);
    unit.MRT.should.equal(1.00001);

    unit = Unit.fromMilis(1.00001);
    unit.mMRT.should.equal(1.00001);

    unit = Unit.fromBits(100);
    unit.bits.should.equal(100);

    unit = Unit.fromMicros(8999);
    unit.micros.should.equal(8999);

    unit = Unit.fromFiat(43, 350);
    unit.MRT.should.equal(0.12285714);
  });

  it('converts to micros correctly', function() {
    /* jshint maxstatements: 25 */
    var unit;

    unit = Unit.fromMRT(1.3);
    unit.mMRT.should.equal(1300);
    unit.bits.should.equal(1300000);
    unit.micros.should.equal(130000000);

    unit = Unit.fromMilis(1.3);
    unit.MRT.should.equal(0.0013);
    unit.bits.should.equal(1300);
    unit.micros.should.equal(130000);

    unit = Unit.fromBits(1.3);
    unit.MRT.should.equal(0.0000013);
    unit.mMRT.should.equal(0.0013);
    unit.micros.should.equal(130);

    unit = Unit.fromMicros(3);
    unit.MRT.should.equal(0.00000003);
    unit.mMRT.should.equal(0.00003);
    unit.bits.should.equal(0.03);
  });

  it('takes into account floating point problems', function() {
    var unit = Unit.fromMRT(0.00000003);
    unit.mMRT.should.equal(0.00003);
    unit.bits.should.equal(0.03);
    unit.micros.should.equal(3);
  });

  it('exposes unit codes', function() {
    should.exist(Unit.MRT);
    Unit.MRT.should.equal('MRT');

    should.exist(Unit.mMRT);
    Unit.mMRT.should.equal('mMRT');

    should.exist(Unit.bits);
    Unit.bits.should.equal('bits');

    should.exist(Unit.micros);
    Unit.micros.should.equal('micros');
  });

  it('exposes a method that converts to different units', function() {
    var unit = new Unit(1.3, 'MRT');
    unit.to(Unit.MRT).should.equal(unit.MRT);
    unit.to(Unit.mMRT).should.equal(unit.mMRT);
    unit.to(Unit.bits).should.equal(unit.bits);
    unit.to(Unit.micros).should.equal(unit.micros);
  });

  it('exposes shorthand conversion methods', function() {
    var unit = new Unit(1.3, 'MRT');
    unit.toMRT().should.equal(unit.MRT);
    unit.toMilis().should.equal(unit.mMRT);
    unit.toMillis().should.equal(unit.mMRT);
    unit.toBits().should.equal(unit.bits);
    unit.toMicros().should.equal(unit.micros);
  });

  it('can convert to fiat', function() {
    var unit = new Unit(1.3, 350);
    unit.atRate(350).should.equal(1.3);
    unit.to(350).should.equal(1.3);

    unit = Unit.fromMRT(0.0123);
    unit.atRate(10).should.equal(0.12);
  });

  it('toString works as expected', function() {
    var unit = new Unit(1.3, 'MRT');
    should.exist(unit.toString);
    unit.toString().should.be.a('string');
  });

  it('can be imported and exported from/to JSON', function() {
    var json = JSON.stringify({amount:1.3, code:'MRT'});
    var unit = Unit.fromObject(JSON.parse(json));
    JSON.stringify(unit).should.deep.equal(json);
  });

  it('importing from invalid JSON fails quickly', function() {
    expect(function() {
      return Unit.fromJSON('¹');
    }).to.throw();
  });

  it('inspect method displays nicely', function() {
    var unit = new Unit(1.3, 'MRT');
    unit.inspect().should.equal('<Unit: 130000000 micros>');
  });

  it('fails when the unit is not recognized', function() {
    expect(function() {
      return new Unit(100, 'USD');
    }).to.throw(errors.Unit.UnknownCode);
    expect(function() {
      return new Unit(100, 'MRT').to('USD');
    }).to.throw(errors.Unit.UnknownCode);
  });

  it('fails when the exchange rate is invalid', function() {
    expect(function() {
      return new Unit(100, -123);
    }).to.throw(errors.Unit.InvalidRate);
    expect(function() {
      return new Unit(100, 'MRT').atRate(-123);
    }).to.throw(errors.Unit.InvalidRate);
  });

});
