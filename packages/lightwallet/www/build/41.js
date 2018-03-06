webpackJsonp([41],{

/***/ 768:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionLogComponentModule", function() { return SessionLogComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_settings_advanced_settings_session_log_session_log__ = __webpack_require__(855);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let SessionLogComponentModule = class SessionLogComponentModule {
};
SessionLogComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_settings_advanced_settings_session_log_session_log__["a" /* SessionLogView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_angular2_moment_moment_module__["MomentModule"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_settings_advanced_settings_session_log_session_log__["a" /* SessionLogView */]),
        ],
    })
], SessionLogComponentModule);

//# sourceMappingURL=session-log.module.js.map

/***/ }),

/***/ 855:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SessionLogView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let SessionLogView = class SessionLogView {
    constructor(navCtrl, navParams, logger) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.showSettingsBar = false;
        this.logLevel = 4;
        this.filteredLogs = [];
    }
    ionViewDidLoad() {
        this.filterLogs();
    }
    copy() {
        //todo copy
    }
    filterLogs() {
        this.filteredLogs = this.logger.getLogs(this.logLevel);
    }
    getLogLevelName(level) {
        return ['error', 'warn', 'info', 'debug'][level] || '';
    }
};
SessionLogView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-session-log',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/advanced-settings/session-log/session-log.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Session log</ion-title>\n\n        <!--<ion-buttons end>-->\n            <!--<button ion-button icon-only>-->\n                <!--<ion-icon name="more"></ion-icon>-->\n            <!--</button>-->\n        <!--</ion-buttons>-->\n\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <p *ngIf="!filteredLogs.length" translate>\n        No logs for selected level\n    </p>\n\n    <p *ngFor="let l of filteredLogs" [ngClass]="getLogLevelName(l.level)">\n        <b>[{{l.timestamp|amDateFormat}}]</b> <b>[{{getLogLevelName(l.level)}}]</b> <span *ngFor="let message of l.arguments">{{message}} </span>\n    </p>\n\n\n</ion-content>\n\n<ion-footer>\n    <ion-toolbar>\n\n        <ion-item (click)="copy()">\n            <ion-icon name="ios-clipboard-outline" item-left color="primary"></ion-icon>\n            <ion-label translate>Copy to clipboard</ion-label>\n        </ion-item>\n\n        <ion-grid>\n            <ion-row>\n                <ion-col translate>Error</ion-col>\n                <ion-col translate>Warning</ion-col>\n                <ion-col translate>Info</ion-col>\n                <ion-col translate>Debug</ion-col>\n            </ion-row>\n        </ion-grid>\n\n        <ion-range min="0" max="3" step="1" [(ngModel)]="logLevel" debounce="100" (ionChange)="filterLogs()"></ion-range>\n\n    </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/advanced-settings/session-log/session-log.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_logger__["a" /* Logger */]])
], SessionLogView);

//# sourceMappingURL=session-log.js.map

/***/ })

});
//# sourceMappingURL=41.js.map