webpackJsonp([28],{

/***/ 798:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$$moduleName$$Module", function() { return $$moduleName$$Module; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__edit_wallet__ = __webpack_require__(886);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let $$moduleName$$Module = class $$moduleName$$Module {
};
$$moduleName$$Module = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__edit_wallet__["a" /* EditWalletView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__edit_wallet__["a" /* EditWalletView */]),
        ],
    })
], $$moduleName$$Module);

//# sourceMappingURL=edit-wallet.module.js.map

/***/ }),

/***/ 886:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditWalletView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








let EditWalletView = class EditWalletView {
    constructor(navCtrl, navParams, modalCtrl, alertCtrl, profileService, app, toastCtrl, configService, walletService, logger) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.profileService = profileService;
        this.app = app;
        this.toastCtrl = toastCtrl;
        this.configService = configService;
        this.walletService = walletService;
        this.logger = logger;
        this.wallet = this.navParams.get('wallet');
        this.logger.info(this.wallet);
    }
    changeBalanceHidden(isHidden) {
        this.wallet.balanceHidden = isHidden;
        this.walletService.setHiddenBalanceOption(this.wallet.id, isHidden);
    }
    changeName(name) {
        if (name) {
            let aliasOpts = { aliasFor: {} };
            aliasOpts.aliasFor[this.wallet.id] = name;
            this.configService.set(aliasOpts);
        }
    }
    changeColor() {
        let modal = this.modalCtrl.create('SelectColorView', { color: this.wallet.color });
        modal.onDidDismiss((color) => {
            if (color) {
                this.wallet.color = color;
                let colorOpts = { colorFor: {} };
                colorOpts.colorFor[this.wallet.id] = color;
                this.configService.set(colorOpts);
            }
        });
        modal.present();
    }
    goToSetPassword() {
        this.navCtrl.push('SetWalletPasswordView', { wallet: this.wallet });
        //this.walletService.encrypt(wallet, this.formData.password);
    }
    goToExportWallet() {
        this.navCtrl.push('ExportWalletView', { wallet: this.wallet });
    }
    deleteWallet() {
        this.alertCtrl.create({
            title: 'WARNING!',
            message: 'This action will permanently delete this wallet. IT CANNOT BE REVERSED!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => { }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.profileService.deleteWalletClient(this.wallet).then(() => {
                            this.app.getRootNav().setRoot('WalletsView');
                        }).catch((err) => {
                            this.toastCtrl.create({
                                message: JSON.stringify(err),
                                cssClass: __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                            });
                        });
                    }
                }
            ]
        }).present();
    }
};
EditWalletView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-edit-wallet',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/edit-wallet/edit-wallet.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Edit Wallet</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list>\n        <ion-item-divider translate>Setting</ion-item-divider>\n        <ion-item>\n            <ion-label translate>Wallet name</ion-label>\n            <ion-input text-right  [(ngModel)]="wallet.name" debounce="300" (ionChange)="changeName($event.value)"></ion-input>\n        </ion-item>\n\n        <ion-item (click)="changeColor()">\n            <ion-label translate>Color</ion-label>\n            <ion-label item-right text-right>\n                <i class="wallet-icon" [class.default]="!wallet.color">\n                    <img src="assets/img/icon-wallet.svg"  [style.background]="wallet.color" >\n                </i>\n            </ion-label>\n        </ion-item>\n        <ion-item>\n            <ion-label>Hide Balance</ion-label>\n            <ion-toggle [(ngModel)]="wallet.balanceHidden" (ionChange)="changeBalanceHidden($event.value)">\n            </ion-toggle>\n        </ion-item>\n\n\n\n\n        <ion-item-divider translate>Actions</ion-item-divider>\n        <button ion-item (click)="goToSetPassword()">\n            <ion-label>Set Password</ion-label>\n        </button>\n        <button ion-item (click)="goToExportWallet()">\n            <ion-label>Export wallet</ion-label>\n        </button>\n        <button ion-item (click)="deleteWallet()">\n            <ion-label>Delete wallet</ion-label>\n        </button>\n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/edit-wallet/edit-wallet.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__["a" /* Logger */]])
], EditWalletView);

//# sourceMappingURL=edit-wallet.js.map

/***/ })

});
//# sourceMappingURL=28.js.map