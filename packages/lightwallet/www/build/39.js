webpackJsonp([39],{

/***/ 770:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectLanguageComponentModule", function() { return SelectLanguageComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_settings_select_language_select_language__ = __webpack_require__(857);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let SelectLanguageComponentModule = class SelectLanguageComponentModule {
};
SelectLanguageComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_settings_select_language_select_language__["a" /* SelectLanguageModal */],
        ],
        providers: [],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_settings_select_language_select_language__["a" /* SelectLanguageModal */]),
        ],
    })
], SelectLanguageComponentModule);

//# sourceMappingURL=select-language.module.js.map

/***/ }),

/***/ 857:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectLanguageModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular_index__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let SelectLanguageModal = class SelectLanguageModal {
    constructor(navCtrl, navParams, alertCtrl, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.viewCtrl = viewCtrl;
        this.currentLanguage = this.navParams.get('currentLanguage');
        this.availableLanguages = this.navParams.get('availableLanguages');
    }
    ionViewDidLoad() {
        //do something here
    }
    toCommunity() {
        //@TODO move to configs
        let url = 'https://github.com/meritlabs/lightwallet-stack';
        let confirm = this.alertCtrl.create({
            title: 'External link',
            message: 'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
            buttons: [
                { text: 'Cancel', role: 'cancel', handler: () => { } },
                { text: 'Open GitHub', handler: () => {
                        //todo open it 
                    } }
            ]
        });
        confirm.present();
    }
    cancel() {
        this.viewCtrl.dismiss();
    }
    select(language) {
        this.viewCtrl.dismiss(language);
    }
};
SelectLanguageModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-select-language',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/select-language/select-language.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Language</ion-title>\n\n        <ion-buttons end>\n            <button ion-button (click)="cancel()" translate>\n                cancel\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list>\n        <ion-item *ngFor="let language of availableLanguages" [class.selected]="currentLanguage == language" (click)="select(language)">\n            <ion-label>{{language}}</ion-label>\n            <ion-icon name="checkmark" color="primary" item-right *ngIf="currentLanguage == language"></ion-icon>\n        </ion-item>\n    </ion-list>\n\n    <p class="plain-text" translate>\n        We’re always looking for translation contributions! You can make corrections or help to make this app available in your native language by joining our community on Crowdin.\n    </p>\n\n    <p class="plain-text" translate>\n        Don\'t see your language on Crowdin? Contact the Owner on Crowdin! We\'d love to support your language.\n    </p>\n\n    <div class="control-buttons">\n        <button  (click)="toCommunity()" ion-button>Contribure Translations</button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/select-language/select-language.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular_index__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], SelectLanguageModal);

//# sourceMappingURL=select-language.js.map

/***/ })

});
//# sourceMappingURL=39.js.map