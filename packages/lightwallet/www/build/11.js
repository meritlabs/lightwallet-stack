webpackJsonp([11],{

/***/ 782:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendAmountModule", function() { return SendAmountModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_send_amount_send_amount__ = __webpack_require__(869);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__ = __webpack_require__(808);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_transact_rate_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_transact_send_easy_send_easy_send_service__ = __webpack_require__(824);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__ = __webpack_require__(820);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







/*
  Transact is the most thoughtful name we can think of to define all of
  'primary' actions associated with merit (receiving, sending, primarily).
*/
let SendAmountModule = class SendAmountModule {
};
SendAmountModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_transact_send_amount_send_amount__["a" /* SendAmountView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__["a" /* GravatarModule */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_transact_send_amount_send_amount__["a" /* SendAmountView */])
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4_merit_transact_rate_service__["a" /* RateService */],
            __WEBPACK_IMPORTED_MODULE_5_merit_transact_send_easy_send_easy_send_service__["a" /* EasySendService */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__["a" /* SocialSharing */]
        ]
    })
], SendAmountModule);

//# sourceMappingURL=send-amount.module.js.map

/***/ }),

/***/ 808:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GravatarModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__ = __webpack_require__(811);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// This module manaages the avatar/user-image of a user based on 
// email address.
let GravatarModule = class GravatarModule {
};
GravatarModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__["a" /* GravatarComponent */]
        ],
        imports: [],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__["a" /* GravatarComponent */]
        ]
    })
], GravatarModule);

//# sourceMappingURL=gravatar.module.js.map

/***/ }),

/***/ 811:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GravatarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__ = __webpack_require__(812);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// Used to display friendly images of people who use gravatar.
let GravatarComponent = class GravatarComponent {
    ngOnInit() {
        if (this.email) {
            this.emailHash = __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__["Md5"].hashStr(this.email.toLowerCase() || '').toString();
        }
    }
};
GravatarComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'gravatar',
        inputs: ['name', 'height', 'width', 'email'],
        template: `
  <img  class="gravatar" [alt]="name" [height]="height"  [width]="width" 
  [src]="'https://secure.gravatar.com/avatar/'+emailHash+'.jpg?s='+width+'&d=mm'"> 
`
    })
], GravatarComponent);

//# sourceMappingURL=gravatar.component.js.map

/***/ }),

/***/ 812:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*

TypeScript Md5
==============

Based on work by
* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
* André Cruz: https://github.com/satazor/SparkMD5
* Raymond Hill: https://github.com/gorhill/yamd5.js

Effectively a TypeScrypt re-write of Raymond Hill JS Library

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.


*/
Object.defineProperty(exports, "__esModule", { value: true });
var Md5 = (function () {
    function Md5() {
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    }
    // One time hashing functions
    Md5.hashStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    };
    Md5.hashAsciiStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    };
    Md5._hex = function (x) {
        var hc = Md5.hexChars;
        var ho = Md5.hexOut;
        var n;
        var offset;
        var j;
        var i;
        for (i = 0; i < 4; i += 1) {
            offset = i * 8;
            n = x[i];
            for (j = 0; j < 8; j += 2) {
                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    };
    Md5._md5cycle = function (x, k) {
        var a = x[0];
        var b = x[1];
        var c = x[2];
        var d = x[3];
        // ff()
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        // gg()
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        // hh()
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        // ii()
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    };
    Md5.prototype.start = function () {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(Md5.stateIdentity);
        return this;
    };
    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    Md5.prototype.appendStr = function (str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var code;
        var i;
        for (i = 0; i < str.length; i += 1) {
            code = str.charCodeAt(i);
            if (code < 128) {
                buf8[bufLen++] = code;
            }
            else if (code < 0x800) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            }
            else if (code < 0xD800 || code > 0xDBFF) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if (code > 0x10FFFF) {
                    throw new Error('Unicode standard supports code points up to U+10FFFF');
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if (bufLen >= 64) {
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendAsciiStr = function (str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i;
        var j = 0;
        for (;;) {
            i = Math.min(str.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendByteArray = function (input) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i;
        var j = 0;
        for (;;) {
            i = Math.min(input.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = input[j++];
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.getState = function () {
        var self = this;
        var s = self._state;
        return {
            buffer: String.fromCharCode.apply(null, self._buffer8),
            buflen: self._bufferLength,
            length: self._dataLength,
            state: [s[0], s[1], s[2], s[3]]
        };
    };
    Md5.prototype.setState = function (state) {
        var buf = state.buffer;
        var x = state.state;
        var s = this._state;
        var i;
        this._dataLength = state.length;
        this._bufferLength = state.buflen;
        s[0] = x[0];
        s[1] = x[1];
        s[2] = x[2];
        s[3] = x[3];
        for (i = 0; i < buf.length; i += 1) {
            this._buffer8[i] = buf.charCodeAt(i);
        }
    };
    Md5.prototype.end = function (raw) {
        if (raw === void 0) { raw = false; }
        var bufLen = this._bufferLength;
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var i = (bufLen >> 2) + 1;
        var dataBitsLen;
        this._dataLength += bufLen;
        buf8[bufLen] = 0x80;
        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
        buf32.set(Md5.buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            Md5._md5cycle(this._state, buf32);
            buf32.set(Md5.buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        dataBitsLen = this._dataLength * 8;
        if (dataBitsLen <= 0xFFFFFFFF) {
            buf32[14] = dataBitsLen;
        }
        else {
            var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
            if (matches === null) {
                return;
            }
            var lo = parseInt(matches[2], 16);
            var hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        Md5._md5cycle(this._state, buf32);
        return raw ? this._state : Md5._hex(this._state);
    };
    // Private Static Variables
    Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
    Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    Md5.hexChars = '0123456789abcdef';
    Md5.hexOut = [];
    // Permanent instance is to use for one-call hashing
    Md5.onePassHasher = new Md5();
    return Md5;
}());
exports.Md5 = Md5;
if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    console.error('Md5 self test failed.');
}
//# sourceMappingURL=md5.js.map

/***/ }),

/***/ 820:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SocialSharing; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__ = __webpack_require__(80);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * @name Social Sharing
 * @description
 * Share text, files, images, and links via social networks, sms, and email.
 *
 * For Browser usage check out the Web Share API docs: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#web-share-api
 *
 * @usage
 * ```typescript
 * import { SocialSharing } from '@ionic-native/social-sharing';
 *
 * constructor(private socialSharing: SocialSharing) { }
 *
 * ...
 *
 * // Check if sharing via email is supported
 * this.socialSharing.canShareViaEmail().then(() => {
 *   // Sharing via email is possible
 * }).catch(() => {
 *   // Sharing via email is not possible
 * });
 *
 * // Share via email
 * this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
 *   // Success!
 * }).catch(() => {
 *   // Error!
 * });
 * ```
 */
var SocialSharing = (function (_super) {
    __extends(SocialSharing, _super);
    function SocialSharing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Shares using the share sheet
     * @param message {string} The message you would like to share.
     * @param subject {string} The subject
     * @param file {string|string[]} URL(s) to file(s) or image(s), local path(s) to file(s) or image(s), or base64 data of an image. Only the first file/image will be used on Windows Phone.
     * @param url {string} A URL to share
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.share = function (message, subject, file, url) { return; };
    /**
     * Shares using the share sheet with additional options and returns a result object or an error message (requires plugin version 5.1.0+)
     * @param options {object} The options object with the message, subject, files, url and chooserTitle properties.
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareWithOptions = function (options) { return; };
    /**
     * Checks if you can share via a specific app.
     * @param appName {string} App name or package name. Examples: instagram or com.apple.social.facebook
     * @param message {string}
     * @param subject {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.canShareVia = function (appName, message, subject, image, url) { return; };
    /**
     * Shares directly to Twitter
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaTwitter = function (message, image, url) { return; };
    /**
     * Shares directly to Facebook
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaFacebook = function (message, image, url) { return; };
    /**
     * Shares directly to Facebook with a paste message hint
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @param pasteMessageHint {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaFacebookWithPasteMessageHint = function (message, image, url, pasteMessageHint) { return; };
    /**
     * Shares directly to Instagram
     * @param message {string}
     * @param image {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaInstagram = function (message, image) { return; };
    /**
     * Shares directly to WhatsApp
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaWhatsApp = function (message, image, url) { return; };
    /**
     * Shares directly to a WhatsApp Contact
     * @param receiver {string} Pass phone number on Android, and Addressbook ID (abid) on iOS
     * @param message {string} Message to send
     * @param image {string} Image to send (does not work on iOS
     * @param url {string} Link to send
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaWhatsAppToReceiver = function (receiver, message, image, url) { return; };
    /**
     * Share via SMS
     * @param messge {string} message to send
     * @param phoneNumber {string} Number or multiple numbers seperated by commas
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaSMS = function (messge, phoneNumber) { return; };
    /**
     * Checks if you can share via email
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.canShareViaEmail = function () { return; };
    /**
     * Share via Email
     * @param message {string}
     * @param subject {string}
     * @param to {string[]}
     * @param cc {string[]} Optional
     * @param bcc {string[]} Optional
     * @param files {string|string[]} Optional URL or local path to file(s) to attach
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaEmail = function (message, subject, to, cc, bcc, files) { return; };
    /**
     * Share via AppName
     * @param appName {string} App name or package name. Examples: instagram or com.apple.social.facebook
     * @param message {string}
     * @param subject {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareVia = function (appName, message, subject, image, url) { return; };
    /**
     * defines the popup position before call the share method.
     * @param targetBounds {string} left, top, width, height
     */
    SocialSharing.prototype.setIPadPopupCoordinates = function (targetBounds) { };
    SocialSharing.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    SocialSharing.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 4,
            errorIndex: 5
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "share", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareWithOptions", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 5,
            errorIndex: 6,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "canShareVia", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 3,
            errorIndex: 4,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaTwitter", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 3,
            errorIndex: 4,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaFacebook", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 4,
            errorIndex: 5,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaFacebookWithPasteMessageHint", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaInstagram", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 3,
            errorIndex: 4,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaWhatsApp", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 4,
            errorIndex: 5,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaWhatsAppToReceiver", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaSMS", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "canShareViaEmail", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android'],
            successIndex: 6,
            errorIndex: 7
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Array, Array, Array, Object]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaEmail", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 5,
            errorIndex: 6,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareVia", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            sync: true,
            platforms: ['iOS']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SocialSharing.prototype, "setIPadPopupCoordinates", null);
    SocialSharing = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'SocialSharing',
            plugin: 'cordova-plugin-x-socialsharing',
            pluginRef: 'plugins.socialsharing',
            repo: 'https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin',
            platforms: ['Android', 'Browser', 'iOS', 'Windows', 'Windows Phone']
        })
    ], SocialSharing);
    return SocialSharing;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 824:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EasySendService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_social_sharing__ = __webpack_require__(820);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let EasySendService = class EasySendService {
    constructor(socialSharing) {
        this.socialSharing = socialSharing;
    }
    createEasySendScriptHash(wallet) {
        // TODO: get a passphrase from the user
        let opts = {
            network: wallet.network,
            unlockCode: wallet.shareCode,
            passphrase: ''
        };
        return wallet.buildEasySendScript(opts).then((easySend) => {
            let unlockScriptOpts = {
                unlockCode: wallet.shareCode,
                address: easySend.script.toAddress().toString(),
                network: opts.network
            };
            return wallet.unlockAddress(unlockScriptOpts).then(() => {
                let unlockRecipientOpts = {
                    unlockCode: wallet.shareCode,
                    address: easySend.receiverPubKey.toAddress().toString(),
                    network: opts.network
                };
                return wallet.unlockAddress(unlockRecipientOpts);
            }).then(() => {
                return __WEBPACK_IMPORTED_MODULE_0_bluebird__["resolve"](easySend);
            });
        }).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"](new Error('error building easysend script' + err));
        });
    }
    sendSMS(phoneNumber, amountMrt, url) {
        let msg = `Here is ${amountMrt} Merit.  Click here to redeem: ${url}`;
        if (msg.length > 160) {
            // TODO: Find a way to properly split the URL across two Messages, if needed.
            const msg1 = `I just sent you ${amountMrt} Merit.  Merit is a new Digital Currency.  `;
            const msg2 = url;
            // HACK: 
            msg = msg2;
        }
        return __WEBPACK_IMPORTED_MODULE_0_bluebird__["resolve"](this.socialSharing.shareViaSMS(msg, phoneNumber)).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"](new Error('error sending sms: ' + err));
        });
    }
    sendEmail(emailAddress, amountMrt, url) {
        return __WEBPACK_IMPORTED_MODULE_0_bluebird__["resolve"](this.socialSharing.canShareViaEmail()).then(() => {
            const message = `I just sent you ${amountMrt} Merit!  Merit is a new digital currency, and if you don't have a Merit Wallet yet, you can easily make one to claim the money. \n \n Here is the link to claim the Merit: \n \n ${url}`;
            return this.socialSharing.shareViaEmail(message, `Here is ${amountMrt} Merit!`, [emailAddress]);
        }).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"](new Error('error sending email: ' + err));
        });
    }
};
EasySendService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_native_social_sharing__["a" /* SocialSharing */]])
], EasySendService);

//# sourceMappingURL=easy-send.service.js.map

/***/ }),

/***/ 869:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendAmountView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_transact_rate_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_shared_fee_fee_service__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_merit_transact_send_easy_send_easy_send_service__ = __webpack_require__(824);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_merit_transact_send_easy_send_easy_send_model__ = __webpack_require__(870);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















let SendAmountView = SendAmountView_1 = class SendAmountView {
    constructor(navCtrl, navParams, logger, profileService, configService, modalCtrl, rateService, txFormatService, sanitizer, feeService, walletService, easySendService, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.profileService = profileService;
        this.configService = configService;
        this.modalCtrl = modalCtrl;
        this.rateService = rateService;
        this.txFormatService = txFormatService;
        this.sanitizer = sanitizer;
        this.feeService = feeService;
        this.walletService = walletService;
        this.easySendService = easySendService;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.lastAmount = -1;
        this.feeIncluded = false;
        this.availableAmount = { value: 0, formatted: '' };
        this.LENGTH_EXPRESSION_LIMIT = 19;
        this.SMALL_FONT_SIZE_LIMIT = 10;
        this.availableUnits = [];
        this.unitIndex = 0;
        this.reNr = /^[1234567890\.]$/;
        this.reOp = /^[\*\+\-\/]$/;
        this.createTxpDebounce = __WEBPACK_IMPORTED_MODULE_2_lodash__["debounce"]((dryRun) => {
            this.createTxp(dryRun);
        }, 1000);
    }
    ionViewDidLoad() {
        this.loading = true;
        return this.profileService.hasFunds().then((hasFunds) => {
            this.hasFunds = hasFunds;
            this.contact = this.navParams.get('contact');
            this.sending = this.navParams.get('sending');
            this.displayName = !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](this.contact.name) ? this.contact.name.formatted : this.contact.meritAddresses[0].address;
            this.populateSendingOptions();
            this.profileService.getWallets().then((wallets) => {
                this.wallets = wallets;
                if (this.wallets && this.wallets[0]) {
                    this.wallet = this.wallets[0];
                }
                this.getAvailableAmount().then((amount) => {
                    this.availableAmount = amount;
                    if (this.navParams.get('amount')) {
                        this.amount = this.rateService.microsToMrt(this.navParams.get('amount'));
                        this.updateTxData();
                    }
                });
                this.loading = false;
            });
            this.availableUnits = [
                this.configService.get().wallet.settings.unitCode.toUpperCase(),
                this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
            ];
            this.amountCurrency = this.availableUnits[0];
        });
    }
    populateSendingOptions() {
        let empty = {
            sendMethod: '',
            meritAddress: '',
            email: '',
            phoneNumber: '',
            label: '',
        };
        this.sendingOptions = __WEBPACK_IMPORTED_MODULE_2_lodash__["concat"](__WEBPACK_IMPORTED_MODULE_2_lodash__["map"](this.contact.meritAddresses, (addrObject) => {
            return __WEBPACK_IMPORTED_MODULE_2_lodash__["defaults"]({
                sendMethod: 'address',
                meritAddress: addrObject.address,
                label: `Merit: ${addrObject.address}`
            }, empty);
        }), __WEBPACK_IMPORTED_MODULE_2_lodash__["map"](this.contact.emails, (emailObj) => {
            return __WEBPACK_IMPORTED_MODULE_2_lodash__["defaults"]({
                sendMethod: 'email',
                email: emailObj.value,
                label: `Email:  ${emailObj.value}`
            }, empty);
        }), __WEBPACK_IMPORTED_MODULE_2_lodash__["map"](this.contact.phoneNumbers, (phoneNumberObj) => {
            return __WEBPACK_IMPORTED_MODULE_2_lodash__["defaults"]({
                sendMethod: 'sms',
                phoneNumber: phoneNumberObj.value,
                label: `SMS:  ${phoneNumberObj.value}`
            }, empty);
        }));
        this.recipient = __WEBPACK_IMPORTED_MODULE_2_lodash__["head"](this.sendingOptions);
    }
    ;
    selectWallet() {
        let modal = this.modalCtrl.create('SelectWalletModal', { selectedWallet: this.wallet, availableWallets: this.wallets });
        modal.present();
        modal.onDidDismiss((wallet) => {
            if (wallet)
                this.wallet = wallet;
            this.getAvailableAmount().then((amount) => {
                this.availableAmount = amount;
                this.updateTxData();
            });
        });
    }
    selectSendingOption() {
        let modal = this.modalCtrl.create('SelectSendingOptionModal', {
            selectedSendingOption: this.recipient,
            sendingOptions: this.sendingOptions
        });
        modal.present();
        modal.onDidDismiss((recipient) => {
            if (recipient)
                this.recipient = recipient;
            this.updateTxData();
        });
    }
    toggleCurrency() {
        this.amountCurrency = this.amountCurrency == this.availableUnits[0] ? this.availableUnits[1] : this.availableUnits[0];
        this.updateAmountMerit();
        this.updateTxData();
        this.getAvailableAmount().then((amount) => {
            this.availableAmount = amount;
        });
    }
    toggleFeeIncluded() {
        this.updateTxData();
    }
    updateAmountMerit() {
        if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
            this.amountMerit = this.amount;
        }
        else {
            this.amountMerit = this.rateService.fromFiatToMerit(this.amount, this.amountCurrency);
        }
    }
    checkFontSize() {
        if (this.amount && this.amount.toString().length >= this.SMALL_FONT_SIZE_LIMIT)
            this.smallFont = true;
        else
            this.smallFont = false;
    }
    ;
    processAmount(value) {
        if (value != this.lastAmount) {
            this.lastAmount = value;
            this.updateTxData();
        }
    }
    ;
    sendAllowed() {
        return (this.amount > 0
            && this.amount <= this.availableAmount.value
            && !__WEBPACK_IMPORTED_MODULE_2_lodash__["isNil"](this.txData.txp));
    }
    toConfirm() {
        let loadingSpinner = this.loadingCtrl.create({
            content: "Preparing transaction...",
            dismissOnPageChange: true
        });
        loadingSpinner.present();
        let dryRun = false;
        this.createTxp(dryRun).then(() => {
            loadingSpinner.dismiss();
            this.navCtrl.push('SendConfirmView', { txData: this.txData });
        }).catch(() => {
            loadingSpinner.dismiss();
        });
    }
    toBuyAndSell() {
        this.navCtrl.push('BuyAndSellView');
    }
    getAvailableAmount() {
        return new Promise((resolve, reject) => {
            let currency = this.amountCurrency.toUpperCase();
            if (!this.wallet || !this.wallet.status)
                return resolve({ value: 0, formatted: '0.0 ' + currency });
            let amount = this.wallet.status.spendableAmount;
            if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
                let formatted = this.txFormatService.formatAmount(amount);
                return resolve({ value: this.rateService.microsToMrt(amount), formatted: formatted + ' ' + currency });
            }
            else {
                let fiatAmount = this.rateService.fromMicrosToFiat(amount, currency);
                return resolve({ value: fiatAmount, formatted: fiatAmount.toFixed(2) + ' ' + currency });
            }
        });
    }
    sanitizePhotoUrl(url) {
        return this.sanitizer.sanitize(__WEBPACK_IMPORTED_MODULE_0__angular_core__["SecurityContext"].URL, url);
    }
    updateTxData() {
        this.updateAmountMerit();
        this.feeCalcError = null;
        this.feeMrt = null;
        this.feePercent = null;
        this.txData = {
            txp: null,
            wallet: this.wallet,
            amount: this.rateService.mrtToMicro(this.amountMerit),
            feeAmount: null,
            totalAmount: this.rateService.mrtToMicro(this.amountMerit),
            recipient: this.recipient,
            feeIncluded: this.feeIncluded
        };
        if (!this.txData.amount) {
            return this.createTxpDebounce.cancel();
        }
        ;
        if (this.txData.amount > this.rateService.mrtToMicro(this.availableAmount.value)) {
            this.feeCalcError = 'Amount is too big';
            return this.createTxpDebounce.cancel();
        }
        let dryRun = true;
        this.createTxpDebounce(dryRun);
    }
    createTxp(dryRun) {
        return this.feeService.getFeeRate(this.wallet.network, SendAmountView_1.FEE_LEVEL).then((feeRate) => {
            let data = {
                toAddress: this.txData.recipient.meritAddress,
                toName: this.txData.recipient.name || '',
                toAmount: this.txData.amount,
                allowSpendUnconfirmed: SendAmountView_1.ALLOW_UNCONFIRMED,
                feeLevelName: SendAmountView_1.FEE_LEVEL
            };
            let getEasyData = () => {
                return new Promise((resolve, reject) => {
                    if (this.recipient.sendMethod != 'address') {
                        return this.easySendService.createEasySendScriptHash(this.txData.wallet).then((easySend) => {
                            easySend.script.isOutput = true;
                            this.txData.easySendURL = Object(__WEBPACK_IMPORTED_MODULE_14_merit_transact_send_easy_send_easy_send_model__["a" /* easySendURL */])(easySend);
                            return resolve({
                                script: easySend.script,
                                toAddress: easySend.script.toAddress().toString()
                            });
                        });
                    }
                    else {
                        return resolve({});
                    }
                });
            };
            return getEasyData().then((easyData) => {
                data = Object.assign(data, easyData);
                return this.getTxp(__WEBPACK_IMPORTED_MODULE_2_lodash__["clone"](data), this.txData.wallet, dryRun).then((txpOut) => {
                    txpOut.feeStr = this.txFormatService.formatAmountStr(txpOut.fee);
                    return this.txFormatService.formatAlternativeStr(txpOut.fee).then((v) => {
                        txpOut.alternativeFeeStr = v;
                        let percent = (txpOut.fee / (txpOut.amount + txpOut.fee) * 100);
                        let precision = 1;
                        if (percent > 0) {
                            while (percent * Math.pow(10, precision) < 1) {
                                precision++;
                            }
                        }
                        precision++; //showing two valued digits
                        txpOut.feePercent = percent.toFixed(precision) + '%';
                        this.feePercent = txpOut.feePercent;
                        this.txData.feeAmount = txpOut.fee;
                        this.feeMrt = this.rateService.microsToMrt(txpOut.fee);
                        this.feeFiat = this.rateService.fromMicrosToFiat(txpOut.fee, this.availableUnits[1]);
                        this.txData.txp = txpOut;
                    }).catch((err) => {
                        this.toastCtrl.create({
                            message: err,
                            cssClass: __WEBPACK_IMPORTED_MODULE_13_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                        }).present();
                    });
                });
            });
        });
    }
    /**
     * Returns a promises of a TXP.
     * TODO: TxP type should be created.
     */
    getTxp(tx, wallet, dryRun) {
        return new Promise((resolve, reject) => {
            // ToDo: use a credential's (or fc's) function for this
            if (tx.description && !wallet.credentials.sharedEncryptingKey) {
                return reject('Need a shared encryption key to add message!');
            }
            if (tx.toAmount > Number.MAX_SAFE_INTEGER) {
                return reject("The amount is too big.  Because, Javascript.");
            }
            let txp = {};
            if (tx.script) {
                txp.outputs = [{
                        'script': tx.script.toHex(),
                        'toAddress': tx.toAddress,
                        'amount': tx.toAmount,
                        'message': tx.description
                    }];
                txp.addressType = 'P2SH';
            }
            else {
                txp.outputs = [{
                        'toAddress': tx.toAddress,
                        'amount': tx.toAmount,
                        'message': tx.description
                    }];
            }
            if (tx.sendMaxInfo) {
                txp.inputs = tx.sendMaxInfo.inputs;
                txp.fee = tx.sendMaxInfo.fee;
            }
            else {
                if (this.txData.usingCustomFee) {
                    txp.feePerKb = tx.feeRate;
                }
                else
                    txp.feeLevel = tx.feeLevel;
            }
            txp.message = tx.description;
            if (tx.paypro) {
                txp.payProUrl = tx.paypro.url;
            }
            txp.excludeUnconfirmedUtxos = !tx.allowSpendUnconfirmed;
            if (!dryRun) {
                txp.dryRun = dryRun;
                if (this.feeIncluded) {
                    txp.fee = this.txData.feeAmount;
                    txp.inputs = this.txData.txp.inputs;
                    txp.outputs[0].amount = this.txData.amount - this.txData.feeAmount;
                }
            }
            return this.walletService.createTx(wallet, txp).then((ctxp) => {
                return resolve(ctxp);
            }).catch((err) => {
                //TODO get errors from server response
                this.feeCalcError = 'Unknown error';
            });
        });
    }
};
SendAmountView.FEE_LEVEL = 'normal'; //todo make selectable
SendAmountView.ALLOW_UNCONFIRMED = true; //obtain from settings
SendAmountView.FEE_TOO_HIGH_LIMIT_PER = 15;
SendAmountView = SendAmountView_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'send-amount-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/transact/send/amount/send-amount.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Amount</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n\n    <span *ngIf="wallet && hasFunds" margin-top>\n\n         <div class="row" margin-bottom>\n             <span class="label" text-left>Amount</span>\n             <input type="number"\n                    [style.flex]="1"\n                    text-right\n                    pattern="[0-9\.]"\n                    [(ngModel)]="amount"\n                    (ngModelChange)="processAmount($event)"\n                    [placeholder]="\'Enter sending amount\'">\n\n             <button ion-button clear color="primary" (click)="toggleCurrency()">\n                 {{amountCurrency}}\n             </button>\n         </div>\n\n\n        <span class="row">\n            <span class="label" text-left>Recipient</span>\n            <span text-right [style.flex]="1" padding-right >\n                {{ displayName | slice:0:15}}\n                <span class="avatar">\n                    <img [src]="sanitizePhotoUrl(contact.photos[0].value)" *ngIf="contact.photos.length">\n                    <gravatar class="send-gravatar"\n                              [name]="contact.name.formatted" width="30" height="30"\n                              [email]="contact.emails[0] ? contact.emails[0].value : \'\'" *ngIf="!contact.photos.length"></gravatar>\n                </span>\n            </span>\n        </span>\n\n\n        <div class="row">\n            <span text-left class="label">Send via</span>\n            <span item-right text-right [style.flex]="1" (click)="selectSendingOption()" padding-right>\n                {{recipient.label}}\n            </span>\n        </div>\n\n        <div class="label" class="row" (click)="selectWallet()">\n            <span text-left class="label">From</span>\n            <span item-right text-right [style.flex]="1">\n                {{wallet.name || wallet._id}} <span *ngIf="availableAmount">({{ availableAmount.formatted}})</span>\n                <button ion-button icon-only clear color="primary" class="wallet-button">\n                    <i class="wallet-icon" item-start [class.locked]="wallet.locked" [class.default]="!wallet.color" [style.background]="wallet.color">\n                        <img src="assets/img/icon-wallet.svg">\n                    </i>\n                </button>\n            </span>\n        </div>\n\n        <div class="row">\n            <span class="label" text-left>Fee <span *ngIf="feePercent">({{feePercent}})</span></span>\n            <span text-right [style.flex]="1" padding-right>\n\n                <ion-spinner *ngIf="amount && !feeMrt && !feeCalcError" ></ion-spinner>\n                <span *ngIf="!amount">0.0</span>\n                <span *ngIf="amount && feeMrt">\n                    <span *ngIf="amountCurrency == \'MRT\'">{{feeMrt}}</span>\n                    <span *ngIf="amountCurrency != \'MRT\'">{{feeFiat}}</span>\n                    {{amountCurrency}}\n                </span>\n                <span *ngIf="feeCalcError" class="error">{{feeCalcError}}</span>\n\n            </span>\n        </div>\n        <div class="row">\n            <span class="label" text-left>Recipient pays fee.</span>\n            <span [style.flex]="1">\n\n            </span>\n            <div class="toggle-wrapper">\n                <ion-toggle [(ngModel)]="feeIncluded" (ionChange)="toggleFeeIncluded($event)"></ion-toggle>\n            </div>\n        </div>\n\n\n\n\n        <div class="control-buttons">\n            <button ion-button primary margin-top (click)="toConfirm()" [disabled]="!sendAllowed()" >Send</button>\n        </div>\n\n    </span>\n\n    <span *ngIf="!loading && !hasFunds">\n        <div text-center padding>Before sending Merit you should buy some!</div>\n        <div class="control-buttons">\n            <button ion-button primary margin-top (click)="toBuyAndSell()">Buy Merit</button>\n        </div>\n    </span>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/transact/send/amount/send-amount.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_6_merit_transact_rate_service__["a" /* RateService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_transact_tx_format_service__["a" /* TxFormatService */],
        __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser__["c" /* DomSanitizer */],
        __WEBPACK_IMPORTED_MODULE_9_merit_shared_fee_fee_service__["a" /* FeeService */],
        __WEBPACK_IMPORTED_MODULE_10_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_11_merit_transact_send_easy_send_easy_send_service__["a" /* EasySendService */],
        __WEBPACK_IMPORTED_MODULE_12_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */]])
], SendAmountView);

var SendAmountView_1;
//# sourceMappingURL=send-amount.js.map

/***/ }),

/***/ 870:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return easySendURL; });
let easySendURL = (es) => {
    return `https://merit.app.link/` +
        `?se=${es.secret}` +
        `&sk=${es.senderPubKey}` +
        `&sn=${es.senderName}` +
        `&bt=${es.blockTimeout}` +
        `&uc=${es.unlockCode}`;
};
//# sourceMappingURL=easy-send.model.js.map

/***/ })

});
//# sourceMappingURL=11.js.map