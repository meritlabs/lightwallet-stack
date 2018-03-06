webpackJsonp([13],{

/***/ 760:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationsViewModule", function() { return NotificationsViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_settings_notifications_notifications__ = __webpack_require__(841);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_notification_push_notification_service__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_shared_shared_module__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_notification_email_notification_service__ = __webpack_require__(508);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






// This module manaages the sending of money.
// This is the first of three steps.
let NotificationsViewModule = class NotificationsViewModule {
};
NotificationsViewModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_settings_notifications_notifications__["a" /* NotificationsView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_settings_notifications_notifications__["a" /* NotificationsView */]),
            __WEBPACK_IMPORTED_MODULE_4_merit_shared_shared_module__["a" /* SharedModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_core_notification_push_notification_service__["a" /* PushNotificationsService */],
            __WEBPACK_IMPORTED_MODULE_5_merit_core_notification_email_notification_service__["a" /* EmailNotificationsService */]
        ],
        exports: []
    })
], NotificationsViewModule);

//# sourceMappingURL=notifications.module.js.map

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

/***/ 841:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_app_settings_service__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_platform_service__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_notification_push_notification_service__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_notification_email_notification_service__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_shared_email_validator__ = __webpack_require__(842);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let NotificationsView = class NotificationsView {
    constructor(navCtrl, navParams, formBuilder, configService, appService, platformService, pushService, emailService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.configService = configService;
        this.appService = appService;
        this.platformService = platformService;
        this.pushService = pushService;
        this.emailService = emailService;
        this.emailForm = this.formBuilder.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, new __WEBPACK_IMPORTED_MODULE_8_merit_shared_email_validator__["a" /* EmailValidator */](configService, emailService).isValid])]
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationsPage');
        this.updateConfig();
    }
    updateConfig() {
        let config = this.configService.get();
        this.appName = this.appService.info.nameCase;
        this.usePushNotifications = this.platformService.isCordova;
        this.isIOSApp = this.platformService.isIOS && this.platformService.isCordova;
        this.pushNotifications = config.pushNotificationsEnabled;
        this.confirmedTxsNotifications = config.confirmedTxsNotifications ? config.confirmedTxsNotifications.enabled : false;
        this.emailForm.setValue({
            email: this.emailService.getEmailIfEnabled(config) || ''
        });
        this.emailNotifications = config.emailNotifications ? config.emailNotifications.enabled : false;
    }
    ;
    pushNotificationsChange() {
        let opts = {
            pushNotificationsEnabled: this.pushNotifications
        };
        this.configService.set(opts);
        if (opts.pushNotificationsEnabled)
            this.pushService.init();
        else
            this.pushService.disable();
    }
    ;
    confirmedTxsNotificationsChange() {
        let opts = {
            confirmedTxsNotifications: {
                enabled: this.confirmedTxsNotifications
            }
        };
        this.configService.set(opts);
    }
    ;
    emailNotificationsChange() {
        let opts = {
            enabled: this.emailNotifications,
            email: this.emailForm.value.email
        };
        this.emailService.updateEmail(opts);
    }
    ;
    saveEmail() {
        this.emailService.updateEmail({
            enabled: this.emailNotifications,
            email: this.emailForm.value.email
        });
    }
    ;
};
NotificationsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'notifications-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/notifications/notifications.html"*/'<ion-header>\n        <ion-navbar color="secondary">\n          <ion-title>{{\'Notifications\' | translate}}</ion-title>\n        </ion-navbar>\n      \n      </ion-header>\n      \n      \n      <ion-content>\n      \n        <div *ngIf="usePushNotifications">\n          <ion-item>\n            <ion-label>{{ \'Enable push notifications\' | translate }}</ion-label>\n            <ion-toggle [(ngModel)]="pushNotifications" (ionChange)="pushNotificationsChange()"></ion-toggle>\n          </ion-item>\n        </div>\n      \n        <div *ngIf="!usePushNotifications && isIOSApp" translate>\n          Push notifications for {{appName}} are currently disabled. Enable them in the Settings app.\n        </div>\n      \n        <div *ngIf="usePushNotifications && pushNotifications">\n          <ion-item>\n            <ion-label>{{ \'Notify me when transactions are confirmed\' | translate }}</ion-label>\n            <ion-toggle [(ngModel)]="confirmedTxsNotifications" (ionChange)="confirmedTxsNotificationsChange()"></ion-toggle>\n          </ion-item>\n        </div>\n      \n      \n        <ion-item>\n          <ion-label>{{ \'Enable email notifications\' | translate }}</ion-label>\n          <ion-toggle [(ngModel)]="emailNotifications" (ionChange)="emailNotificationsChange()"></ion-toggle>\n        </ion-item>\n      \n        <div *ngIf="emailNotifications">\n          <div translate>\n            You\'ll receive email notifications about payments sent and received from your wallets.\n          </div>\n      \n          <form [formGroup]="emailForm">\n            <ion-list>\n              <ion-item>\n                <ion-label stacked>{{ \'Email Address\' | translate }}</ion-label>\n                <ion-input formControlName="email" type="email"></ion-input>\n              </ion-item>\n            </ion-list>\n      \n            <button ion-button block (click)="saveEmail()" [disabled]="emailForm.invalid">\n              {{ \'Save\' | translate }}\n            </button>\n          </form>\n        </div>\n      \n      </ion-content>\n      '/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/notifications/notifications.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_app_settings_service__["a" /* AppService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_platform_service__["a" /* PlatformService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_notification_push_notification_service__["a" /* PushNotificationsService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_notification_email_notification_service__["a" /* EmailNotificationsService */]])
], NotificationsView);

//# sourceMappingURL=notifications.js.map

/***/ }),

/***/ 842:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EmailValidator {
    constructor(cnf, eml) {
        EmailValidator.cnf = cnf;
        EmailValidator.eml = eml;
    }
    isValid(control) {
        let config = EmailValidator.cnf.get();
        let latestEmail = EmailValidator.eml.getEmailIfEnabled(config);
        let validEmail = (/^[a-zA-Z0-9.!#$%&*+=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(control.value);
        if (validEmail && control.value != latestEmail) {
            return null;
        }
        return {
            "Invalid Email": true
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EmailValidator;

//# sourceMappingURL=email.validator.js.map

/***/ })

});
//# sourceMappingURL=13.js.map