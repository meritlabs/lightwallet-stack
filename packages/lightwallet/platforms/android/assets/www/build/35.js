webpackJsonp([35],{

/***/ 780:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectWalletComponentModule", function() { return SelectWalletComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_select_wallet_select_wallet__ = __webpack_require__(867);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let SelectWalletComponentModule = class SelectWalletComponentModule {
};
SelectWalletComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_transact_select_wallet_select_wallet__["a" /* SelectWalletModal */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_angular2_moment__["MomentModule"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_transact_select_wallet_select_wallet__["a" /* SelectWalletModal */]),
        ],
    })
], SelectWalletComponentModule);

//# sourceMappingURL=select-wallet.module.js.map

/***/ }),

/***/ 867:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectWalletModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let SelectWalletModal = class SelectWalletModal {
    constructor(navCtrl, navParams, viewCtrl, profileService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.profileService = profileService;
    }
    async ionViewDidLoad() {
        this.wallets = await this.profileService.getWallets();
        this.selectedWallet = this.navParams.get('selectedWallet');
    }
    cancel() {
        this.viewCtrl.dismiss();
    }
    select(wallet) {
        this.viewCtrl.dismiss(wallet);
    }
};
SelectWalletModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-select-wallet',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/transact/select-wallet/select-wallet.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Select Wallet</ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="cancel()" translate>\n                cancel\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <span *ngIf="wallets">\n        <button ion-item *ngFor="let wallet of wallets" [class.selected]="selectedWallet.id == wallet.id" (click)="select(wallet)">\n            <i class="wallet-icon" item-start [class.locked]="wallet.locked" [class.default]="!wallet.color" [style.background]="wallet.color">\n                <img src="assets/img/icon-wallet.svg"   >\n            </i>\n            <h2 translate>\n                {{wallet.name || wallet._id}}\n            </h2>\n            <p> \n                <span *ngIf="!wallet.isComplete()" class="assertive" translate>Incomplete</span>\n                <span *ngIf="wallet.isComplete()">\n                <span *ngIf="wallet.status && !wallet.balanceHidden">\n                {{wallet.status.totalBalanceStr ? wallet.status.totalBalanceStr : ( wallet.cachedBalance ? wallet.cachedBalance   + (wallet.cachedBalanceUpdatedOn ? \' &middot; \' + ( wallet.cachedBalanceUpdatedOn  * 1000 | amTimeAgo) : \'\') : \'\'  ) }}\n                </span>\n                <span *ngIf="wallet.balanceHidden" translate>\n                [Balance Hidden]\n                </span>\n                <span *ngIf="wallet.n > 1">\n                {{wallet.m}}-of-{{wallet.n}}\n                </span>\n                <ion-icon *ngIf="!wallet.balanceHidden && wallet.status && (wallet.status.totalBalanceMicros != wallet.status.spendableAmount)"\n                name="timer-outline"></ion-icon>\n\n                <span class="error" *ngIf="wallet.error">{{wallet.error}}</span>\n                </span>\n            </p>\n        </button>\n    </span>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/transact/select-wallet/select-wallet.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__["a" /* ProfileService */]])
], SelectWalletModal);

//# sourceMappingURL=select-wallet.js.map

/***/ })

});
//# sourceMappingURL=35.js.map