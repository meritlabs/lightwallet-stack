webpackJsonp([14],{

/***/ 803:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WalletDetailsModule", function() { return WalletDetailsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_details_wallet_details__ = __webpack_require__(894);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_moment__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_shared_module__ = __webpack_require__(817);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







/*
  ToDo: Work to get this lazy-loadable as possible.
*/
let WalletDetailsModule = class WalletDetailsModule {
};
WalletDetailsModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_details_wallet_details__["a" /* WalletDetailsView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_details_wallet_details__["a" /* WalletDetailsView */]),
            __WEBPACK_IMPORTED_MODULE_4_angular2_moment__["MomentModule"],
            __WEBPACK_IMPORTED_MODULE_6_merit_shared_shared_module__["a" /* SharedModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */],
            __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__["a" /* WalletService */]
        ]
    })
], WalletDetailsModule);

//# sourceMappingURL=wallet-details.module.js.map

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

/***/ 894:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletDetailsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let WalletDetailsView = class WalletDetailsView {
    constructor(navCtrl, navParams, walletService, logger) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.walletService = walletService;
        this.logger = logger;
        // We can assume that the wallet data has already been fetched and 
        // passed in from the wallets (list) view.  This enables us to keep
        // things fast and smooth.  We can refresh as needed.
        this.wallet = this.navParams.get('wallet');
        this.logger.info("Inside the wallet-details view.");
        this.logger.info(this.wallet);
    }
    ionViewWillLeave() {
    }
    ionViewWillEnter() {
        this.getWalletHistory();
    }
    ionViewDidLoad() {
        //do something here
    }
    goToBackup() {
        this.logger.info('not implemented yet');
    }
    getWalletHistory(force = false) {
        this.walletService.getTxHistory(this.wallet, { force: force }).then((walletHistory) => {
            this.wallet.completeHistory = this.formatWalletHistory(walletHistory);
        }).catch((err) => {
            this.logger.info(err);
        });
    }
    formatWalletHistory(wh) {
        if (!__WEBPACK_IMPORTED_MODULE_4_lodash__["isEmpty"](wh)) {
            return __WEBPACK_IMPORTED_MODULE_4_lodash__["map"](wh, (h) => {
                if (!__WEBPACK_IMPORTED_MODULE_4_lodash__["isNil"](h) && !__WEBPACK_IMPORTED_MODULE_4_lodash__["isNil"](h.action)) {
                    switch (h.action) {
                        case 'sent':
                            if (h.confirmations == 0) {
                                h.actionStr = 'Sending Payment...';
                            }
                            else {
                                h.actionStr = 'Payment Sent';
                            }
                            break;
                        case 'received':
                            if (h.confirmations == 0) {
                                h.actionStr = 'Receiving Payment...';
                            }
                            else {
                                h.actionStr = 'Payment Received';
                            }
                            break;
                        case 'moved':
                            h.actionStr = 'Moved Merit';
                            break;
                        default:
                            h.actionStr = 'Recent Transaction';
                            break;
                    }
                }
                return h;
            });
        }
        else {
            return [];
        }
    }
    // Belt and suspenders check to be sure that the total number of TXs on the page
    // add up to the total balance in status.  
    txHistoryInSyncWithStatus() {
        return true;
    }
    goToTxDetails(tx) {
        this.navCtrl.push('TxDetailsView', { walletId: this.wallet.credentials.walletId, txId: tx.txid });
    }
    goToEditWallet() {
        this.navCtrl.push('EditWalletView', { wallet: this.wallet });
    }
};
WalletDetailsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'wallet-details-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/wallet-details/wallet-details.html"*/'<ion-header no-border>\n    <ion-navbar>\n      <ion-title>{{wallet.name}}</ion-title>\n      <ion-buttons end>\n            <button ion-button icon-only (click)="goToEditWallet()">\n                <ion-icon name="settings"></ion-icon>\n            </button>\n      </ion-buttons>\n    </ion-navbar>\n\n  </ion-header>\n  \n  <ion-content >\n    <ion-list>\n        <div class="balance-header" (click)="getWalletHistory(true)" [style.background]="wallet.color" [class.default]="!wallet.color">\n            <div class="balance-str">{{ wallet.status.totalBalanceStr }}</div>\n            <div class="balance-alt-str"> {{ wallet.status.totalBalanceAlternativeStr }}</div>\n        </div>\n    </ion-list>\n  \n    <ion-list>\n      <button ion-item *ngFor="let tx of wallet.completeHistory" (click)="goToTxDetails(tx)">\n        <ion-icon item-start>\n          <img src="assets/img/icon-receive-history.svg" *ngIf="tx.action == \'received\'" width="40">\n          <img src="assets/img/icon-sent.svg" *ngIf="tx.action == \'sent\'" width="40">\n          <img src="assets/img/icon-moved.svg" *ngIf="tx.action == \'moved\'" width="40">\n        </ion-icon>\n        <div class="action">{{tx.actionStr}}</div>\n        <div class="detail" item-end>\n          <div class="amount">{{tx.amountStr}}</div>\n          <div class="date">{{tx.time * 1000 | amTimeAgo}}</div>\n        </div>\n      </button>\n    </ion-list>\n  </ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/wallet-details/wallet-details.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */]])
], WalletDetailsView);

//# sourceMappingURL=wallet-details.js.map

/***/ })

});
//# sourceMappingURL=14.js.map