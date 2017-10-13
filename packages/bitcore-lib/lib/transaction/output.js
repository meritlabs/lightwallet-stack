'use strict';

var _ = require('lodash');
var BN = require('../crypto/bn');
var buffer = require('buffer');
var bufferUtil = require('../util/buffer');
var JSUtil = require('../util/js');
var BufferWriter = require('../encoding/bufferwriter');
var Script = require('../script');
var $ = require('../util/preconditions');
var errors = require('../errors');

var MAX_SAFE_INTEGER = 0x1fffffffffffff;

function Output(args) {
  if (!(this instanceof Output)) {
    return new Output(args);
  }
  if (_.isObject(args)) {
    this.quanta = args.quanta;
    if (bufferUtil.isBuffer(args.script)) {
      this._scriptBuffer = args.script;
    } else {
      var script;
      if (_.isString(args.script) && JSUtil.isHexa(args.script)) {
        script = new buffer.Buffer(args.script, 'hex');
      } else {
        script = args.script;
      }
      this.setScript(script);
    }
  } else {
    throw new TypeError('Unrecognized argument for Output');
  }
}

Object.defineProperty(Output.prototype, 'script', {
  configurable: false,
  enumerable: true,
  get: function() {
    if (this._script) {
      return this._script;
    } else {
      this.setScriptFromBuffer(this._scriptBuffer);
      return this._script;
    }

  }
});

Object.defineProperty(Output.prototype, 'quanta', {
  configurable: false,
  enumerable: true,
  get: function() {
    return this._quanta;
  },
  set: function(num) {
    if (num instanceof BN) {
      this._quantaBN = num;
      this._quanta = num.toNumber();
    } else if (_.isString(num)) {
      this._quanta = parseInt(num);
      this._quantaBN = BN.fromNumber(this._quanta);
    } else {
      $.checkArgument(
        JSUtil.isNaturalNumber(num),
        'Output quanta is not a natural number'
      );
      this._quantaBN = BN.fromNumber(num);
      this._quanta = num;
    }
    $.checkState(
      JSUtil.isNaturalNumber(this._quanta),
      'Output quanta is not a natural number'
    );
  }
});

Output.prototype.invalidQuanta = function() {
  if (this._quanta > MAX_SAFE_INTEGER) {
    return 'transaction txout quanta greater than max safe integer';
  }
  if (this._quanta !== this._quantaBN.toNumber()) {
    return 'transaction txout quanta has corrupted value';
  }
  if (this._quanta < 0) {
    return 'transaction txout negative';
  }
  return false;
};

Output.prototype.toObject = Output.prototype.toJSON = function toObject() {
  var obj = {
    quanta: this.quanta
  };
  obj.script = this._scriptBuffer.toString('hex');
  return obj;
};

Output.fromObject = function(data) {
  return new Output(data);
};

Output.prototype.setScriptFromBuffer = function(buffer) {
  this._scriptBuffer = buffer;
  try {
    this._script = Script.fromBuffer(this._scriptBuffer);
    this._script._isOutput = true;
  } catch(e) {
    if (e instanceof errors.Script.InvalidBuffer) {
      this._script = null;
    } else {
      throw e;
    }
  }
};

Output.prototype.setScript = function(script) {
  if (script instanceof Script) {
    this._scriptBuffer = script.toBuffer();
    this._script = script;
    this._script._isOutput = true;
  } else if (_.isString(script)) {
    this._script = Script.fromString(script);
    this._scriptBuffer = this._script.toBuffer();
    this._script._isOutput = true;
  } else if (bufferUtil.isBuffer(script)) {
    this.setScriptFromBuffer(script);
  } else {
    throw new TypeError('Invalid argument type: script');
  }
  return this;
};

Output.prototype.inspect = function() {
  var scriptStr;
  if (this.script) {
    scriptStr = this.script.inspect();
  } else {
    scriptStr = this._scriptBuffer.toString('hex');
  }
  return '<Output (' + this.quanta + ' quanta) ' + scriptStr + '>';
};

Output.fromBufferReader = function(br) {
  var obj = {};
  obj.quanta = br.readUInt64LEBN();
  var size = br.readVarintNum();
  if (size !== 0) {
    obj.script = br.read(size);
  } else {
    obj.script = new buffer.Buffer([]);
  }
  return new Output(obj);
};

Output.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.writeUInt64LEBN(this._quantaBN);
  var script = this._scriptBuffer;
  writer.writeVarintNum(script.length);
  writer.write(script);
  return writer;
};

module.exports = Output;
