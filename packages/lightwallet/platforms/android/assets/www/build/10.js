webpackJsonp([10],{

/***/ 794:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VaultSpendConfirmModule", function() { return VaultSpendConfirmModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_shared_module__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vault_spend_confirm__ = __webpack_require__(882);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_notification_service__ = __webpack_require__(828);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_fee_fee_level_modal__ = __webpack_require__(843);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_shared_fee_fee_service__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_transact_send_easy_send_easy_send_service__ = __webpack_require__(824);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_social_sharing__ = __webpack_require__(820);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_vaults_spend_vault_spend_service__ = __webpack_require__(847);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











/*
  ToDo: Work to get this lazy-loadable as possible.
*/
let VaultSpendConfirmModule = class VaultSpendConfirmModule {
};
VaultSpendConfirmModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__vault_spend_confirm__["a" /* VaultSpendConfirmView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__vault_spend_confirm__["a" /* VaultSpendConfirmView */]),
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_shared_module__["a" /* SharedModule */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
            __WEBPACK_IMPORTED_MODULE_5_merit_shared_notification_service__["a" /* NotificationService */],
            __WEBPACK_IMPORTED_MODULE_8_merit_transact_send_easy_send_easy_send_service__["a" /* EasySendService */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_social_sharing__["a" /* SocialSharing */],
            __WEBPACK_IMPORTED_MODULE_7_merit_shared_fee_fee_service__["a" /* FeeService */],
            __WEBPACK_IMPORTED_MODULE_6_merit_shared_fee_fee_level_modal__["a" /* FeeLevelModal */],
            __WEBPACK_IMPORTED_MODULE_10_merit_vaults_spend_vault_spend_service__["a" /* SpendVaultService */],
        ]
    })
], VaultSpendConfirmModule);

//# sourceMappingURL=vault-spend-confirm.module.js.map

/***/ }),

/***/ 817:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_to_unit_pipe__ = __webpack_require__(818);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_to_fiat_pipe__ = __webpack_require__(819);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(210);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// This module manaages the sending of money.
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_to_unit_pipe__["a" /* ToUnitPipe */],
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_to_fiat_pipe__["a" /* ToFiatPipe */]
        ],
        imports: [],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_to_unit_pipe__["a" /* ToUnitPipe */],
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_to_fiat_pipe__["a" /* ToFiatPipe */],
            __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["b" /* TranslateModule */]
        ]
    })
], SharedModule);

//# sourceMappingURL=shared.module.js.map

/***/ }),

/***/ 818:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToUnitPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__ = __webpack_require__(127);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ToUnitPipe = class ToUnitPipe {
    constructor(configProvider, txFormatProvider) {
        this.configProvider = configProvider;
        this.txFormatProvider = txFormatProvider;
        this.unitCode = this.configProvider.get().wallet.settings.unitCode;
    }
    transform(value, satoshis) {
        return this.txFormatProvider.formatAmountStr(satoshis);
    }
};
ToUnitPipe = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'toUnit' }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__["a" /* TxFormatService */]])
], ToUnitPipe);

//# sourceMappingURL=to-unit.pipe.js.map

/***/ }),

/***/ 819:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToFiatPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_bluebird__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let ToFiatPipe = class ToFiatPipe {
    constructor(configProvider, txFormatProvider) {
        this.configProvider = configProvider;
        this.txFormatProvider = txFormatProvider;
        this.unitCode = this.configProvider.get().wallet.settings.unitCode;
    }
    transform(value, satoshis) {
        return this.txFormatProvider.formatAlternativeStr(satoshis).then((altSr) => {
            return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"](altSr);
        });
    }
};
ToFiatPipe = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'toFiat' }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__["a" /* TxFormatService */]])
], ToFiatPipe);

//# sourceMappingURL=to-fiat.pipe.js.map

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

/***/ 828:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_persistence_service__ = __webpack_require__(68);
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
 * This service allows you to subscribe and unsubscribe
 * from notifications on an object.
 */
let NotificationService = class NotificationService {
    constructor(logger, bwcService, configService, profileService, persistenceService) {
        this.logger = logger;
        this.bwcService = bwcService;
        this.configService = configService;
        this.profileService = profileService;
        this.persistenceService = persistenceService;
        this.errors = this.bwcService.getErrors();
        this.logger.info('Hello Notification Service');
    }
    subscribe(client, subject) {
        let methodPrefix = this.getMethodPrefix(subject);
        if (!subject || !subject.id) {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('Missing subject'));
        }
        //TODO: Rewrite BWC with promises.
        let subCall = __WEBPACK_IMPORTED_MODULE_1_bluebird__["promisify"](client[methodPrefix + 'ConfirmationSubscribe'](subject.id, {}, function () { }));
        return subCall().then((res) => {
            __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](this.persistenceService.setTxConfirmNotification(subject.id, subject));
        });
    }
    /**
     * Returns the method prefix used further down the stack.
     * Today, we only have confirmation events, but it stands to
     * reason that we'll add more in the future.
     * @param subject - TransactionProposal or Referral
     */
    getMethodPrefix(subject) {
        // Switch statements don't work on types yet in TypeScript.  
        // Using ifs for now.
        if (subject) {
            return 'tx';
        }
        if (subject) {
            return 'ref';
        }
        // Should never get here because of union type.  
        let n;
        return n;
    }
};
NotificationService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_persistence_service__["a" /* PersistenceService */]])
], NotificationService);

//# sourceMappingURL=notification.service.js.map

/***/ }),

/***/ 843:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeeLevelModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_fee_fee_service__ = __webpack_require__(212);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let FeeLevelModal = class FeeLevelModal {
    constructor(navParams, feeService, viewCtrl) {
        this.navParams = navParams;
        this.feeService = feeService;
        this.viewCtrl = viewCtrl;
        this.feeOptValues = this.feeService.getFeeOptValues;
        this.network = this.navParams.get('network');
        this.feeLevel = this.navParams.get('feeLevel');
        this.noSave = this.navParams.get('noSave');
        this.customFeePerKB = this.navParams.get('customFeePerKB');
        this.feePerMicrosByte = this.navParams.get('feePerMicrosByte');
    }
    ok() {
        this.viewCtrl.dismiss({
            selectedFee: this.selectedFee.value,
            customFeePerKB: this.customFeePerKB
        });
    }
    checkFees() { }
};
FeeLevelModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/fee/fee-level-modal.html"*/'<ion-header align-title="center" class="bar-royal">\n  <ion-navbar>\n    <ion-title>Merit Network Fee Policy </ion-title>\n  </ion-navbar>\n</ion-header>\n<button ion-button [disabled]="customFeePerKB && !customMicrosPerByte.value" (click)="ok()">\n  OK\n</button>\n\n<ion-content>\n  <div class="box-notification warning" *ngIf="network!=\'livenet\'">\n    Testnet\n  </div>\n  <div class="row selected-fee-level" [hidden]="!feeLevel">\n    <div class="col time" *ngIf="!customFeePerKB">\n      <div class="value">\n        <span *ngIf="avgConfirmationTime">\n          {{avgConfirmationTime}}\n        </span>\n        <span *ngIf="loadingFee">...</span>\n      </div>\n      <span>Average confirmation time</span>\n    </div>\n    <div class="col rate" [ngClass]="{\'separator\': !customFeePerKB}">\n      <div *ngIf="!customFeePerKB">\n        <div class="value">\n          <span *ngIf="feePerMicrosByte && !loadingFee">\n            {{feePerMicrosByte}} micros/byte\n          </span>\n          <span *ngIf="loadingFee">...</span>\n        </div>\n        <span>Current fee rate for this policy</span>\n      </div>\n      <div *ngIf="customFeePerKB">\n        <div class="list">\n          <label class="item item-input">\n            <input type="number" placeholder="{{\'Enter custom fee\'}}" [min]="minFeeAllowed" [max]="maxFeeAllowed" [(ngModel)]="customMicrosPerByte.value"\n              (ngModelChange)="checkFees($event)" [required]="customFeePerKB">\n            <span class="unit">micros/byte</span>\n          </label>\n        </div>\n        <div class="error-fee">\n          <div *ngIf="showError">\n            <i class="icon ion-close-circled"></i>\n            <span>\n              Transactions without fee are not supported.\n            </span>\n          </div>\n          <div *ngIf="showMinWarning || showMaxWarning">\n            <i class="icon ion-alert-circled"></i>\n            <span *ngIf="showMinWarning">\n              Your fee is lower than recommended.\n            </span>\n            <span *ngIf="showMaxWarning">\n              You should not set a fee higher than {{maxFeeRecommended}} micros/byte.\n            </span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class="list" [hidden]="!feeLevel">\n    <label class="item item-input item-select">\n      <div class="input-label">\n        Fee level\n      </div>\n      <ion-item>\n        <ion-label></ion-label>\n        <ion-select [(ngModel)]="selectedFee.value">\n          <ion-option *ngFor="let level of feeOptValues()" [value]="level">{{level}}</ion-option>\n        </ion-select>\n      </ion-item>\n    </label>\n  </div>\n\n</ion-content>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/fee/fee-level-modal.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_shared_fee_fee_service__["a" /* FeeService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], FeeLevelModal);

//# sourceMappingURL=fee-level-modal.js.map

/***/ }),

/***/ 847:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SpendVaultService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_vaults_vaults_service__ = __webpack_require__(505);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let SpendVaultService = class SpendVaultService {
    constructor(bwcService, walletService, logger, profileService, vaultsService) {
        this.bwcService = bwcService;
        this.walletService = walletService;
        this.logger = logger;
        this.profileService = profileService;
        this.vaultsService = vaultsService;
        this.walletClient = null;
        this.bitcore = bwcService.getBitcore();
    }
    spendVault(vault, spendKey, amount, address) {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
            if (!this.walletClient) {
                this.walletClient = walletClient;
            }
            return this.vaultsService.getVaultCoins(walletClient, vault);
        }).then((coins) => {
            const tx = this.walletClient.buildSpendVaultTx(vault, coins, spendKey, amount, address, {});
            console.log("SPEND TX");
            console.log('Plain: ', tx);
            console.log('Serialized: ', tx.serialize());
            return { rawTx: tx.serialize(), network: vault.address.network };
        }).then((tx) => {
            return this.walletClient.broadcastRawTx(tx);
        }).catch((err) => {
            console.log('Error while spending vault:', err);
            throw err;
        });
        ;
    }
};
SpendVaultService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_vaults_vaults_service__["a" /* VaultsService */]])
], SpendVaultService);

//# sourceMappingURL=vault-spend.service.js.map

/***/ }),

/***/ 882:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultSpendConfirmView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_notification_service__ = __webpack_require__(828);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_popup_service__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_shared_fee_fee_service__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_merit_vaults_spend_vault_spend_service__ = __webpack_require__(847);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_merit_transact_send_easy_send_easy_send_service__ = __webpack_require__(824);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














let VaultSpendConfirmView = class VaultSpendConfirmView {
    constructor(configService, navCtrl, navParams, profileService, logger, feeService, walletService, txFormatService, popupService, modalCtrl, notificationService, loadingCtrl, easySendService, bwc, spendVaultService) {
        this.configService = configService;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.profileService = profileService;
        this.logger = logger;
        this.feeService = feeService;
        this.walletService = walletService;
        this.txFormatService = txFormatService;
        this.popupService = popupService;
        this.modalCtrl = modalCtrl;
        this.notificationService = notificationService;
        this.loadingCtrl = loadingCtrl;
        this.easySendService = easySendService;
        this.bwc = bwc;
        this.spendVaultService = spendVaultService;
        this.txData = null;
        this.showAddress = true;
        this.showMerit = true;
        this.coins = [];
        this.logger.info("Hello SendConfirm View");
        this.walletConfig = this.configService.get().wallet;
        this.bitcore = this.bwc.getBitcore();
    }
    async ionViewDidLoad() {
        this.wallets = await this.profileService.getWallets();
        let toAmount = this.navParams.get('toAmount');
        this.walletConfig = this.configService.get().wallet;
        this.wallet = this.navParams.get('wallet');
        this.unitToMicro = this.walletConfig.settings.unitToMicro;
        this.configFeeLevel = this.walletConfig.settings.feeLevel ? this.walletConfig.settings.feeLevel : 'normal';
        this.recipient = this.navParams.get('recipient');
        this.vault = this.navParams.get('vault');
        this.coins = this.navParams.get('coins');
        console.log('vault', this.vault);
        this.txData = {
            toAddress: this.recipient.address,
            txp: {},
            toName: this.recipient.name || '',
            toAmount: toAmount * this.unitToMicro,
        };
        await this.updateAmount();
        this.logger.log('ionViewDidLoad txData', this.txData);
    }
    displayName() {
        if (this.txData.toName) {
            return this.txData.toName;
        }
        return this.txData.toAddress || "no one";
    }
    toggleCurrency() {
        this.showMerit = !this.showMerit;
    }
    updateAmount() {
        if (!this.txData.toAmount)
            return;
        // Amount
        this.dummyFeeReplaceMeWithActualFeeDontBeADummyMerit =
            this.txFormatService.formatAmountStr(this.wallet.getDefaultFee()).split(' ')[0];
        this.txData.amountStr = this.txFormatService.formatAmountStr(this.txData.toAmount);
        this.txData.amountValueStr = this.txData.amountStr.split(' ')[0];
        this.txData.amountUnitStr = this.txData.amountStr.split(' ')[1];
        this.txFormatService.formatAlternativeStr(this.txData.toAmount).then((v) => {
            this.txData.alternativeAmountStr = v;
        });
        this.txFormatService.formatAlternativeStr(this.wallet.getDefaultFee()).then((v) => {
            this.dummyFeeReplaceMeWithActualFeeDontBeADummyUSD = v;
        });
    }
    spend() {
        const network = this.vault.address.network;
        const spendKey = this.bitcore.HDPrivateKey.fromString(this.wallet.credentials.xPrivKey);
        //convert string address to hash buffers
        let whitelist = __WEBPACK_IMPORTED_MODULE_12_lodash__["map"](this.vault.whitelist, (w) => {
            return this.bitcore.Address.fromString(w).toBuffer();
        });
        this.vault.whitelist = whitelist;
        const recepient = this.navParams.get('recipient');
        return this.spendVaultService.spendVault(this.vault, spendKey, this.txData.toAmount, recepient.address).then(() => {
            return this.navCtrl.goToRoot({}).then(() => {
                return this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
            });
        });
    }
    toggleAddress() {
        this.showAddress = !this.showAddress;
    }
    ;
};
// Statics
VaultSpendConfirmView.CONFIRM_LIMIT_USD = 20;
VaultSpendConfirmView.FEE_TOO_HIGH_LIMIT_PER = 15;
VaultSpendConfirmView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'vault-spend-confirm-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/spend/confirm/vault-spend-confirm.html"*/'<ion-header>\n  <ion-navbar color="secondary">\n    <ion-title>Confirm</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <span margin-top>\n\n    <span class="row">\n      <span class="label" text-left translate>Sending</span>\n      <div text-right item-right [style.flex]="1" *ngIf="txData">\n        <span class="amount">{{showMerit ? txData.amountValueStr : txData.alternativeAmountStr}}</span>\n        <button ion-button clear color="primary" (click)="toggleCurrency()">\n            {{showMerit ? "MRT" : "USD"}}\n        </button>\n      </div>\n    </span>\n    <span class="row" *ngIf="txData">\n      <span class="label" text-left translate>To</span>\n      <span item-right text-right [style.flex]="1">\n            {{recipient.name}}\n      </span>\n      <ion-avatar item-right class="btn whitelist-icon" *ngIf="recipient.type == \'wallet\'">\n          <img src="assets/img/icon-wallet.svg">\n      </ion-avatar>\n      <ion-avatar item-right class="btn whitelist-icon" *ngIf="recipient.type == \'vault\'">\n          <ion-icon name="lock"></ion-icon>\n      </ion-avatar>\n    </span>\n    <span class="row" *ngIf="wallet">\n      <span text-left class="label">From</span>\n      <span item-right text-right [style.flex]="1">\n        {{vault.name}}\n      </span>\n      <ion-avatar item-right class="btn whitelist-icon">\n          <ion-icon name="lock"></ion-icon>\n      </ion-avatar>\n    </span>\n    <span class="row">\n      <span class="label" text-left translate>Fee</span>\n      <div text-right item-right [style.flex]="1" *ngIf="txData">\n        <span class="amount">{{showMerit ? dummyFeeReplaceMeWithActualFeeDontBeADummyMerit : dummyFeeReplaceMeWithActualFeeDontBeADummyUSD}}</span>\n        <button ion-button clear color="primary" (click)="toggleCurrency()">\n            {{showMerit ? "MRT" : "USD"}}\n        </button>\n        <span item-right text-right [style.flex]="1" class="fee-rate" *ngIf="txData.txp.feeRatePerStr"> &middot;\n            <i class="ion-alert-circled warn" *ngIf="txData.txp.feeToHigh"></i> &nbsp;\n            <span class="fee-rate" [class.warn]="txData.txp.feeToHigh" translate> {{txData.txp.feeRatePerStr}} of the sending amount </span>\n        </span>\n      </div>\n    </span>\n  </span>\n  <div class="control-buttons">\n    <button ion-button primary margin-top [disabled]="!wallet" [class.enter]="sendStatus" (click)="spend()">\n      <span>Confirm</span>\n    </button>\n  </div>\n</ion-content>\n      \n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/spend/confirm/vault-spend-confirm.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_8_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_9_merit_shared_fee_fee_service__["a" /* FeeService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_transact_tx_format_service__["a" /* TxFormatService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_popup_service__["a" /* PopupService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_5_merit_shared_notification_service__["a" /* NotificationService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_13_merit_transact_send_easy_send_easy_send_service__["a" /* EasySendService */],
        __WEBPACK_IMPORTED_MODULE_10_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_11_merit_vaults_spend_vault_spend_service__["a" /* SpendVaultService */]])
], VaultSpendConfirmView);

//# sourceMappingURL=vault-spend-confirm.js.map

/***/ })

});
//# sourceMappingURL=10.js.map