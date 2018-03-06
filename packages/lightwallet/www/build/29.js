webpackJsonp([29],{

/***/ 797:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateWalletComponentModule", function() { return CreateWalletComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_create_wallet_create_wallet__ = __webpack_require__(885);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let CreateWalletComponentModule = class CreateWalletComponentModule {
};
CreateWalletComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_wallets_create_wallet_create_wallet__["a" /* CreateWalletView */],
        ],
        providers: [],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_wallets_create_wallet_create_wallet__["a" /* CreateWalletView */]),
        ],
    })
], CreateWalletComponentModule);

//# sourceMappingURL=create-wallet.module.js.map

/***/ }),

/***/ 885:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateWalletView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_core_notification_push_notification_service__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_core_notification_polling_notification_service__ = __webpack_require__(215);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











let CreateWalletView = class CreateWalletView {
    constructor(navCtrl, navParams, config, walletService, loadCtrl, toastCtrl, modalCtrl, logger, pushNotificationService, pollingNotificationService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.config = config;
        this.walletService = walletService;
        this.loadCtrl = loadCtrl;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.logger = logger;
        this.pushNotificationService = pushNotificationService;
        this.pollingNotificationService = pollingNotificationService;
        this.formData = {
            walletName: '',
            unlockCode: '',
            bwsurl: '',
            recoveryPhrase: '',
            password: '',
            repeatPassword: '',
            color: '',
            hideBalance: false
        };
        this.formData.bwsurl = config.getDefaults().bws.url;
        this.defaultBwsUrl = config.getDefaults().bws.url;
    }
    ionViewDidEnter() {
        let unlockCode = this.navParams.get('unlockCode');
        if (!__WEBPACK_IMPORTED_MODULE_7_lodash__["isNil"](unlockCode)) {
            this.formData.unlockCode = unlockCode;
        }
    }
    isCreationEnabled() {
        return (this.formData.unlockCode
            && this.formData.walletName);
    }
    selectColor() {
        let modal = this.modalCtrl.create('SelectColorView', { color: this.formData.color });
        modal.onDidDismiss((color) => {
            if (color) {
                this.formData.color = color;
            }
        });
        modal.present();
    }
    createWallet() {
        if (this.formData.password != this.formData.repeatPassword) {
            this.toastCtrl.create({
                message: "Passwords don't match",
                cssClass: __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        }
        let opts = {
            name: this.formData.walletName,
            unlockCode: this.formData.unlockCode,
            bwsurl: this.formData.bwsurl,
            mnemonic: this.formData.recoveryPhrase,
            networkName: this.config.getDefaults().network.name,
            m: 1,
            n: 1 //todo temp!
        };
        let loader = this.loadCtrl.create({
            content: 'Creating wallet'
        });
        loader.present();
        return this.walletService.createWallet(opts).then((wallet) => {
            // Subscribe to push notifications or to long-polling for this wallet.
            if (this.config.get().pushNotificationsEnabled) {
                this.logger.info("Subscribing to push notifications for default wallet");
                this.pushNotificationService.subscribe(wallet);
            }
            else {
                this.logger.info("Subscribing to long polling for default wallet");
                this.pollingNotificationService.enablePolling(wallet);
            }
            let promises = [];
            if (this.formData.hideBalance) {
                promises.push(this.walletService.setHiddenBalanceOption(wallet.id, this.formData.hideBalance));
            }
            if (this.formData.password) {
                promises.push(this.walletService.encrypt(wallet, this.formData.password));
            }
            if (this.formData.color) {
                let colorOpts = { colorFor: {} };
                colorOpts.colorFor[wallet.id] = this.formData.color;
                promises.push(this.config.set(colorOpts));
            }
            // We should callback to the wallets list page to let it know that there is a new wallet
            // and that it should updat it's list.
            let callback = this.navParams.get("updateWalletListCB");
            return __WEBPACK_IMPORTED_MODULE_8_bluebird__["join"](promises).then(() => {
                return loader.dismiss().then(() => {
                    return callback().then(() => {
                        this.navCtrl.pop();
                    });
                });
            });
        }).catch((err) => {
            loader.dismiss();
            this.logger.error(err);
            this.toastCtrl.create({
                message: JSON.stringify(err),
                cssClass: __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
    }
};
CreateWalletView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-create-wallet',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/create-wallet/create-wallet.html"*/'<ion-header>\n\n    <ion-navbar color="secondary" >\n        <ion-title translate>Create Personal Wallet</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n\n    <ion-list>\n        <ion-item-divider translate>Wallet</ion-item-divider>\n        <ion-item>\n            <ion-label translate>Wallet name</ion-label>\n            <ion-input text-right [placeholder]="\'Family vacation funds\'" [(ngModel)]="formData.walletName"></ion-input>\n        </ion-item>\n\n        <ion-item>\n            <ion-label translate>Unlock code</ion-label>\n            <ion-input text-right [placeholder]="\'Paste it here\'" [(ngModel)]="formData.unlockCode"></ion-input>\n        </ion-item>\n\n        <ion-item-divider translate>Settings</ion-item-divider>\n        <ion-item (click)="selectColor()">\n            <ion-label translate>Color</ion-label>\n            <ion-label item-right text-right>\n                <i class="wallet-icon" [class.default]="!formData.color">\n                    <img src="assets/img/icon-wallet.svg"  [style.background]="formData.color" >\n                </i>\n            </ion-label>\n        </ion-item>\n        <ion-item>\n            <ion-label>Hide Balance</ion-label>\n            <ion-toggle [(ngModel)]="formData.hideBalance">\n            </ion-toggle>\n        </ion-item>\n\n        <ion-item-divider translate>Password (optional)</ion-item-divider>\n        <ion-item class="warning">\n            <b>Warning</b> This password cannot be recovered. If the password is lost, there is no way you could recover your funds!\n        </ion-item>\n        <ion-item>\n            <ion-label>Password</ion-label>\n            <ion-input type="password" text-right [(ngModel)]="formData.password"></ion-input>\n        </ion-item>\n        <ion-item>\n            <ion-label>Confirm password</ion-label>\n            <ion-input type="password" text-right [(ngModel)]="formData.repeatPassword"></ion-input>\n        </ion-item>\n\n        <ion-item-divider>Recovery Phrase</ion-item-divider>\n        <ion-item>\n            <textarea placeholder="Enter the recovery phrase (BIP39)" [(ngModel)]="formData.recoveryPhrase"></textarea>\n        </ion-item>\n\n\n        <ion-item-divider translate>Advanced</ion-item-divider>\n\n        <ion-item>\n            <ion-label translate>Wallet Service URL</ion-label>\n            <ion-input text-right [(ngModel)]="formData.bwsurl" [placeholder]=""></ion-input>\n        </ion-item>\n\n    </ion-list>\n\n\n    <div class="control-buttons" margin-bottom>\n        <button ion-button [disabled]="!isCreationEnabled()" translate (click)="createWallet()">\n            Create new wallet\n        </button>\n    </div>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/create-wallet/create-wallet.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_9_merit_core_notification_push_notification_service__["a" /* PushNotificationsService */],
        __WEBPACK_IMPORTED_MODULE_10_merit_core_notification_polling_notification_service__["a" /* PollingNotificationsService */]])
], CreateWalletView);

//# sourceMappingURL=create-wallet.js.map

/***/ })

});
//# sourceMappingURL=29.js.map