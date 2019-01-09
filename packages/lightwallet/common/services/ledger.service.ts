import { Injectable } from '@angular/core';

@Injectable()
export class LedgerService {
  static description = {
    id: 'ledger',
    name: 'Ledger',
    longName: 'Ledger Hardware Wallet',
    isEmbeddedHardware: false,
    supportsTestnet: false,
  };

  private static LEDGER_CHROME_ID = 'kkdpmhnladdopljabkgpacgpliggeeaf';

  public hexToArray(s) {
    let bstr = new ByteString(s, GP.HEX).toBuffer();
    let a = new Uint8Array(bstr.length);

    Array.prototype.forEach.call(bstr, (ch, i) => {
      a[i] = (ch + '').charCodeAt(0);
    });

    return a;
  }

  public hexToString(s) {
    return new ByteString(s, GP.HEX).toBuffer();
  }
}

class Convert {
  /**
   * Convert a binary string to his hexadecimal representation
   * @param {String} src binary string
   * @static
   * @returns {String} hexadecimal representation
   */
  static stringToHex(src) {
    let r = '';
    let hexes = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
    for (var i = 0; i < src.length; i++) {
      r += hexes[src.charCodeAt(i) >> 4] + hexes[src.charCodeAt(i) & 0xf];
    }
    return r;
  }

  /**
   * Convert an hexadecimal string to its binary representation
   * @param {String} src hexadecimal string
   * @static
   * @return {Array} byte array
   * @throws {InvalidString} if the string isn't properly formatted
   */
  static hexToBin(src) {
    var result = '';
    var digits = '0123456789ABCDEF';
    if (src.length % 2 != 0) {
      throw 'Invalid string: ' + src;
    }
    src = src.toUpperCase();
    for (var i = 0; i < src.length; i += 2) {
      var x1 = digits.indexOf(src.charAt(i));
      if (x1 < 0) {
        return '';
      }
      var x2 = digits.indexOf(src.charAt(i + 1));
      if (x2 < 0) {
        return '';
      }
      result += String.fromCharCode((x1 << 4) + x2);
    }
    return result;
  }

  /**
   * Convert a double digit hexadecimal number to an integer
   * @static
   * @param {String} data buffer containing the digit to parse
   * @param {Number} offset offset to the digit (default is 0)
   * @returns {Number} converted digit
   */
  public static readHexDigit = function(data, offset) {
    var digits = '0123456789ABCDEF';
    if (typeof offset == 'undefined') {
      offset = 0;
    }
    return (
      (digits.indexOf(data.substring(offset, offset + 1).toUpperCase()) << 4) +
      digits.indexOf(data.substring(offset + 1, offset + 2).toUpperCase())
    );
  };

  /**
   * Convert a number to a two digits hexadecimal string (deprecated)
   * @static
   * @param {Number} number number to convert
   * @returns {String} converted number
   */
  public static toHexDigit = function(number) {
    var digits = '0123456789abcdef';
    return digits.charAt(number >> 4) + digits.charAt(number & 0x0f);
  };

  /**
   * Convert a number to a two digits hexadecimal string (similar to toHexDigit)
   * @static
   * @param {Number} number number to convert
   * @returns {String} converted number
   */
  public static toHexByte = function(number) {
    return this.toHexDigit(number);
  };

  /**
   * Convert a BCD number to a two digits hexadecimal string
   * @static
   * @param {Number} number number to convert
   * @returns {String} converted number
   */
  public static toHexByteBCD = function(numberBCD) {
    var number = (numberBCD / 10) * 16 + (numberBCD % 10);
    return this.toHexDigit(number);
  };

  /**
   * Convert a number to an hexadecimal short number
   * @static
   * @param {Number} number number to convert
   * @returns {String} converted number
   */
  public static toHexShort = function(number) {
    return this.toHexDigit((number >> 8) & 0xff) + this.toHexDigit(number & 0xff);
  };

  /**
   * Convert a number to an hexadecimal int number
   * @static
   * @param {Number} number number to convert
   * @returns {String} converted number
   */
  public static toHexInt = function(number) {
    return (
      this.toHexDigit((number >> 24) & 0xff) +
      this.toHexDigit((number >> 16) & 0xff) +
      this.toHexDigit((number >> 8) & 0xff) +
      this.toHexDigit(number & 0xff)
    );
  };
}

var GP: any = {};
GP.ASCII = 1;
GP.HEX = 5;

/**
 * @class GPScript ByteString implementation
 * @param {String} value initial value
 * @param {HEX|ASCII} encoding encoding to use
 * @property {Number} length length of the ByteString
 * @constructs
 */
class ByteString {
  public toBuffer = function() {
    return this.value;
  };
  private hasBuffer: boolean;
  private value: any;
  private length: any;

  constructor(value, private encoding) {
    this.hasBuffer = typeof Buffer != 'undefined';
    this.hasBuffer = false;

    if (this.hasBuffer && value instanceof Buffer) {
      this.value = value;
      this.encoding = GP.HEX;
    } else {
      switch (encoding) {
        case GP.HEX:
          if (!this.hasBuffer) {
            this.value = Convert.hexToBin(value);
          } else {
            this.value = new Buffer(value, 'hex');
          }
          break;

        case GP.ASCII:
          if (!this.hasBuffer) {
            this.value = value;
          } else {
            this.value = new Buffer(value, 'ascii');
          }
          break;

        default:
          throw 'Invalid arguments';
      }
    }

    this.length = this.value.length;
  }
}
