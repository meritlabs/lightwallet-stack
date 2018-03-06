webpackJsonp([6],{

/***/ 762:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkViewModule", function() { return NetworkViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_community_network_network__ = __webpack_require__(849);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_clipboard__ = __webpack_require__(825);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_clip__ = __webpack_require__(830);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__ = __webpack_require__(820);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_wallets_wallet_service__ = __webpack_require__(126);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








let NetworkViewModule = class NetworkViewModule {
};
NetworkViewModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_community_network_network__["a" /* NetworkView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module__["MomentModule"],
            __WEBPACK_IMPORTED_MODULE_5_ng2_clip__["a" /* ClipModule */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_community_network_network__["a" /* NetworkView */]),
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__["a" /* SocialSharing */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_clipboard__["a" /* Clipboard */],
            __WEBPACK_IMPORTED_MODULE_7_merit_wallets_wallet_service__["a" /* WalletService */]
        ]
    })
], NetworkViewModule);

//# sourceMappingURL=network.module.js.map

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

/***/ 825:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Clipboard; });
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
 * @name Clipboard
 * @description
 * Clipboard management plugin for Cordova that supports iOS, Android, and Windows Phone 8.
 *
 *
 * @usage
 * ```typescript
 * import { Clipboard } from '@ionic-native/clipboard';
 *
 * constructor(private clipboard: Clipboard) { }
 *
 * ...
 *
 *
 * this.clipboard.copy('Hello world');
 *
 * this.clipboard.paste().then(
 *    (resolve: string) => {
 *       alert(resolve);
 *     },
 *     (reject: string) => {
 *       alert('Error: ' + reject);
 *     }
 *   );
 * ```
 */
var Clipboard = (function (_super) {
    __extends(Clipboard, _super);
    function Clipboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Copies the given text
     * @param {string} text Text that gets copied on the system clipboard
     * @returns {Promise<any>} Returns a promise after the text has been copied
     */
    Clipboard.prototype.copy = function (text) { return; };
    /**
     * Pastes the text stored in clipboard
     * @returns {Promise<any>} Returns a promise after the text has been pasted
     */
    Clipboard.prototype.paste = function () { return; };
    Clipboard.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Clipboard.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Clipboard.prototype, "copy", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Clipboard.prototype, "paste", null);
    Clipboard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'Clipboard',
            plugin: 'cordova-clipboard',
            pluginRef: 'cordova.plugins.clipboard',
            repo: 'https://github.com/ihadeed/cordova-clipboard',
            platforms: ['Android', 'iOS', 'Windows Phone 8']
        })
    ], Clipboard);
    return Clipboard;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 830:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src__ = __webpack_require__(831);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__src__["a"]; });

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 831:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClipModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clip_directive__ = __webpack_require__(832);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ClipModule = ClipModule_1 = (function () {
    function ClipModule() {
    }
    ClipModule.forRoot = function () {
        return {
            ngModule: ClipModule_1
        };
    };
    return ClipModule;
}());
ClipModule = ClipModule_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1__clip_directive__["a" /* ClipDirective */]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1__clip_directive__["a" /* ClipDirective */]
        ]
    })
], ClipModule);

var ClipModule_1;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 832:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClipDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_clipboard__ = __webpack_require__(833);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_clipboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_clipboard__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ClipDirective = (function () {
    function ClipDirective(_ele) {
        this._ele = _ele;
        this.content = '';
        this.onClip = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    ClipDirective.prototype.ngOnInit = function () {
        var _this = this;
        var option = {
            text: function (ele) {
                return _this.content;
            }
        };
        this.clipboard = new __WEBPACK_IMPORTED_MODULE_1_clipboard__(this._ele.nativeElement, option);
        this.clipboard.on('success', function () {
            _this.onClip.emit(true);
        })
            .on('error', function () {
            _this.onClip.emit(false);
        });
    };
    ClipDirective.prototype.ngOnDestroy = function () {
        if (this.clipboard) {
            this.clipboard.destroy();
        }
    };
    return ClipDirective;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('clip'),
    __metadata("design:type", String)
], ClipDirective.prototype, "content", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], ClipDirective.prototype, "onClip", void 0);
ClipDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
        selector: '[clip]'
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
], ClipDirective);

//# sourceMappingURL=clip.directive.js.map

/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(834), __webpack_require__(836), __webpack_require__(837)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});

/***/ }),

/***/ 834:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(835)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});

/***/ }),

/***/ 835:
/***/ (function(module, exports) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ }),

/***/ 836:
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),

/***/ 837:
/***/ (function(module, exports, __webpack_require__) {

var is = __webpack_require__(838);
var delegate = __webpack_require__(839);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),

/***/ 838:
/***/ (function(module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(840);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),

/***/ 840:
/***/ (function(module, exports) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),

/***/ 849:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NetworkView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_clipboard__ = __webpack_require__(825);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__ = __webpack_require__(820);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_merit_shared_fiat_amount_model__ = __webpack_require__(209);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














// Network View 
// Part of the Community Tab.
let NetworkView = class NetworkView {
    constructor(navCtrl, navParams, profileService, clipboard, toastCtrl, socialSharing, walletService, txFormatService, logger, zone) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.profileService = profileService;
        this.clipboard = clipboard;
        this.toastCtrl = toastCtrl;
        this.socialSharing = socialSharing;
        this.walletService = walletService;
        this.txFormatService = txFormatService;
        this.logger = logger;
        this.zone = zone;
        this.displayWallets = [];
    }
    // Ensure that the wallets are loaded into the view on first load.
    ionViewDidLoad() {
        this.profileService.getWallets().then((wallets) => {
            let newDisplayWallets = [];
            __WEBPACK_IMPORTED_MODULE_11_lodash__["each"](wallets, (wallet) => {
                // The wallet client will already have the below information.
                let filteredWallet = __WEBPACK_IMPORTED_MODULE_11_lodash__["pick"](wallet, "id", "wallet", "name", "locked", "color", "shareCode");
                this.logger.info("FilteredWallet: ", filteredWallet);
                newDisplayWallets.push(filteredWallet);
            });
            this.displayWallets = newDisplayWallets;
            this.logger.info("DisplayWallets after ionViewLoad: ", this.displayWallets);
        });
    }
    // On each enter, let's update the network data.  
    ionViewDidEnter() {
        this.updateInfo();
    }
    doRefresh(refresher) {
        this.updateInfo().then(() => {
            refresher.complete();
        }).catch((err) => {
            refresher.complete();
        });
    }
    formatNetworkInfo(wallets) {
        let formatPromises = [];
        let newDWallets = [];
        return __WEBPACK_IMPORTED_MODULE_9_bluebird__["each"](wallets, (dWallet) => {
            if (!__WEBPACK_IMPORTED_MODULE_11_lodash__["isNil"](dWallet.totalNetworkValueMicro)) {
                dWallet.totalNetworkValueMerit = this.txFormatService.parseAmount(dWallet.totalNetworkValueMicro, 'micros').amountUnitStr;
                formatPromises.push(this.txFormatService.formatToUSD(dWallet.totalNetworkValueMicro).then((usdAmount) => {
                    dWallet.totalNetworkValueFiat = new __WEBPACK_IMPORTED_MODULE_12_merit_shared_fiat_amount_model__["a" /* FiatAmount */](+usdAmount).amountStr;
                    return __WEBPACK_IMPORTED_MODULE_9_bluebird__["resolve"]();
                }));
            }
            if (!__WEBPACK_IMPORTED_MODULE_11_lodash__["isNil"](dWallet.miningRewardsMicro)) {
                dWallet.miningRewardsMerit = this.txFormatService.parseAmount(dWallet.miningRewardsMicro, 'micros').amountUnitStr;
                formatPromises.push(this.txFormatService.formatToUSD(dWallet.miningRewardsMicro).then((usdAmount) => {
                    dWallet.miningRewardsFiat = new __WEBPACK_IMPORTED_MODULE_12_merit_shared_fiat_amount_model__["a" /* FiatAmount */](+usdAmount).amountStr;
                    return __WEBPACK_IMPORTED_MODULE_9_bluebird__["resolve"]();
                }));
            }
            if (!__WEBPACK_IMPORTED_MODULE_11_lodash__["isNil"](dWallet.ambassadorRewardsMicro)) {
                dWallet.ambassadorRewardsMerit = this.txFormatService.parseAmount(dWallet.ambassadorRewardsMicro, 'micros').amountUnitStr;
                formatPromises.push(this.txFormatService.formatToUSD(dWallet.ambassadorRewardsMicro).then((usdAmount) => {
                    dWallet.ambassadorRewardsFiat = new __WEBPACK_IMPORTED_MODULE_12_merit_shared_fiat_amount_model__["a" /* FiatAmount */](+usdAmount).amountStr;
                    return __WEBPACK_IMPORTED_MODULE_9_bluebird__["resolve"]();
                }));
            }
            return __WEBPACK_IMPORTED_MODULE_9_bluebird__["all"](formatPromises).then(() => {
                newDWallets.push(dWallet);
            });
        }).then(() => {
            return __WEBPACK_IMPORTED_MODULE_9_bluebird__["resolve"](newDWallets);
        });
    }
    updateInfo() {
        return this.profileService.getWallets().then((wallets) => {
            return __WEBPACK_IMPORTED_MODULE_9_bluebird__["map"](wallets, (wallet) => {
                let filteredWallet = __WEBPACK_IMPORTED_MODULE_11_lodash__["pick"](wallet, "id", "wallet", "name", "locked", "color", "shareCode", "totalNetworkValue");
                return this.walletService.getANV(wallet).then((anv) => {
                    filteredWallet.totalNetworkValueMicro = anv;
                }).then(() => {
                    return this.walletService.getRewards(wallet).then((data) => {
                        // If we cannot properly fetch data, let's return wallets as-is.
                        if (data && !__WEBPACK_IMPORTED_MODULE_11_lodash__["isNil"](data.mining)) {
                            filteredWallet.miningRewardsMicro = data.mining;
                        }
                        if (data && !__WEBPACK_IMPORTED_MODULE_11_lodash__["isNil"](data.mining)) {
                            filteredWallet.ambassadorRewardsMicro = data.ambassador;
                        }
                        return filteredWallet;
                    });
                });
            }).then((processedWallets) => {
                return this.formatNetworkInfo(processedWallets).then((readyForDisplay) => {
                    this.zone.run(() => {
                        this.displayWallets = readyForDisplay;
                    });
                });
            });
        }).catch((err) => {
            this.toastCtrl.create({
                message: err,
                cssClass: __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
    }
    copyToClipboard(code) {
        this.clipboard.copy(code);
        this.toastCtrl.create({
            message: 'Copied to clipboard',
            cssClass: __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__["a" /* ToastConfig */].CLASS_MESSAGE
        }).present();
    }
    shareCode(code) {
        this.socialSharing.share('My invite code to use Merit: ' + code);
    }
    shareAddress(address) {
        this.socialSharing.share('merit' + address);
    }
};
NetworkView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-network',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/community/network/network.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Your Network</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)" (onpull)="{}">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n\n    <ion-card *ngFor="let wallet of displayWallets">\n        <ion-card-header>\n            <i class="wallet-icon" [class.locked]="wallet.locked" [class.default]="!wallet.color" [style.background]="wallet.color">\n                <img src="assets/img/icon-wallet.svg">\n            </i>\n            {{wallet.name}}\n        </ion-card-header>\n\n        <ion-item>\n            <ion-label>Invite Code</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.shareCode">\n\n                    <span (click)="copyToClipboard(wallet.shareCode)" [clip]="wallet.shareCode">{{wallet.shareCode | slice:0:10 }}</span>\n\n                    <button ion-button icon-only clear color="primary" (click)="shareAddress(wallet.shareCode)">\n                        <ion-icon name="share"></ion-icon>\n                    </button>\n                </span>\n                <span *ngIf="!wallet.shareCode">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n\n\n        <ion-item-divider translate>\n            Network Size\n        </ion-item-divider>\n        <ion-item>\n            <ion-label>MRT</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.totalNetworkValueMerit">{{wallet.totalNetworkValueMerit}}</span>\n                <span *ngIf="!wallet.totalNetworkValueMerit">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n        <ion-item>\n            <ion-label>USD</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.totalNetworkValueFiat">{{wallet.totalNetworkValueFiat}}</span>\n                <span *ngIf="!wallet.totalNetworkValueFiat">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n\n        <ion-item-divider translate>\n            Mining Rewards\n        </ion-item-divider>\n\n        <ion-item>\n            <ion-label>MRT</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.miningRewardsMerit">\n                    {{wallet.miningRewardsMerit}}\n                </span>\n                <span *ngIf="!wallet.miningRewardsMerit">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n        <ion-item>\n            <ion-label>USD</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.miningRewardsFiat">\n                    {{wallet.miningRewardsFiat}}\n                </span>\n                <span *ngIf="!wallet.miningRewardsFiat">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n\n        <ion-item-divider translate>\n            Ambassador Rewards\n        </ion-item-divider>\n\n        <ion-item>\n            <ion-label>MRT</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.ambassadorRewardsMerit">\n                    {{wallet.ambassadorRewardsMerit}}\n                </span>\n                <span *ngIf="!wallet.ambassadorRewardsMerit">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n        <ion-item>\n            <ion-label>USD</ion-label>\n            <ion-label item-right text-right>\n                <span *ngIf="wallet.ambassadorRewardsFiat">\n                    {{wallet.ambassadorRewardsFiat}}\n                </span>\n                <span *ngIf="!wallet.ambassadorRewardsFiat">\n                    <ion-spinner></ion-spinner>\n                </span>\n            </ion-label>\n        </ion-item>\n    </ion-card>\n\n\n</ion-content>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/community/network/network.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_clipboard__["a" /* Clipboard */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__["a" /* SocialSharing */],
        __WEBPACK_IMPORTED_MODULE_7_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_transact_tx_format_service__["a" /* TxFormatService */],
        __WEBPACK_IMPORTED_MODULE_10_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]])
], NetworkView);

//# sourceMappingURL=network.js.map

/***/ })

});
//# sourceMappingURL=6.js.map