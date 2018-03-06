webpackJsonp([26],{

/***/ 801:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$$moduleName$$Module", function() { return $$moduleName$$Module; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__set_wallet_password__ = __webpack_require__(892);
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
            __WEBPACK_IMPORTED_MODULE_2__set_wallet_password__["a" /* SetWalletPasswordView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__set_wallet_password__["a" /* SetWalletPasswordView */]),
        ],
    })
], $$moduleName$$Module);

//# sourceMappingURL=set-wallet-password.module.js.map

/***/ }),

/***/ 892:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetWalletPasswordView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let SetWalletPasswordView = class SetWalletPasswordView {
    constructor(navCtrl, navParams, toastCtrl, walletService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.walletService = walletService;
        this.formData = {
            password: '',
            repeatPassword: '',
            currentPassword: ''
        };
        this.wallet = navParams.get('wallet');
        this.isWalletEncrypted = this.walletService.isEncrypted(this.wallet);
    }
    setPassword() {
        if (this.formData.password != this.formData.repeatPassword) {
            return this.toastCtrl.create({
                message: "Passwords don't match",
                cssClass: __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        }
        let encrypt = () => {
            this.walletService.encrypt(this.wallet, this.formData.password).then(() => {
                this.navCtrl.pop();
            }).catch((err) => {
                return this.toastCtrl.create({
                    message: err,
                    cssClass: __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                }).present();
            });
        };
        if (this.isWalletEncrypted) {
            this.walletService.decrypt(this.wallet, this.formData.currentPassword).then(() => {
                return encrypt();
            }).catch((err) => {
                return this.toastCtrl.create({
                    message: "Incorrect current password",
                    cssClass: __WEBPACK_IMPORTED_MODULE_3_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                }).present();
            });
        }
        else {
            return encrypt();
        }
    }
    saveEnabled() {
        return (this.formData.password
            && (this.isWalletEncrypted ? this.formData.currentPassword : true));
    }
};
SetWalletPasswordView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-set-wallet-password',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/set-wallet-password/set-wallet-password.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Set Wallet Password</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content *ngIf="wallet">\n\n    <ion-list>\n        <ion-item-divider>\n            Set new password\n        </ion-item-divider>\n        <ion-item class="warning">\n            <b>Warning</b> This password cannot be recovered. If the password is lost, there is no way you could recover your funds!\n        </ion-item>\n\n        <ion-item>\n            <ion-label>Password</ion-label>\n            <ion-input type="password" text-right [(ngModel)]="formData.password"></ion-input>\n        </ion-item>\n        <ion-item>\n            <ion-label>Confirm password</ion-label>\n            <ion-input type="password" text-right [(ngModel)]="formData.repeatPassword"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list *ngIf="isWalletEncrypted">\n        <ion-item-divider>\n            Current password\n        </ion-item-divider>\n        <ion-item>\n            <ion-label>Current password</ion-label>\n            <ion-input type="password" text-right [(ngModel)]="formData.currentPassword"></ion-input>\n        </ion-item>\n    </ion-list>\n\n\n    <div class="control-buttons" margin-bottom>\n        <button ion-button [disabled]="!saveEnabled()" translate (click)="setPassword()">\n            Save\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/set-wallet-password/set-wallet-password.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */]])
], SetWalletPasswordView);

//# sourceMappingURL=set-wallet-password.js.map

/***/ })

});
//# sourceMappingURL=26.js.map