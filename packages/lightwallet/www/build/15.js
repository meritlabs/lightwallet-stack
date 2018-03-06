webpackJsonp([15],{

/***/ 802:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TxDetailsViewModule", function() { return TxDetailsViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_tx_details_tx_details__ = __webpack_require__(893);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_shared_module__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_moment_moment_module__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_moment_moment_module___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular2_moment_moment_module__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







let TxDetailsViewModule = class TxDetailsViewModule {
};
TxDetailsViewModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_wallets_tx_details_tx_details__["a" /* TxDetailsView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_wallets_tx_details_tx_details__["a" /* TxDetailsView */]),
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_shared_module__["a" /* SharedModule */],
            __WEBPACK_IMPORTED_MODULE_4_angular2_moment_moment_module__["MomentModule"]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__["a" /* WalletService */],
            __WEBPACK_IMPORTED_MODULE_6_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */],
        ]
    })
], TxDetailsViewModule);

//# sourceMappingURL=tx-details.module.js.map

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

/***/ 893:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TxDetailsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_vaults_vaults_service__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_shared_fiat_amount_model__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_transact_rate_service__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











const CONFIRMATION_THRESHOLD = 6;
let TxDetailsView = class TxDetailsView {
    constructor(navParams, txFormatService, walletService, vaultService, profileService, logger, bws, rateService) {
        this.navParams = navParams;
        this.txFormatService = txFormatService;
        this.walletService = walletService;
        this.vaultService = vaultService;
        this.profileService = profileService;
        this.logger = logger;
        this.bws = bws;
        this.rateService = rateService;
        this.wallet = this.walletService.getWallet(this.navParams.get('walletId'));
        this.vault = this.navParams.get('vault');
        this.txId = this.navParams.get('txId');
        this.bitcore = this.bws.getBitcore();
        this.tx = {};
        this.confirmations = null;
    }
    ionViewDidEnter() {
        const vault = this.navParams.get('vault');
        if (vault) {
            const finish = (list) => {
                let tx = __WEBPACK_IMPORTED_MODULE_0_lodash__["find"](list, {
                    txid: this.txId
                });
                if (!tx)
                    throw new Error('Could not get transaction');
                return this.processTx(tx);
            };
            this.vaultService.getVaultTxHistory(this.wallet, vault).then((txs) => {
                const tx = finish(txs);
                return this.updateTxDetails(tx);
            });
        }
        else {
            this.walletService.getTx(this.wallet, this.txId).then((tx) => {
                return this.updateTxDetails(tx);
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    addMemo() {
        return;
    }
    viewOnBlockchain() {
        this.logger.warn("Viewing on blockchain is not yet implemented and up for discussion.");
    }
    processTx(tx) {
        const thisAddr = new this.bitcore.Address(this.vault.address).toString();
        const summ = __WEBPACK_IMPORTED_MODULE_0_lodash__["reduce"](tx.outputs, (acc, output) => {
            if (output.address != thisAddr) {
                return acc;
            }
            return acc + output.amount;
        }, 0);
        tx.amount = summ;
        const amountStr = this.txFormatService.formatAmountStr(summ);
        tx.amountStr = amountStr;
        this.amountStr = amountStr;
        tx.altAmount = this.rateService.fromMicrosToFiat(tx.amount, this.wallet.cachedStatus.alternativeIsoCode);
        tx.altAmountStr = new __WEBPACK_IMPORTED_MODULE_9_merit_shared_fiat_amount_model__["a" /* FiatAmount */](tx.altAmount);
        return tx;
    }
    updateTxDetails(tx) {
        this.tx = tx;
        if (this.tx.action == 'sent')
            this.title = 'Sent Funds';
        if (this.tx.action == 'received')
            this.title = 'Received Funds';
        if (this.tx.action == 'moved')
            this.title = 'Moved Funds';
        if (this.tx.safeConfirmed)
            this.confirmations = this.tx.safeConfirmed;
        else if (this.tx.confirmations > CONFIRMATION_THRESHOLD)
            this.confirmations = `${CONFIRMATION_THRESHOLD}+`;
    }
};
TxDetailsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'tx-details-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/tx-details/tx-details.html"*/'<ion-header no-border>\n  <ion-navbar color="secondary">\n    <ion-title>{{title | translate}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <ion-item>\n      <div *ngIf="tx.action == \'received\'" class="action">\n        <img src="assets/img/icon-receive-history.svg" width="40">\n        <span translate>Received</span>\n      </div>\n      <div *ngIf="tx.action == \'sent\'" class="action">\n        <img src="assets/img/icon-sent.svg" width="40">\n        <span translate>Sent</span>\n      </div>\n      <div *ngIf="tx.action == \'moved\'" class="action">\n        <img src="assets/img/icon-moved.svg" width="40">\n        <span translate>Moved</span>\n      </div>\n\n      <div class="amount-str">{{tx.amountStr | toUnit : tx.amount}}</div>\n      <div class="amount-alt-str">{{tx.alternativeAmountStr || altAmountStr | toFiat : tx.amount | async}}</div>\n    </ion-item>\n\n    <ion-item>\n      <ion-avatar item-start>\n        <img src="assets/img/icon-wallet.svg" class="icon-wallet">\n      </ion-avatar>\n      <h2 translate>To</h2>\n      <p *ngIf="tx.action != \'sent\' && wallet && !vault">{{ wallet.name || \'...\' }}</p>\n      <p *ngIf="tx.action != \'sent\' && vault">{{ vault.name || \'...\' }}</p>\n      \n      <p *ngIf="tx.action == \'sent\'">{{ tx.addressTo || \'...\' }}</p>\n    </ion-item>\n\n    <ion-item *ngIf="tx.action == \'sent\'">\n      <ion-avatar item-start>\n        <img src="assets/img/icon-wallet.svg" class="icon-wallet">\n      </ion-avatar>\n      <h2 translate>From</h2>\n      <p>{{wallet.name || \'...\'}}</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-label>{{\'Date\' | translate}}</ion-label>\n      <ion-note item-end>\n        {{tx.time * 1000 | amDateFormat:\'MM/DD/YYYY HH:mm a\'}}\n      </ion-note>\n    </ion-item>\n\n    <button ion-item (click)="addMemo()">\n      <ion-label>{{\'Memo\' | translate}}</ion-label>\n      <span>{{tx.message}}</span>\n    </button>\n\n    <button ion-item (click)="addMemo()" *ngIf="tx.action != \'received\'">\n      <ion-label>{{\'Fee\' | translate}}</ion-label>\n      <ion-note item-end>\n        {{unitFee | toUnit: tx.fees || \'...\'}} - {{fiatFee | toFiat: tx.fees || \'...\' | async}}\n      </ion-note>\n    </button>\n\n    <ion-item>\n      <ion-label>{{\'Confirmations\' | translate}}</ion-label>\n      <ion-note item-end>\n        {{confirmations || \'Unconfirmed\' | translate}}\n      </ion-note>\n    </ion-item>\n  </ion-list>\n\n  <!-- <button ion-button block clear (click)="viewOnBlockchain()" translate>View on blockchain</button> -->\n</ion-content>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/tx-details/tx-details.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_transact_tx_format_service__["a" /* TxFormatService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_vaults_vaults_service__["a" /* VaultsService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_8_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_10_merit_transact_rate_service__["a" /* RateService */]])
], TxDetailsView);

//# sourceMappingURL=tx-details.js.map

/***/ })

});
//# sourceMappingURL=15.js.map