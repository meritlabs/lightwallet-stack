'use strict';

var bitcore = require('../..');
var should = require('chai').should();
var BufferWriter = bitcore.BufferWriter;
var BufferReader = bitcore.BufferReader;
var BN = bitcore.BN;

describe('BufferWriter', function() {

  it('should create a new buffer writer', function() {
    var bw = new BufferWriter();
    should.exist(bw);
  });

  describe('#set', function() {
    
    it('set bufs', function() {
      var buf1 = new Buffer([0]);
      var buf2 = new Buffer([1]);
      var bw = new BufferWriter().set({bufs: [buf1, buf2]});
      bw.concat().toString('hex').should.equal('0001');
    });

  });

  describe('#toBuffer', function() {
    
    it('should concat these two bufs', function() {
      var buf1 = new Buffer([0]);
      var buf2 = new Buffer([1]);
      var bw = new BufferWriter({bufs: [buf1, buf2]});
      bw.toBuffer().toString('hex').should.equal('0001');
    });

  });

  describe('#concat', function() {
    
    it('should concat these two bufs', function() {
      var buf1 = new Buffer([0]);
      var buf2 = new Buffer([1]);
      var bw = new BufferWriter({bufs: [buf1, buf2]});
      bw.concat().toString('hex').should.equal('0001');
    });

  });

  describe('#write', function() {

    it('should write a buffer', function() {
      var buf = new Buffer([0]);
      var bw = new BufferWriter();
      bw.write(buf);
      bw.concat().toString('hex').should.equal('00');
    });

  });

  describe('#writeUInt8', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt8(1).concat().toString('hex').should.equal('01');
    });

  });

  describe('#writeUInt16BE', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt16BE(1).concat().toString('hex').should.equal('0001');
    });

  });

  describe('#writeUInt16LE', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt16LE(1).concat().toString('hex').should.equal('0100');
    });

  });

  describe('#writeUInt32BE', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt32BE(1).concat().toString('hex').should.equal('00000001');
    });

  });

  describe('#writeUInt32LE', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt32LE(1).concat().toString('hex').should.equal('01000000');
    });

  });

  describe('#writeUInt64BEBN', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt64BEBN(BN(1)).concat().toString('hex').should.equal('0000000000000001');
    });

  });

  describe('#writeUInt64LEBN', function() {
    
    it('should write 1', function() {
      var bw = new BufferWriter();
      bw.writeUInt64LEBN(BN(1)).concat().toString('hex').should.equal('0100000000000000');
    });

  });

  describe('#writeVarint', function() {
    
    it('should write a 1 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintNum(1);
      bw.concat().length.should.equal(1);
    });

    it('should write a 3 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintNum(1000);
      bw.concat().length.should.equal(3);
    });

    it('should write a 5 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintNum(Math.pow(2, 16 + 1));
      bw.concat().length.should.equal(5);
    });

    it('should write a 9 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintNum(Math.pow(2, 32 + 1));
      bw.concat().length.should.equal(9);
    });

    it('should read back the same value it wrote for a 9 byte varint', function() {
      var bw = new BufferWriter();
      var n = Math.pow(2, 53);
      n.should.equal(n + 1); //javascript number precision limit
      bw.writeVarintNum(n);
      var br = new BufferReader({buf: bw.concat()});
      br.readVarintBN().toNumber().should.equal(n);
    });

  });

  describe('#writeVarintBN', function() {
    
    it('should write a 1 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintBN(BN(1));
      bw.concat().length.should.equal(1);
    });

    it('should write a 3 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintBN(BN(1000));
      bw.concat().length.should.equal(3);
    });

    it('should write a 5 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintBN(BN(Math.pow(2, 16 + 1)));
      bw.concat().length.should.equal(5);
    });

    it('should write a 9 byte varint', function() {
      var bw = new BufferWriter();
      bw.writeVarintBN(BN(Math.pow(2, 32 + 1)));
      bw.concat().length.should.equal(9);
    });

  });

});
