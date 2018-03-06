webpackJsonp([36],{

/***/ 779:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectSendingOptionComponentModule", function() { return SelectSendingOptionComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_select_sending_option_select_sending_option__ = __webpack_require__(866);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let SelectSendingOptionComponentModule = class SelectSendingOptionComponentModule {
};
SelectSendingOptionComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_transact_select_sending_option_select_sending_option__["a" /* SelectSendingOptionModal */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_angular2_moment__["MomentModule"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_transact_select_sending_option_select_sending_option__["a" /* SelectSendingOptionModal */]),
        ],
    })
], SelectSendingOptionComponentModule);

//# sourceMappingURL=select-sending-option.module.js.map

/***/ }),

/***/ 866:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectSendingOptionModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let SelectSendingOptionModal = class SelectSendingOptionModal {
    constructor(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
    }
    async ionViewDidLoad() {
        this.sendingOptions = this.navParams.get('sendingOptions');
        this.selectedSendingOption = this.navParams.get('selectedSendingOption');
    }
    cancel() {
        this.viewCtrl.dismiss();
    }
    select(sendingOption) {
        this.viewCtrl.dismiss(sendingOption);
    }
};
SelectSendingOptionModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-select-sending-option',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/transact/select-sending-option/select-sending-option.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Select Sending Option</ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="cancel()" translate>\n                cancel\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <span *ngIf="sendingOptions">\n        <button ion-item *ngFor="let sendingOption of sendingOptions" [class.selected]="selectedSendingOption.label == sendingOption.label" (click)="select(sendingOption)">\n            <h2 translate>\n                {{sendingOption.label}}\n            </h2>\n        </button>\n    </span>\n\n\n</ion-content>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/transact/select-sending-option/select-sending-option.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], SelectSendingOptionModal);

//# sourceMappingURL=select-sending-option.js.map

/***/ })

});
//# sourceMappingURL=36.js.map