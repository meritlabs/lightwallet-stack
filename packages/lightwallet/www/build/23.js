webpackJsonp([23],{

/***/ 786:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportComponentModule", function() { return ImportComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_utilities_import_import__ = __webpack_require__(874);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_derivation_path_service__ = __webpack_require__(846);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






let ImportComponentModule = class ImportComponentModule {
};
ImportComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_utilities_import_import__["a" /* ImportView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_utilities_import_import__["a" /* ImportView */]),
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_derivation_path_service__["a" /* DerivationPathService */],
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
            __WEBPACK_IMPORTED_MODULE_5_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */]
        ]
    })
], ImportComponentModule);

//# sourceMappingURL=import.module.js.map

/***/ }),

/***/ 846:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DerivationPathService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let DerivationPathService = class DerivationPathService {
    getDefault() {
        return "m/44'/0'/0'";
    }
    getDefaultTestnet() {
        return "m/44'/1'/0'";
    }
    parse(str) {
        var arr = str.split('/');
        var ret = {};
        if (arr[0] != 'm')
            return false;
        switch (arr[1]) {
            case "44'":
                ret.derivationStrategy = 'BIP44';
                break;
            case "45'":
                return {
                    derivationStrategy: 'BIP45',
                    networkName: 'livenet',
                    account: 0,
                };
                break;
            case "48'":
                ret.derivationStrategy = 'BIP48';
                break;
            default:
                return false;
        }
        ;
        switch (arr[2]) {
            case "0'":
                ret.networkName = 'livenet';
                break;
            case "1'":
                ret.networkName = 'testnet';
                break;
            default:
                return false;
        }
        ;
        var match = arr[3].match(/(\d+)'/);
        if (!match)
            return false;
        ret.account = +match[1];
        return ret;
    }
};
DerivationPathService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], DerivationPathService);

//# sourceMappingURL=derivation-path.service.js.map

/***/ }),

/***/ 874:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImportView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_utilities_mnemonic_derivation_path_service__ = __webpack_require__(846);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











let ImportView = class ImportView {
    constructor(navCtrl, bwcService, config, toastCtrl, logger, loadingCtrl, profileService, walletService, derivationPathService, modalCtrl, app, mnemonicService) {
        this.navCtrl = navCtrl;
        this.bwcService = bwcService;
        this.config = config;
        this.toastCtrl = toastCtrl;
        this.logger = logger;
        this.loadingCtrl = loadingCtrl;
        this.profileService = profileService;
        this.walletService = walletService;
        this.derivationPathService = derivationPathService;
        this.modalCtrl = modalCtrl;
        this.app = app;
        this.mnemonicService = mnemonicService;
        this.segment = 'phrase';
        this.formData = {
            words: '',
            phrasePassword: '',
            derivationPath: '',
            fromHardwareWallet: false,
            testnetEnabled: false,
            bwsUrl: '',
            backupFile: null,
            backupFileBlob: '',
            filePassword: '',
            network: '',
            hasPassphrase: false
        };
        this.loadFileInProgress = false;
        this.formData.bwsUrl = config.getDefaults().bws.url;
        this.formData.network = config.getDefaults().network.name;
        this.formData.derivationPath =
            this.formData.network == 'livenet' ?
                this.derivationPathService.getDefault() :
                this.derivationPathService.getDefaultTestnet();
        this.sjcl = this.bwcService.getSJCL();
    }
    ionViewDidLoad() {
    }
    openScanner() {
        let modal = this.modalCtrl.create('ImportScanView');
        modal.onDidDismiss((data) => {
            if (data) {
                let parts = data.split('|');
                this.formData.words = parts[1];
                this.formData.network = parts[2];
                this.formData.derivationPath = parts[3];
                this.formData.hasPassphrase = parts[4];
            }
        });
        modal.present();
    }
    openFilePicker() {
        this.input.nativeElement.click();
    }
    fileChangeListener($event) {
        this.formData.backupFile = $event.target.files[0];
        let reader = new FileReader();
        this.loadFileInProgress = true;
        reader.onloadend = (loadEvent) => {
            if (loadEvent.target.readyState == 2) {
                this.loadFileInProgress = false;
                this.formData.backupFileBlob = loadEvent.target.result;
            }
        };
        reader.readAsText($event.target.files[0]);
    }
    importMnemonic() {
        let loader = this.loadingCtrl.create({ content: 'importingWallet' });
        loader.present();
        let pathData = this.derivationPathService.parse(this.formData.derivationPath);
        if (!pathData) {
            return this.toastCtrl.create({ message: 'Invalid derivation path', cssClass: __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR });
        }
        let opts = {
            account: pathData.account,
            networkName: pathData.networkName,
            derivationStrategy: pathData.derivationStrategy
        };
        let importCall;
        if (this.formData.words.indexOf('xprv') == 0 || this.formData.words.indexOf('tprv') == 0) {
            importCall = this.profileService.importExtendedPrivateKey(this.formData.words, opts);
        }
        else if (this.formData.words.indexOf('xpub') == 0 || this.formData.words.indexOf('tpub') == 0) {
            opts.extendedPublicKey = this.formData.words;
            importCall = this.profileService.importExtendedPublicKey(opts);
        }
        else {
            opts.passphrase = this.formData.phrasePassword;
            importCall = this.mnemonicService.importMnemonic(this.formData.words, opts);
        }
        return importCall.then((wallet) => {
            return this.processCreatedWallet(wallet, loader);
        }).catch((err) => {
            loader.dismiss();
            let errorMsg = 'Failed to import wallet';
            if (err && err.message) {
                errorMsg = err.message;
            }
            else if (typeof err === 'string') {
                errorMsg = err;
            }
            this.toastCtrl.create({
                message: errorMsg,
                cssClass: __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
    }
    importBlob() {
        let decrypted;
        try {
            decrypted = this.sjcl.decrypt(this.formData.filePassword, this.formData.backupFileBlob);
        }
        catch (e) {
            this.logger.warn(e);
            return this.toastCtrl.create({
                message: "Could not decrypt file, check your password",
                cssClass: __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        }
        let loader = this.loadingCtrl.create({ content: 'importingWallet' });
        loader.present();
        this.profileService.importWallet(decrypted, { bwsurl: this.formData.bwsUrl }).then((wallet) => {
            this.processCreatedWallet(wallet, loader);
        }).catch((err) => {
            loader.dismiss();
            this.logger.warn(err);
            this.toastCtrl.create({
                message: err,
                cssClass: __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
    }
    processCreatedWallet(wallet, loader) {
        console.log('PROCESSING');
        //this.walletService.updateRemotePreferences(wallet, {}).then(() => {
        this.profileService.setBackupFlag(wallet.credentials.walletId);
        if (loader)
            loader.dismiss();
        this.app.getRootNav().setRoot('TransactView');
        //});
    }
    setDerivationPath() {
        this.formData.derivationPath = this.formData.testnetEnabled ? this.derivationPathService.getDefaultTestnet() : this.derivationPathService.getDefault();
    }
    mnemonicImportAllowed() {
        let checkWords = (words) => {
            let beginsWith = (str) => {
                return (this.formData.words.indexOf(str) == 0);
            };
            if (beginsWith('xprv') || beginsWith('tprv') || beginsWith('xpub') || beginsWith('tpuv')) {
                return true;
            }
            else {
                return !(this.formData.words.split(/[\u3000\s]+/).length % 3);
            }
        };
        return (this.formData.words && checkWords(this.formData.words));
    }
    fileImportAllowed() {
        return (!this.loadFileInProgress && this.formData.backupFileBlob && this.formData.filePassword);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('fileInput'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
], ImportView.prototype, "input", void 0);
ImportView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-import',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/utilities/import/import.html"*/'<ion-header>\n    <ion-navbar color="secondary">\n        <ion-title translate>Import Wallet</ion-title>\n    </ion-navbar>\n    <ion-toolbar color="secondary">\n        <ion-segment [(ngModel)]="segment" >\n        <ion-segment-button value="phrase">\n            Phrase\n        </ion-segment-button>\n        <ion-segment-button value="file">\n            File\n        </ion-segment-button>\n        </ion-segment>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n\n    <span *ngIf="segment == \'phrase\'">\n        <ion-item margin-top>\n            <ion-label translate>\n                Enter the recovery phrase (usually 12 words)\n            </ion-label>\n            <button (click)="openScanner()" ion-button icon-only item-right clear>\n                <ion-icon name="qr-scanner"  color="primary"></ion-icon>\n            </button>\n        </ion-item>\n\n        <ion-item>\n            <textarea fz-elastic [(ngModel)]="formData.words" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"\n                      [placeholder]="\'Type it here\'"\n            ></textarea>\n        </ion-item>\n\n        <ion-item-divider translate>Options</ion-item-divider>\n        <ion-item>\n            <ion-label translate>Password</ion-label>\n            <ion-input text-right [(ngModel)]="formData.phrasePassword"  autocomplete="off" [placeholder]="\'Recovery phrase password (optional)\'"></ion-input>\n        </ion-item>\n\n        <ion-item>\n            <ion-label translate>Derivation Path</ion-label>\n            <ion-input text-right [(ngModel)]="formData.derivationPath" [placeholder]="\'BIP32 path for address derivation\'"></ion-input>\n        </ion-item>\n\n        <ion-item margin-bottom>\n            <ion-label translate>Wallet Service Url</ion-label>\n            <ion-input text-right [(ngModel)]="formData.bwsUrl"></ion-input>\n        </ion-item>\n\n        <button class="action-button" margin-top block (click)="importMnemonic()" ion-button translate [disabled]="!mnemonicImportAllowed()">Import</button>\n\n    </span>\n\n    <span *ngIf="segment == \'file\'">\n\n        <ion-item margin-top (click)="openFilePicker()">\n            <ion-label translate *ngIf="!formData.backupFile">\n                Choose a backup file from your device\n            </ion-label>\n            <ion-label *ngIf="formData.backupFile">\n                {{formData.backupFile.name}}\n            </ion-label>\n            <button  ion-button icon-only item-right clear>\n                <ion-icon name="ios-share-outline" color="primary"></ion-icon>\n            </button>\n            <input type="file" (change)="fileChangeListener($event)"  #fileInput>\n        </ion-item>\n        <ion-item>\n            <ion-label translate>Password</ion-label>\n            <ion-input text-right [(ngModel)]="formData.filePassword" type="password" autocomplete="off" [placeholder]="\'File password\'"></ion-input>\n        </ion-item>\n\n        <ion-item margin-bottom margin-top>\n            <ion-label translate>Wallet Service Url</ion-label>\n            <ion-input text-right [(ngModel)]="formData.bwsUrl"></ion-input>\n        </ion-item>\n\n        <button class="action-button" margin-top block (click)="importBlob()" ion-button translate [disabled]="!fileImportAllowed()">Import</button>\n\n    </span>\n\n</ion-content>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/utilities/import/import.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_9_merit_utilities_mnemonic_derivation_path_service__["a" /* DerivationPathService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
        __WEBPACK_IMPORTED_MODULE_10_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */]])
], ImportView);

//# sourceMappingURL=import.js.map

/***/ })

});
//# sourceMappingURL=23.js.map