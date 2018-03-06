webpackJsonp([43],{

/***/ 764:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TourModule", function() { return TourModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_onboard_tour_tour__ = __webpack_require__(851);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



// This is the tour component. 
// It walks a user through the benefits of Merit..
let TourModule = class TourModule {
};
TourModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_onboard_tour_tour__["a" /* TourView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_onboard_tour_tour__["a" /* TourView */]),
        ],
    })
], TourModule);

//# sourceMappingURL=tour.module.js.map

/***/ }),

/***/ 851:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TourView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_rate_service__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let TourView = class TourView {
    constructor(navCtrl, navParams, rateService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.rateService = rateService;
        this.rateData = { usdPerMerit: null };
    }
    ionViewDidLoad() {
        this.rateData.usdPerMerit = this.rateService.fromFiatToMerit(1e8, 'USD');
    }
    slideNext() {
        this.slides.slideNext();
        this.currentIndex = this.slides.getActiveIndex();
    }
    toUnlockView() {
        this.navCtrl.push('UnlockView');
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], TourView.prototype, "slides", void 0);
TourView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-tour',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/onboard/tour/tour.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-buttons end>\n            <button ion-button clear (click)="toUnlockView()">\n                Skip\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content fullscreen>\n\n    <ion-slides pager="true" #slides>\n\n        <ion-slide>\n\n            <div class="title" translate>\n                Merit is secure,<br/>digital money.\n            </div>\n            <div class="text" translate>\n                You can spend merit at millions of websites and stores worldwide.\n            </div>\n            <div class="image"  translate>\n                <div class="illustration secure"></div>\n            </div>\n            <div class="text" translate>\n                Just scan the code to pay.\n            </div>\n            <div class="bottom-buttons">\n                <button ion-button block (click)="slideNext()" translate>Got it</button>\n            </div>\n\n        </ion-slide>\n\n        <ion-slide>\n\n            <div class="title" translate>\n                Merit is a currency.\n            </div>\n            <div class="text" translate>\n                You can trade it for other currencies like US Dollars, Euros, or Merit.\n            </div>\n            <div class="image"  translate>\n                <div class="illustration currency"></div>\n            </div>\n            <div class="text exchange-rate">\n                1 MRT = $ {{rateData.usdPerMerit|number:\'1.0-3\'}}\n            </div>\n            <div class="text" translate>\n                The exchange rate changes with the market.\n            </div>\n            <div class="bottom-buttons">\n                <button ion-button block (click)="slideNext()" translate>Makes sense</button>\n            </div>\n\n        </ion-slide>\n\n        <ion-slide>\n            <div class="title" translate>\n                You control your merit.\n            </div>\n            <div class="text" translate>\n                This app stores your merit with cutting-edge security.\n            </div>\n            <div class="image"  translate>\n                <div class="illustration control"></div>\n            </div>\n            <div class="text" translate>\n                Not even Merit Labs can access it.\n            </div>\n            <div class="bottom-buttons">\n                <button ion-button block (click)="toUnlockView()" translate>I Feel Safe</button>\n            </div>\n        </ion-slide>\n\n    </ion-slides>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/onboard/tour/tour.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_rate_service__["a" /* RateService */]])
], TourView);

//# sourceMappingURL=tour.js.map

/***/ })

});
//# sourceMappingURL=43.js.map