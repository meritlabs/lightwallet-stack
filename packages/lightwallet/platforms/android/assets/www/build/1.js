webpackJsonp([1,5,9,13],{

/***/ 758:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddressBookModule", function() { return AddressBookModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_send_send_service__ = __webpack_require__(810);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__ = __webpack_require__(808);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_address_book_address_book__ = __webpack_require__(816);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_shared_address_book_merit_contact_builder__ = __webpack_require__(806);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_shared_address_book_merit_contact_service__ = __webpack_require__(813);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










// This module manaages the sending of money.
// This is the first of three steps.
let AddressBookModule = class AddressBookModule {
};
AddressBookModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5_merit_shared_address_book_address_book__["a" /* AddressBookView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_5_merit_shared_address_book_address_book__["a" /* AddressBookView */]),
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__["a" /* GravatarModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
            __WEBPACK_IMPORTED_MODULE_2_merit_transact_send_send_service__["a" /* SendService */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_contacts__["b" /* Contacts */],
            __WEBPACK_IMPORTED_MODULE_8_merit_shared_address_book_merit_contact_builder__["a" /* MeritContactBuilder */],
            __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
            __WEBPACK_IMPORTED_MODULE_9_merit_shared_address_book_merit_contact_service__["a" /* MeritContactService */]
        ],
        exports: []
    })
], AddressBookModule);

//# sourceMappingURL=address-book.module.js.map

/***/ }),

/***/ 759:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WalletsModule", function() { return WalletsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallets__ = __webpack_require__(821);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_language_service__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_app_update_service__ = __webpack_require__(815);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__feedback_feedback_service__ = __webpack_require__(814);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_easy_receive_easy_receive_service__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_in_app_browser__ = __webpack_require__(807);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_merit_shared_address_book_address_book_module__ = __webpack_require__(758);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_merit_shared_ledger_service__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_merit_vaults_vaults__ = __webpack_require__(823);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














let WalletsModule = class WalletsModule {
};
WalletsModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallets__["a" /* WalletsView */],
            __WEBPACK_IMPORTED_MODULE_13_merit_vaults_vaults__["a" /* VaultsView */]
        ],
        /** @DISCUSS what's the best place for app update service? */
        providers: [
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
            __WEBPACK_IMPORTED_MODULE_7_merit_core_app_update_service__["a" /* AppUpdateService */],
            __WEBPACK_IMPORTED_MODULE_8__feedback_feedback_service__["a" /* FeedbackService */],
            __WEBPACK_IMPORTED_MODULE_9_merit_easy_receive_easy_receive_service__["a" /* EasyReceiveService */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            __WEBPACK_IMPORTED_MODULE_5_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */],
            __WEBPACK_IMPORTED_MODULE_6_merit_core_language_service__["a" /* LanguageService */],
            __WEBPACK_IMPORTED_MODULE_12_merit_shared_ledger_service__["a" /* LedgerService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_angular2_moment__["MomentModule"],
            __WEBPACK_IMPORTED_MODULE_11_merit_shared_address_book_address_book_module__["AddressBookModule"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallets__["a" /* WalletsView */])
        ],
    })
], WalletsModule);

//# sourceMappingURL=wallets.module.js.map

/***/ }),

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

/***/ 773:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponentModule", function() { return SettingsComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_settings_settings__ = __webpack_require__(860);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_in_app_browser__ = __webpack_require__(807);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallets_module__ = __webpack_require__(759);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_settings_notifications_notifications_module__ = __webpack_require__(760);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






// Settings 
let SettingsComponentModule = class SettingsComponentModule {
};
SettingsComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_settings_settings__["a" /* SettingsView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_in_app_browser__["a" /* InAppBrowser */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallets_module__["WalletsModule"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_settings_settings__["a" /* SettingsView */]),
            __WEBPACK_IMPORTED_MODULE_5_merit_settings_notifications_notifications_module__["NotificationsViewModule"]
        ],
    })
], SettingsComponentModule);

//# sourceMappingURL=settings.module.js.map

/***/ }),

/***/ 804:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressBookService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_persistence_service__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_platform_service__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_merit_contact_builder__ = __webpack_require__(806);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_shared_config_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
 * This service looks up entered addresses against the address book.
 */
let AddressBookService = class AddressBookService {
    constructor(persistenceService, platformService, configService, contacts, logger, meritContactBuilder) {
        this.persistenceService = persistenceService;
        this.platformService = platformService;
        this.configService = configService;
        this.contacts = contacts;
        this.logger = logger;
        this.meritContactBuilder = meritContactBuilder;
    }
    get(addr, network) {
        return this.getAddressbook(network).then((addressBook) => {
            if (addressBook && addressBook[addr]) {
                return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](addressBook[addr]);
            }
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('contact with address ' + addr + ' not found'));
        }, (err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('error getting addressBook entry: ' + err));
        });
    }
    ;
    list(network) {
        return this.getAddressbook(network).then((addressBook) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](addressBook);
        }).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('error listing addressBook: ' + err));
        });
    }
    ;
    searchDeviceContacts(term) {
        let options = { filter: term, multiple: true };
        let fields = ['name', 'phoneNumbers', 'emails'];
        if (!this.platformService.isMobile)
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"]([]);
        return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](this.contacts.find(fields, options)).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"]([]);
        });
    }
    ;
    getAllDeviceContacts() {
        return this.searchDeviceContacts('');
    }
    searchContacts(contacts, searchQuery) {
        searchQuery = searchQuery.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        let exp = new RegExp(searchQuery, 'ig');
        return __WEBPACK_IMPORTED_MODULE_2_lodash__["filter"](contacts, (contact) => {
            if (contact.name.formatted && contact.name.formatted.match(exp))
                return true;
            if (__WEBPACK_IMPORTED_MODULE_2_lodash__["some"](contact.emails, (email) => email.value.match(exp)))
                return true;
            if (__WEBPACK_IMPORTED_MODULE_2_lodash__["some"](contact.phoneNumbers, (phoneNumber) => phoneNumber.value.match(exp)))
                return true;
            if (__WEBPACK_IMPORTED_MODULE_2_lodash__["some"](contact.meritAddresses, (address) => address.address.match(exp)))
                return true;
            return false;
        });
    }
    getAllMeritContacts() {
        return this.getAllDeviceContacts().then((deviceContacts) => {
            return this.getAddressbook(this.configService.getDefaults().network.name).then((localContacts) => {
                let contacts = __WEBPACK_IMPORTED_MODULE_2_lodash__["map"](__WEBPACK_IMPORTED_MODULE_2_lodash__["filter"](deviceContacts, contact => !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](contact.phoneNumbers) || !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](contact.emails)), contact => this.meritContactBuilder.build(contact));
                __WEBPACK_IMPORTED_MODULE_2_lodash__["each"](__WEBPACK_IMPORTED_MODULE_2_lodash__["map"](localContacts, contact => contact), (contact) => {
                    let currentContact = __WEBPACK_IMPORTED_MODULE_2_lodash__["find"](contacts, { id: contact.id });
                    if (currentContact) {
                        currentContact.meritAddresses = contact.meritAddresses;
                    }
                    else {
                        contacts.push(contact);
                    }
                });
                return contacts.sort((a, b) => {
                    if (!(__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](a.meritAddresses) || __WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](b.meritAddresses)) ||
                        (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](a.meritAddresses) && (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](b.meritAddresses)))) {
                        return a.name.formatted > b.name.formatted ? 1 : -1;
                    }
                    return (!__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](a.meritAddresses)) ? -1 : 1;
                });
            });
        });
    }
    add(entry, address, network) {
        return new __WEBPACK_IMPORTED_MODULE_1_bluebird__((resolve, reject) => {
            return this.getAddressbook(network).then((addressBook) => {
                if (addressBook[address])
                    return reject(new Error('contact already exists'));
                addressBook[address] = entry;
                return this.persistenceService.setAddressbook(network, addressBook).then(() => {
                    return resolve(addressBook);
                });
            });
        });
    }
    ;
    remove(addr, network) {
        return new __WEBPACK_IMPORTED_MODULE_1_bluebird__((resolve, reject) => {
            this.getAddressbook(network).then((addressBook) => {
                delete addressBook[addr];
                return this.persistenceService.setAddressbook(network, addressBook).then(() => {
                    return resolve(addressBook);
                });
            });
        });
    }
    ;
    removeAll(network) {
        return this.persistenceService.removeAddressbook(network).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('could not removeAll contacts: ' + err));
        });
    }
    ;
    getAddressbook(network) {
        return new __WEBPACK_IMPORTED_MODULE_1_bluebird__((resolve, reject) => {
            return this.persistenceService.getAddressbook(network).then((ab) => {
                if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](ab))
                    ab = {};
                resolve(ab);
            });
        });
    }
};
AddressBookService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_merit_core_persistence_service__["a" /* PersistenceService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_platform_service__["a" /* PlatformService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_contacts__["b" /* Contacts */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_merit_contact_builder__["a" /* MeritContactBuilder */]])
], AddressBookService);

//# sourceMappingURL=address-book.service.js.map

/***/ }),

/***/ 805:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Contact; });
/* unused harmony export ContactName */
/* unused harmony export ContactField */
/* unused harmony export ContactAddress */
/* unused harmony export ContactOrganization */
/* unused harmony export ContactFindOptions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Contacts; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__ = __webpack_require__(80);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * @hidden
 */
var Contact = (function () {
    function Contact() {
        if (Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["i" /* checkAvailability */])('navigator.contacts', 'create', 'Contacts') === true) {
            this._objectInstance = navigator.contacts.create();
        }
    }
    Contact.prototype.clone = function () {
        var newContact = new Contact();
        for (var prop in this) {
            if (prop === 'id')
                return;
            newContact[prop] = this[prop];
        }
        return newContact;
    };
    Contact.prototype.remove = function () { return; };
    Contact.prototype.save = function () {
        var _this = this;
        return Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["j" /* getPromise */])(function (resolve, reject) {
            _this._objectInstance.save(function (contact) {
                _this._objectInstance = contact;
                resolve(_this);
            }, reject);
        });
    };
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "id", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "displayName", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Object)
    ], Contact.prototype, "name", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "nickname", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "phoneNumbers", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "emails", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "addresses", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "ims", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "organizations", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Date)
    ], Contact.prototype, "birthday", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "note", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "photos", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "categories", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "urls", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["e" /* InstanceCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Contact)
    ], Contact.prototype, "clone", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Contact.prototype, "remove", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["e" /* InstanceCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Contact.prototype, "save", null);
    return Contact;
}());

/**
 * @hidden
 */
var ContactName = (function () {
    function ContactName(formatted, familyName, givenName, middleName, honorificPrefix, honorificSuffix) {
        this.formatted = formatted;
        this.familyName = familyName;
        this.givenName = givenName;
        this.middleName = middleName;
        this.honorificPrefix = honorificPrefix;
        this.honorificSuffix = honorificSuffix;
    }
    return ContactName;
}());

/**
 * @hidden
 */
var ContactField = (function () {
    function ContactField(type, value, pref) {
        this.type = type;
        this.value = value;
        this.pref = pref;
    }
    return ContactField;
}());

/**
 * @hidden
 */
var ContactAddress = (function () {
    function ContactAddress(pref, type, formatted, streetAddress, locality, region, postalCode, country) {
        this.pref = pref;
        this.type = type;
        this.formatted = formatted;
        this.streetAddress = streetAddress;
        this.locality = locality;
        this.region = region;
        this.postalCode = postalCode;
        this.country = country;
    }
    return ContactAddress;
}());

/**
 * @hidden
 */
var ContactOrganization = (function () {
    function ContactOrganization(type, name, department, title, pref) {
        this.type = type;
        this.name = name;
        this.department = department;
        this.title = title;
        this.pref = pref;
    }
    return ContactOrganization;
}());

/**
 * @hidden
 */
var ContactFindOptions = (function () {
    function ContactFindOptions(filter, multiple, desiredFields, hasPhoneNumber) {
        this.filter = filter;
        this.multiple = multiple;
        this.desiredFields = desiredFields;
        this.hasPhoneNumber = hasPhoneNumber;
    }
    return ContactFindOptions;
}());

/**
 * @name Contacts
 * @description
 * Access and manage Contacts on the device.
 *
 * @usage
 *
 * ```typescript
 * import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
 *
 * constructor(private contacts: Contacts) { }
 *
 * let contact: Contact = this.contacts.create();
 *
 * contact.name = new ContactName(null, 'Smith', 'John');
 * contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
 * contact.save().then(
 *   () => console.log('Contact saved!', contact),
 *   (error: any) => console.error('Error saving contact.', error)
 * );
 *
 * ```
 * @classes
 * Contact
 * @interfaces
 * IContactProperties
 * IContactError
 * IContactName
 * IContactField
 * IContactAddress
 * IContactOrganization
 * IContactFindOptions
 */
var Contacts = (function (_super) {
    __extends(Contacts, _super);
    function Contacts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Create a single contact.
     * @returns {Contact} Returns a Contact object
     */
    Contacts.prototype.create = function () {
        return new Contact();
    };
    /**
     * Search for contacts in the Contacts list.
     * @param fields {ContactFieldType[]}  Contact fields to be used as a search qualifier
     * @param options {IContactFindOptions} Optional options for the query
     * @returns {Promise<Contact[]>} Returns a Promise that resolves with the search results (an array of Contact objects)
     */
    Contacts.prototype.find = function (fields, options) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["j" /* getPromise */])(function (resolve, reject) {
            navigator.contacts.find(fields, function (contacts) {
                resolve(contacts.map(processContact));
            }, reject, options);
        });
    };
    /**
     * Select a single Contact.
     * @returns {Promise<Contact>} Returns a Promise that resolves with the selected Contact
     */
    Contacts.prototype.pickContact = function () {
        return Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["j" /* getPromise */])(function (resolve, reject) {
            navigator.contacts.pickContact(function (contact) { return resolve(processContact(contact)); }, reject);
        });
    };
    Contacts.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Contacts.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["b" /* CordovaCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], Contacts.prototype, "find", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["b" /* CordovaCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Contacts.prototype, "pickContact", null);
    Contacts = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'Contacts',
            plugin: 'cordova-plugin-contacts',
            pluginRef: 'navigator.contacts',
            repo: 'https://github.com/apache/cordova-plugin-contacts',
            platforms: ['Android', 'BlackBerry 10', 'Firefox OS', 'iOS', 'Ubuntu', 'Windows', 'Windows Phone 8']
        })
    ], Contacts);
    return Contacts;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

/**
 * @hidden
 */
function processContact(contact) {
    var newContact = new Contact();
    for (var prop in contact) {
        if (typeof contact[prop] === 'function')
            continue;
        newContact[prop] = contact[prop];
    }
    return newContact;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 806:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeritContactBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_merit_contact_model__ = __webpack_require__(809);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let MeritContactBuilder = class MeritContactBuilder {
    constructor(deviceContactsService) {
        this.deviceContactsService = deviceContactsService;
    }
    build(contact = {}) {
        let clone = val => val ? JSON.parse(JSON.stringify(val)) : null;
        let created = new __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_merit_contact_model__["a" /* MeritContact */]();
        if (contact instanceof __WEBPACK_IMPORTED_MODULE_1__ionic_native_contacts__["a" /* Contact */]) {
            created.nativeModel = contact;
            created.id = contact.id;
        }
        else if (contact instanceof __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_merit_contact_model__["a" /* MeritContact */]) {
            if (contact.nativeModel) {
                created.nativeModel = contact.nativeModel;
                created.id = contact.nativeModel.id;
            }
            else {
                created.id = contact.id || `merit-${new Date().getUTCMilliseconds()}`;
            }
        }
        else {
            let deviceContact = this.deviceContactsService.create();
            try {
                //the only way we can check that contact was created properly.
                // if cordova is not available, service returns object with non-working getters
                let check = deviceContact.name;
                created.nativeModel = deviceContact;
            }
            catch (e) {
                //we are in non-cordova environment, just leaving nativeModel empty
            }
        }
        created.name = clone(contact.name) || { formatted: '' };
        created.phoneNumbers = clone(contact.phoneNumbers) || [];
        created.emails = clone(contact.emails) || [];
        created.photos = clone(contact.photos) || [];
        if (contact['meritAddresses']) {
            created.meritAddresses = clone(contact['meritAddresses']) || [];
        }
        return created;
    }
};
MeritContactBuilder = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_contacts__["b" /* Contacts */]])
], MeritContactBuilder);

//# sourceMappingURL=merit-contact.builder.js.map

/***/ }),

/***/ 807:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export InAppBrowserObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InAppBrowser; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * @hidden
 */
var InAppBrowserObject = (function () {
    /**
     * Opens a URL in a new InAppBrowser instance, the current browser instance, or the system browser.
     * @param {string} url     The URL to load.
     * @param {string} [target="self"]  The target in which to load the URL, an optional parameter that defaults to _self.
     *                 _self: Opens in the WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
     *                 _blank: Opens in the InAppBrowser.
     *                 _system: Opens in the system's web browser.
     * @param {string | InAppBrowserOptions} [options] Options for the InAppBrowser. Optional, defaulting to: location=yes.
     *                 The options string must not contain any blank space, and each feature's
     *                 name/value pairs must be separated by a comma. Feature names are case insensitive.
     */
    function InAppBrowserObject(url, target, options) {
        try {
            if (options && typeof options !== 'string') {
                options = Object.keys(options).map(function (key) { return key + "=" + options[key]; }).join(',');
            }
            this._objectInstance = cordova.InAppBrowser.open(url, target, options);
        }
        catch (e) {
            window.open(url, target);
            console.warn('Native: InAppBrowser is not installed or you are running on a browser. Falling back to window.open.');
        }
    }
    /**
     * Displays an InAppBrowser window that was opened hidden. Calling this has no effect
     * if the InAppBrowser was already visible.
     */
    InAppBrowserObject.prototype.show = function () { };
    /**
     * Closes the InAppBrowser window.
     */
    InAppBrowserObject.prototype.close = function () { };
    /**
     * Hides an InAppBrowser window that is currently shown. Calling this has no effect
     * if the InAppBrowser was already hidden.
     */
    InAppBrowserObject.prototype.hide = function () { };
    /**
     * Injects JavaScript code into the InAppBrowser window.
     * @param script {Object} Details of the script to run, specifying either a file or code key.
     * @returns {Promise<any>}
     */
    InAppBrowserObject.prototype.executeScript = function (script) { return; };
    /**
     * Injects CSS into the InAppBrowser window.
     * @param css {Object} Details of the script to run, specifying either a file or code key.
     * @returns {Promise<any>}
     */
    InAppBrowserObject.prototype.insertCSS = function (css) { return; };
    /**
     * A method that allows you to listen to events happening in the browser.
     * @param event {string} Name of the event
     * @returns {Observable<InAppBrowserEvent>} Returns back an observable that will listen to the event on subscribe, and will stop listening to the event on unsubscribe.
     */
    InAppBrowserObject.prototype.on = function (event) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"](function (observer) {
            _this._objectInstance.addEventListener(event, observer.next.bind(observer));
            return function () { return _this._objectInstance.removeEventListener(event, observer.next.bind(observer)); };
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], InAppBrowserObject.prototype, "show", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], InAppBrowserObject.prototype, "close", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], InAppBrowserObject.prototype, "hide", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], InAppBrowserObject.prototype, "executeScript", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], InAppBrowserObject.prototype, "insertCSS", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["e" /* InstanceCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"])
    ], InAppBrowserObject.prototype, "on", null);
    return InAppBrowserObject;
}());

/**
 * @name In App Browser
 * @description Launches in app Browser
 * @usage
 * ```typescript
 * import { InAppBrowser } from '@ionic-native/in-app-browser';
 *
 * constructor(private iab: InAppBrowser) { }
 *
 *
 * ...
 *
 *
 * const browser = this.iab.create('https://ionicframework.com/');
 *
 * browser.executeScript(...);
 * browser.insertCSS(...);
 * browser.close();
 *
 * ```
 * @classes
 * InAppBrowserObject
 * @interfaces
 * InAppBrowserEvent
 * InAppBrowserOptions
 */
var InAppBrowser = (function (_super) {
    __extends(InAppBrowser, _super);
    function InAppBrowser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Opens a URL in a new InAppBrowser instance, the current browser instance, or the system browser.
     * @param  url {string}     The URL to load.
     * @param  target {string}  The target in which to load the URL, an optional parameter that defaults to _self.
     * @param  options {string} Options for the InAppBrowser. Optional, defaulting to: location=yes.
     *                 The options string must not contain any blank space, and each feature's
     *                 name/value pairs must be separated by a comma. Feature names are case insensitive.
     * @returns {InAppBrowserObject}
     */
    InAppBrowser.prototype.create = function (url, target, options) {
        return new InAppBrowserObject(url, target, options);
    };
    InAppBrowser.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    InAppBrowser.ctorParameters = function () { return []; };
    InAppBrowser = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'InAppBrowser',
            plugin: 'cordova-plugin-inappbrowser',
            pluginRef: 'cordova.InAppBrowser',
            repo: 'https://github.com/apache/cordova-plugin-inappbrowser',
            platforms: ['AmazonFire OS', 'Android', 'BlackBerry 10', 'Browser', 'Firefox OS', 'iOS', 'macOS', 'Ubuntu', 'Windows', 'Windows Phone']
        })
    ], InAppBrowser);
    return InAppBrowser;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 808:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GravatarModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__ = __webpack_require__(811);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// This module manaages the avatar/user-image of a user based on 
// email address.
let GravatarModule = class GravatarModule {
};
GravatarModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__["a" /* GravatarComponent */]
        ],
        imports: [],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__["a" /* GravatarComponent */]
        ]
    })
], GravatarModule);

//# sourceMappingURL=gravatar.module.js.map

/***/ }),

/***/ 809:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let Bitcore = __webpack_require__(45);
class MeritContact {
    constructor() {
        this.name = { formatted: '' };
        this.phoneNumbers = [];
        this.emails = [];
        this.photos = [];
        this.urls = [];
        this.meritAddresses = [];
    }
    isValid() {
        if (!this.name)
            return false;
        if (!this.meritAddresses.length)
            return false;
        let isValid = true;
        this.meritAddresses.forEach((address) => {
            if (!address.network) {
                isValid = false;
            }
            else {
                if (!Bitcore.Address.isValid(address.address))
                    isValid = false;
            }
        });
        return isValid;
    }
    formatAddress() {
        this.meritAddresses.forEach((val) => {
            if (val.address.indexOf('merit:') == 0)
                val.address = val.address.split(':')[1];
            try {
                val.network = Bitcore.Address.fromString(val.address).network.name;
                console.log('set network!', val.network);
            }
            catch (e) { }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MeritContact;

//# sourceMappingURL=merit-contact.model.js.map

/***/ }),

/***/ 810:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_rate_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_bluebird__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/*
  Service to help manage sending merit to others.
*/
let SendService = class SendService {
    constructor(bwcService, rate, config, logger) {
        this.bwcService = bwcService;
        this.rate = rate;
        this.config = config;
        this.logger = logger;
        this.logger.info('Hello SendService');
        this.bitcore = this.bwcService.getBitcore();
    }
    isAddressValid(addr) {
        // First, let's check to be sure it's the right format.
        try {
            let address = this.bitcore.Address.fromString(addr);
            let network = address.network;
            if (this.bitcore.Address.isValid(address, network))
                // If it is, then let's be sure it's beaconed.
                return this.isAddressUnlocked(addr, network);
            return __WEBPACK_IMPORTED_MODULE_5_bluebird__["resolve"](false);
        }
        catch (_e) {
            return __WEBPACK_IMPORTED_MODULE_5_bluebird__["resolve"](false);
        }
    }
    isAddressUnlocked(addr, network) {
        return new __WEBPACK_IMPORTED_MODULE_5_bluebird__((resolve, reject) => {
            const walletClient = this.bwcService.getClient(null, {});
            walletClient.validateAddress(addr, network).then((result) => {
                if (!result) {
                    reject(new Error("Could not validateAddress"));
                }
                else {
                    const isAddressBeaconed = result.isValid && result.isBeaconed;
                    resolve(isAddressBeaconed);
                }
            });
        });
    }
};
SendService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_rate_service__["a" /* RateService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */]])
], SendService);

//# sourceMappingURL=send.service.js.map

/***/ }),

/***/ 811:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GravatarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__ = __webpack_require__(812);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// Used to display friendly images of people who use gravatar.
let GravatarComponent = class GravatarComponent {
    ngOnInit() {
        if (this.email) {
            this.emailHash = __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__["Md5"].hashStr(this.email.toLowerCase() || '').toString();
        }
    }
};
GravatarComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'gravatar',
        inputs: ['name', 'height', 'width', 'email'],
        template: `
  <img  class="gravatar" [alt]="name" [height]="height"  [width]="width" 
  [src]="'https://secure.gravatar.com/avatar/'+emailHash+'.jpg?s='+width+'&d=mm'"> 
`
    })
], GravatarComponent);

//# sourceMappingURL=gravatar.component.js.map

/***/ }),

/***/ 812:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*

TypeScript Md5
==============

Based on work by
* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
* André Cruz: https://github.com/satazor/SparkMD5
* Raymond Hill: https://github.com/gorhill/yamd5.js

Effectively a TypeScrypt re-write of Raymond Hill JS Library

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.


*/
Object.defineProperty(exports, "__esModule", { value: true });
var Md5 = (function () {
    function Md5() {
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    }
    // One time hashing functions
    Md5.hashStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    };
    Md5.hashAsciiStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    };
    Md5._hex = function (x) {
        var hc = Md5.hexChars;
        var ho = Md5.hexOut;
        var n;
        var offset;
        var j;
        var i;
        for (i = 0; i < 4; i += 1) {
            offset = i * 8;
            n = x[i];
            for (j = 0; j < 8; j += 2) {
                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    };
    Md5._md5cycle = function (x, k) {
        var a = x[0];
        var b = x[1];
        var c = x[2];
        var d = x[3];
        // ff()
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        // gg()
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        // hh()
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        // ii()
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    };
    Md5.prototype.start = function () {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(Md5.stateIdentity);
        return this;
    };
    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    Md5.prototype.appendStr = function (str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var code;
        var i;
        for (i = 0; i < str.length; i += 1) {
            code = str.charCodeAt(i);
            if (code < 128) {
                buf8[bufLen++] = code;
            }
            else if (code < 0x800) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            }
            else if (code < 0xD800 || code > 0xDBFF) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if (code > 0x10FFFF) {
                    throw new Error('Unicode standard supports code points up to U+10FFFF');
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if (bufLen >= 64) {
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendAsciiStr = function (str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i;
        var j = 0;
        for (;;) {
            i = Math.min(str.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendByteArray = function (input) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i;
        var j = 0;
        for (;;) {
            i = Math.min(input.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = input[j++];
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.getState = function () {
        var self = this;
        var s = self._state;
        return {
            buffer: String.fromCharCode.apply(null, self._buffer8),
            buflen: self._bufferLength,
            length: self._dataLength,
            state: [s[0], s[1], s[2], s[3]]
        };
    };
    Md5.prototype.setState = function (state) {
        var buf = state.buffer;
        var x = state.state;
        var s = this._state;
        var i;
        this._dataLength = state.length;
        this._bufferLength = state.buflen;
        s[0] = x[0];
        s[1] = x[1];
        s[2] = x[2];
        s[3] = x[3];
        for (i = 0; i < buf.length; i += 1) {
            this._buffer8[i] = buf.charCodeAt(i);
        }
    };
    Md5.prototype.end = function (raw) {
        if (raw === void 0) { raw = false; }
        var bufLen = this._bufferLength;
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var i = (bufLen >> 2) + 1;
        var dataBitsLen;
        this._dataLength += bufLen;
        buf8[bufLen] = 0x80;
        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
        buf32.set(Md5.buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            Md5._md5cycle(this._state, buf32);
            buf32.set(Md5.buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        dataBitsLen = this._dataLength * 8;
        if (dataBitsLen <= 0xFFFFFFFF) {
            buf32[14] = dataBitsLen;
        }
        else {
            var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
            if (matches === null) {
                return;
            }
            var lo = parseInt(matches[2], 16);
            var hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        Md5._md5cycle(this._state, buf32);
        return raw ? this._state : Md5._hex(this._state);
    };
    // Private Static Variables
    Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
    Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    Md5.hexChars = '0123456789abcdef';
    Md5.hexOut = [];
    // Permanent instance is to use for one-call hashing
    Md5.onePassHasher = new Md5();
    return Md5;
}());
exports.Md5 = Md5;
if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    console.error('Md5 self test failed.');
}
//# sourceMappingURL=md5.js.map

/***/ }),

/***/ 813:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeritContactService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Creates MeritContact model and injects native contact in it
 */
let MeritContactService = class MeritContactService {
    constructor(addressBookService, bwcService, logger) {
        this.addressBookService = addressBookService;
        this.bwcService = bwcService;
        this.logger = logger;
        this.bitcore = bwcService.getBitcore();
    }
    updateModel(contact) {
        contact.nativeModel.name = contact.name;
        contact.nativeModel.emails = contact.emails;
        contact.nativeModel.phoneNumbers = contact.phoneNumbers;
        contact.nativeModel.urls = contact.urls;
    }
    add(contact) {
        if (!contact.isValid()) {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"]('Contact is not valid');
        }
        let address = contact.meritAddresses[0].address;
        let network = contact.meritAddresses[0].network;
        return this.addressBookService.add(contact, address, network);
    }
    edit(contact) {
        if (!contact.isValid()) {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"]('Contact is not valid');
        }
        let address = contact.meritAddresses[0].address;
        let network = contact.meritAddresses[0].network;
        return this.addressBookService.remove(address, network).then(() => {
            this.updateModel(contact);
            return this.addressBookService.add(contact, address, network);
        });
    }
    remove(contact) {
        let address = contact.meritAddresses[0].address;
        let network = contact.meritAddresses[0].network;
        return this.addressBookService.remove(address, network);
    }
};
MeritContactService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */]])
], MeritContactService);

//# sourceMappingURL=merit-contact.service.js.map

/***/ }),

/***/ 814:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeedbackService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_shared_config_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let FeedbackService = class FeedbackService {
    constructor(http, logger, configService) {
        this.http = http;
        this.logger = logger;
        this.configService = configService;
    }
    //todo it's working as a mock now!
    isFeedBackNeeded() {
        // check if we have stored feedbacks, for which version is latest
        // if we don't have any, resolve true
        // if we have some, compare versions
        return __WEBPACK_IMPORTED_MODULE_0_bluebird__["resolve"](true);
    }
    sendFeedback(feedback) {
        return __WEBPACK_IMPORTED_MODULE_0_bluebird__["resolve"](true);
    }
};
FeedbackService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_4_merit_shared_config_service__["a" /* ConfigService */]])
], FeedbackService);

//# sourceMappingURL=feedback.service.js.map

/***/ }),

/***/ 815:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppUpdateService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let AppUpdateService = class AppUpdateService {
    constructor(http, logger) {
        this.http = http;
        this.logger = logger;
    }
    //TODO It's a mock now!!
    isUpdateAvailable() {
        return __WEBPACK_IMPORTED_MODULE_0_bluebird__["resolve"](false);
    }
};
AppUpdateService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */]])
], AppUpdateService);

//# sourceMappingURL=app-update.service.js.map

/***/ }),

/***/ 816:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressBookView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let AddressBookView = class AddressBookView {
    constructor(navCtrl, navParams, addressBookService, logger, sanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.addressBookService = addressBookService;
        this.logger = logger;
        this.sanitizer = sanitizer;
        this.contacts = [];
        this.filteredContacts = [];
        this.renderingContacts = [];
        this.searchQuery = '';
        this.contactsOffset = 0;
        this.contactsLimit = 10;
    }
    ionViewWillEnter() {
        this.loading = true;
        this.updateContacts().then(() => {
            this.loading = false;
        });
    }
    updateContacts() {
        this.contactsOffset = 0;
        return this.addressBookService.getAllMeritContacts().then((contacts) => {
            this.contacts = contacts;
            this.filterContacts();
        });
    }
    filterContacts() {
        this.contactsOffset = 0;
        this.filteredContacts = this.addressBookService.searchContacts(this.contacts, this.searchQuery);
        this.renderingContacts = this.filteredContacts.slice(0, this.contactsLimit);
    }
    renderMoreContacts(infiniteScroll) {
        this.contactsOffset += this.contactsLimit;
        this.renderingContacts = this.renderingContacts.concat(this.filteredContacts.slice(this.contactsOffset, this.contactsOffset + this.contactsLimit));
        infiniteScroll.complete();
    }
    sanitizePhotoUrl(url) {
        return this.sanitizer.sanitize(__WEBPACK_IMPORTED_MODULE_1__angular_core__["SecurityContext"].URL, url);
    }
    doRefresh(refresher) {
        this.updateContacts().then(() => {
            refresher.complete();
        });
    }
    hasContacts() {
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](this.contacts);
    }
    toAddContact() {
        this.navCtrl.push('EditContactView');
    }
    toContact(contact) {
        this.navCtrl.push('ContactView', { contact: contact });
    }
};
AddressBookView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'addressbook-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/address-book/address-book.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Address Book</ion-title>\n\n        <ion-buttons end>\n            <button ion-button (click)="toAddContact()" translate>\n                <ion-icon name="add"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)"></ion-refresher>\n\n    <ion-searchbar\n            [(ngModel)]="searchQuery"\n            [showCancelButton]="shouldShowCancel"\n            (ionChange)="filterContacts()"\n            debounce="300">\n    </ion-searchbar>\n\n    <div *ngIf="loading" text-center>\n        <ion-spinner></ion-spinner>Loading contacts...\n    </div>\n\n    <ion-list *ngIf="!loading">\n        <ion-item *ngFor="let contact of renderingContacts" (click)="toContact(contact)">\n            <ion-avatar class="icon big-icon-svg" item-start>\n                <img [src]="sanitizePhotoUrl(contact.photos[0].value)" *ngIf="contact.photos.length">\n                <gravatar class="send-gravatar" [name]="contact.name.formatted" width="30" height="30" [email]="contact.emails[0]?.value || \'\'" *ngIf="!contact.photos.length"></gravatar>\n            </ion-avatar>\n            {{contact.name.formatted}}\n            <img item-right src="assets/img/16x16.png" *ngIf="contact.meritAddresses.length">\n        </ion-item>\n\n    </ion-list>\n\n    <ion-infinite-scroll (ionInfinite)="renderMoreContacts($event)" *ngIf="filteredContacts && filteredContacts.length > contactsOffset+contactsLimit">\n    </ion-infinite-scroll>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/address-book/address-book.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["c" /* DomSanitizer */]])
], AddressBookView);

//# sourceMappingURL=address-book.js.map

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

/***/ 821:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_feedback_feedback_service__ = __webpack_require__(814);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_feedback_feedback_model__ = __webpack_require__(822);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_app_update_service__ = __webpack_require__(815);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_in_app_browser__ = __webpack_require__(807);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_merit_easy_receive_easy_receive_service__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_merit_vaults_vaults_service__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_merit_shared_fiat_amount_model__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_merit_transact_rate_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ionic_angular_platform_platform__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





















/*
  Using bluebird promises!
  This gives us the ability to map over items and
  engage in async requests.

  TODO:
  -- Ensure that we get navParams and then fallback to the wallet service.
*/
let WalletsView = class WalletsView {
    constructor(navParams, navCtrl, app, logger, easyReceiveService, toastCtrl, appUpdateService, profileService, feedbackService, inAppBrowser, configService, alertController, walletService, txFormatService, events, addressbookService, vaultsService, applicationRef, zone, rateService, platform) {
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.app = app;
        this.logger = logger;
        this.easyReceiveService = easyReceiveService;
        this.toastCtrl = toastCtrl;
        this.appUpdateService = appUpdateService;
        this.profileService = profileService;
        this.feedbackService = feedbackService;
        this.inAppBrowser = inAppBrowser;
        this.configService = configService;
        this.alertController = alertController;
        this.walletService = walletService;
        this.txFormatService = txFormatService;
        this.events = events;
        this.addressbookService = addressbookService;
        this.vaultsService = vaultsService;
        this.applicationRef = applicationRef;
        this.zone = zone;
        this.rateService = rateService;
        this.platform = platform;
        this.showFeaturesBlock = false;
        this.feedbackData = new __WEBPACK_IMPORTED_MODULE_6_merit_feedback_feedback_model__["a" /* Feedback */]();
        this.txpsData = [];
        this.recentTransactionsData = [];
        // This is a callback used when a new wallet is created.
        this.refreshWalletList = () => {
            return this.updateAllWallets().then((wallets) => {
                this.wallets = wallets;
                return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"]();
            });
        };
        this.refreshVaultList = () => {
            return this.profileService.getHeadWalletClient().then((client) => {
                return this.updateVaults(client);
            });
        };
        this.logger.warn("Hellop WalletsView!");
        this.platform.resume.subscribe(() => {
            this.logger.info("WalletView is going to refresh data on resume.");
            this.updateAllInfo({ force: true }).then(() => {
                this.logger.info("Got updated data in walletsView on resume.");
            });
        });
        this.updateAllInfo({ force: true }).then(() => {
            this.logger.info("Got updated data in walletsView on Ready!!");
        });
        this.registerListeners();
    }
    doRefresh(refresher) {
        this.updateAllInfo({ force: true }).then(() => {
            refresher.complete();
        }).catch(() => {
            refresher.complete();
        });
    }
    ionViewDidLoad() {
        this.logger.warn("Hello WalletsView :: IonViewDidLoad!");
    }
    // public async showFeaturesBlock(): Promise<boolean> {
    //   return (this.newReleaseExists || this.feedbackNeeded);
    // }
    updateAllInfo(opts = { force: false }) {
        return new __WEBPACK_IMPORTED_MODULE_3_bluebird__((resolve, reject) => {
            return this.addressbookService.list(this.configService.getDefaults().network.name).then((addressBook) => {
                this.addressbook = addressBook;
                return this.updateAllWallets(opts.force);
            }).then((wallets) => {
                if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](wallets)) {
                    return resolve(null); //ToDo: add proper error handling;
                }
                this.wallets = wallets;
                // Now that we have wallets, we will proceed with the following operations in parallel.
                return __WEBPACK_IMPORTED_MODULE_3_bluebird__["join"](this.updateNetworkValue(wallets), this.processEasyReceive(), this.updateTxps({ limit: 3 }), this.updateVaults(__WEBPACK_IMPORTED_MODULE_2_lodash__["head"](this.wallets)), this.fetchNotifications(), (res) => {
                    this.logger.info("Done updating all info for wallet.");
                    return resolve();
                });
            }).catch((err) => {
                this.logger.info("Error updating information for all wallets.");
                this.logger.info(err);
                this.toastCtrl.create({
                    message: 'Failed to update information',
                    cssClass: __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                }).present();
                return resolve();
            });
        });
    }
    updateTxps(opts = { limit: 3 }) {
        return this.profileService.getTxps({ limit: 3 }).then((txps) => {
            this.txpsData = txps;
            return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"]();
        });
    }
    updateVaults(wallet) {
        return this.vaultsService.getVaults(wallet).then((vaults) => {
            this.logger.info('getting vaults', vaults);
            return __WEBPACK_IMPORTED_MODULE_3_bluebird__["map"](vaults, (vault) => {
                return this.vaultsService.getVaultCoins(wallet, vault).then((coins) => {
                    vault.amount = __WEBPACK_IMPORTED_MODULE_2_lodash__["sumBy"](coins, 'micros');
                    return this.txFormatService.toFiat(vault.amount, wallet.cachedStatus.alternativeIsoCode).then((alternativeAmount) => {
                        vault.altAmountStr = new __WEBPACK_IMPORTED_MODULE_18_merit_shared_fiat_amount_model__["a" /* FiatAmount */](vault.altAmount).amountStr;
                        vault.amountStr = this.txFormatService.formatAmountStr(vault.amount);
                        return vault;
                    });
                });
            }).then((vaults) => {
                this.vaults = vaults;
            });
        });
    }
    fetchNotifications() {
        this.logger.info("What is the recentTransactionsEnabled status?");
        this.logger.info(this.configService.get().recentTransactions.enabled);
        if (this.configService.get().recentTransactions.enabled) {
            this.recentTransactionsEnabled = true;
            return this.profileService.getNotifications({ limit: 3 }).then((result) => {
                this.logger.info("Show me the notifications: ", result);
                this.logger.info("WalletsView Received ${result.total} notifications upon resuming.");
                __WEBPACK_IMPORTED_MODULE_2_lodash__["each"](result.notifications, (n) => {
                    // We don't need to update the status here because it has 
                    // already been fetched as part of updateAllInfo();
                    this.processIncomingTransactionEvent(n, { updateStatus: false });
                });
                return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"]();
            });
        }
        return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"]();
    }
    processIncomingTransactionEvent(n, opts = { updateStatus: false }) {
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](n)) {
            return;
        }
        if (n.type) {
            switch (n.type) {
                case 'IncomingTx':
                    n.actionStr = 'Payment Received';
                    break;
                case 'IncomingCoinbase':
                    n.actionStr = 'Mining Reward';
                    break;
                case 'OutgoingTx':
                    n.actionStr = 'Payment Sent';
                    break;
                default:
                    n.actionStr = 'Recent Transaction';
                    break;
            }
        }
        // TODO: Localize
        if (n.data && n.data.amount) {
            n.amountStr = this.txFormatService.formatAmountStr(n.data.amount);
            this.txFormatService.formatToUSD(n.data.amount).then((usdAmount) => {
                n.fiatAmountStr = new __WEBPACK_IMPORTED_MODULE_18_merit_shared_fiat_amount_model__["a" /* FiatAmount */](+usdAmount).amountStr;
                // Let's make sure we don't have this notification already.
                let duplicate = __WEBPACK_IMPORTED_MODULE_2_lodash__["find"](this.recentTransactionsData, n);
                this.logger.info("duplicate notifications? : ", duplicate);
                if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](duplicate)) {
                    // We use angular's NgZone here to ensure that the view re-renders with new data.
                    // There may be a better way to do this.  
                    // TODO: Investigate why events.subscribe() does not appear to run inside 
                    // the angular zone.
                    this.zone.run(() => {
                        this.recentTransactionsData.push(n);
                    });
                }
            });
        }
        // Update the status of the wallet in question.
        // TODO: Consider revisiting the mutation approach here. 
        if (n.walletId && opts.updateStatus) {
            // Check if we have a wallet with the notification ID in the view.
            // If not, let's skip. 
            let foundIndex = __WEBPACK_IMPORTED_MODULE_2_lodash__["findIndex"](this.wallets, { 'id': n.walletId });
            if (!this.wallets[foundIndex]) {
                return;
            }
            this.walletService.invalidateCache(this.wallets[foundIndex]);
            __WEBPACK_IMPORTED_MODULE_3_bluebird__["join"]([
                this.walletService.getStatus(this.wallets[foundIndex]).then((status) => {
                    // Using angular's NgZone to ensure that the view knows to re-render.
                    this.zone.run(() => {
                        this.wallets[foundIndex].status = status;
                    });
                }),
                this.updateNetworkValue(this.wallets)
            ]);
        }
    }
    /**
     * Here, we register listeners that act on relevent Ionic Events
     * These listeners process event data, and also retrieve additional data
     * as needed.
     */
    registerListeners() {
        this.events.subscribe('Remote:IncomingTx', (walletId, type, n) => {
            this.logger.info("RL: Got an IncomingTx event with: ", walletId, type, n);
            this.processIncomingTransactionEvent(n, { updateStatus: true });
        });
        this.events.subscribe('Remote:IncomingCoinbase', (walletId, type, n) => {
            this.logger.info("RL: Got an IncomingCoinbase event with: ", walletId, type, n);
            this.processIncomingTransactionEvent(n, { updateStatus: true });
        });
    }
    /**
     * checks if pending easyreceive exists and if so, open it
     */
    processEasyReceive() {
        return this.easyReceiveService.getPendingReceipts().then((receipts) => {
            if (receipts[0]) {
                return this.easyReceiveService.validateEasyReceiptOnBlockchain(receipts[0], '').then((data) => {
                    if (data) {
                        this.showConfirmEasyReceivePrompt(receipts[0], data);
                    }
                    else {
                        this.showPasswordEasyReceivePrompt(receipts[0]);
                    }
                });
            }
            return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"]();
        });
    }
    showPasswordEasyReceivePrompt(receipt, highlightInvalidInput = false) {
        this.logger.info('show alert', highlightInvalidInput);
        this.alertController.create({
            title: `You've got merit from ${receipt.senderName}!`,
            cssClass: highlightInvalidInput ? 'invalid-input-prompt' : '',
            inputs: [{ name: 'password', placeholder: 'Enter password', type: 'password' }],
            buttons: [
                {
                    text: 'Ignore', role: 'cancel', handler: () => {
                        this.logger.info('You have declined easy receive');
                        this.easyReceiveService.deletePendingReceipt(receipt).then(() => {
                            this.processEasyReceive();
                        });
                    }
                },
                {
                    text: 'Validate', handler: (data) => {
                        if (!data || !data.password) {
                            this.showPasswordEasyReceivePrompt(receipt, true); //the only way we can validate password input by the moment 
                        }
                        else {
                            this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, data.password).then((data) => {
                                if (!data) {
                                    this.showPasswordEasyReceivePrompt(receipt, true);
                                }
                                else {
                                    this.showConfirmEasyReceivePrompt(receipt, data);
                                }
                            });
                        }
                    }
                }
            ]
        }).present();
    }
    showConfirmEasyReceivePrompt(receipt, data) {
        this.alertController.create({
            title: `You've got ${data.txn.amount} Merit!`,
            buttons: [
                {
                    text: 'Reject', role: 'cancel', handler: () => {
                        this.rejectEasyReceipt(receipt, data).then(() => {
                            this.processEasyReceive();
                        });
                    }
                },
                {
                    text: 'Accept', handler: () => {
                        this.acceptEasyReceipt(receipt, data).then(() => {
                            this.processEasyReceive();
                        });
                    }
                }
            ]
        }).present();
    }
    acceptEasyReceipt(receipt, data) {
        return new __WEBPACK_IMPORTED_MODULE_3_bluebird__((resolve, reject) => {
            this.profileService.getWallets().then((wallets) => {
                // TODO: Allow a user to choose which wallet to receive into.
                let wallet = wallets[0];
                if (!wallet)
                    return reject('no wallet');
                let forceNewAddress = false;
                this.walletService.getAddress(wallet, forceNewAddress).then((address) => {
                    this.easyReceiveService.acceptEasyReceipt(receipt, wallet, data, address).then((acceptanceTx) => {
                        this.logger.info('accepted easy send', acceptanceTx);
                        resolve();
                    });
                }).catch((err) => {
                    this.toastCtrl.create({
                        message: "There was an error retrieving your incoming payment.",
                        cssClass: __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                    });
                    reject();
                });
            });
        });
    }
    rejectEasyReceipt(receipt, data) {
        return new __WEBPACK_IMPORTED_MODULE_3_bluebird__((resolve, reject) => {
            this.profileService.getWallets().then((wallets) => {
                //todo implement wallet selection UI 
                let wallet = wallets[0];
                if (!wallet)
                    return reject(new Error('Could not retrieve wallet.'));
                this.easyReceiveService.rejectEasyReceipt(wallet, receipt, data).then(() => {
                    this.logger.info('Easy send returned');
                    resolve();
                }).catch(() => {
                    this.toastCtrl.create({
                        message: 'There was an error rejecting the Merit',
                        cssClass: __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
                    }).present();
                    reject();
                });
            });
        });
    }
    updateNetworkValue(wallets) {
        let totalAmount = 0;
        return __WEBPACK_IMPORTED_MODULE_3_bluebird__["each"](wallets, (wallet) => {
            return this.walletService.getANV(wallet).then((anv) => {
                totalAmount += anv;
            });
        }).then(() => {
            return this.txFormatService.formatToUSD(totalAmount).then((usdAmount) => {
                this.zone.run(() => {
                    this.totalNetworkValueFiat = new __WEBPACK_IMPORTED_MODULE_18_merit_shared_fiat_amount_model__["a" /* FiatAmount */](+usdAmount).amountStr;
                    this.totalNetworkValue = totalAmount;
                    this.totalNetworkValueMicros = this.txFormatService.parseAmount(this.totalNetworkValue, 'micros').amountUnitStr;
                });
                return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"]();
            });
        });
    }
    openWallet(wallet) {
        if (!wallet.isComplete) {
            this.navCtrl.push('CopayersView');
        }
        else {
            this.navCtrl.push('WalletDetailsView', { walletId: wallet.id, wallet: wallet });
        }
    }
    rateApp(mark) {
        this.feedbackData.mark = mark;
    }
    cancelFeedback() {
        this.feedbackData.mark = null;
    }
    sendFeedback() {
        this.feedbackNeeded = false;
        this.feedbackService.sendFeedback(this.feedbackData).catch(() => {
            this.toastCtrl.create({
                message: 'Failed to send feedback. Please try again later',
                cssClass: __WEBPACK_IMPORTED_MODULE_8_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
    }
    toLatestRelease() {
        this.inAppBrowser.create(this.configService.get().release.url);
    }
    toAddWallet() {
        let shareCode;
        if (!__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](this.wallets)) {
            let shareCode = this.wallets[0].shareCode;
            return this.navCtrl.push('CreateWalletView', { updateWalletListCB: this.refreshWalletList, unlockCode: shareCode });
        }
        return this.navCtrl.push('CreateWalletView', { updateWalletListCB: this.refreshWalletList });
    }
    toImportWallet() {
        this.navCtrl.push('ImportView');
    }
    updateAllWallets(force = false) {
        return this.profileService.getWallets().map((wallet) => {
            this.profileService.updateWalletSettings(wallet);
            return this.walletService.getStatus(wallet, { force: force }).then((status) => {
                wallet.status = status;
                return wallet;
            }).catch((err) => {
                return __WEBPACK_IMPORTED_MODULE_3_bluebird__["reject"](new Error('could not update wallets' + err));
            });
        });
    }
    openTransactionDetails(transaction) {
        this.navCtrl.push('TransactionView', { transaction: transaction });
    }
    toTxpDetails() {
        this.navCtrl.push('TxpView');
    }
    txpCreatedWithinPastDay(txp) {
        var createdOn = new Date(txp.createdOn * 1000);
        return ((new Date()).getTime() - createdOn.getTime()) < (1000 * 60 * 60 * 24);
    }
    needWalletStatuses() {
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](this.wallets)) {
            return true;
        }
        __WEBPACK_IMPORTED_MODULE_2_lodash__["each"](this.wallets, (wallet) => {
            if (!wallet.status) {
                return true;
            }
        });
        return false;
    }
    openRecentTxDetail(tx) {
        this.navCtrl.push('TxDetailsView', { walletId: tx.walletId, txId: tx.data.txid });
    }
};
WalletsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-wallets',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/wallets/wallets.html"*/'<ion-header>\n\n    <ion-navbar color="secondary" hideBackButton="true">\n        <ion-title>\n            <img src="assets/img/icons/logo-negative.svg">\n        </ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)" (onpull)="{}">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n\n    <ion-item-divider translate *ngIf="showFeatureBlock">\n        Features\n    </ion-item-divider>\n\n\n    <ion-item-divider translate>\n        Network\n    </ion-item-divider>\n\n    <ion-list class="network">\n        <ion-item>\n            <ion-avatar item-start>\n                <i class="merit-icon-merit"></i>\n            </ion-avatar>\n            <h2 style="white-space: normal">Total value of your network</h2>\n            <span item-end class="detail" >\n                <span *ngIf="totalNetworkValueMicros">\n                    <div class="amount">{{totalNetworkValueMicros}}</div>\n                    <div class="detail-fiat">\n                        {{totalNetworkValueFiat}}\n                    </div>\n                </span>\n                <ion-spinner *ngIf="!totalNetworkValueMicros"></ion-spinner>\n            </span>\n\n        </ion-item>\n    </ion-list>\n\n    <span *ngIf="txpsData?.txpsN && addressbook">\n        <ion-item-divider translate>\n            Payment Proposals\n            <ion-badge item-right>{{txpsData?.txpsN}}</ion-badge>\n        </ion-item-divider>\n        <ion-list>\n            <ion-item *ngFor="let txp of txpsData?.txps" (click)="toTxpDetails(txp)">\n                <span *ngIf="!txp.merchant">\n\n                    <span *ngIf="txp.message" class="ellipsis">{{txp.message}}</span>\n\n                    <span *ngIf="!txp.message && addressbook[txp.toAddress]" class="ellipsis">{{addressbook[txp.toAddress].name || addressbook[txp.toAddress]}}</span>\n\n                    <span *ngIf="!txp.message && !addressbook[txp.toAddress]" class="ellipsis" translate>Sending</span>\n                </span>\n\n                <span *ngIf="txp.merchant">\n                    <span *ngIf="txp.merchant.pr.ca" class="ellipsis">\n                        <ion-icon name="lock"></ion-icon> {{txp.merchant.domain}}</span>\n                    <span *ngIf="!txp.merchant.pr.ca" class="ellipsis">\n                        <ion-icon name="unlock"></ion-icon> {{txp.merchant.domain}}</span>\n                </span>\n\n                <span *ngIf="txp.action == \'sent\'">-</span>\n                <span *ngIf="txp.action == \'invalid\'" translate>(possible double spend)</span>\n                <span *ngIf="txp.action != \'invalid\'" translate> {{txp.amountStr}}</span>\n\n                <div *ngIf="txp.createdOn">\n                    <small *ngIf="txpCreatedWithinPastDay(txp)">{{txp.createdOn * 1000 | amTimeAgo}}</small>\n                    <small *ngIf="!txpCreatedWithinPastDay(txp)">{{txp.createdOn * 1000 | date:\'MMMM d, y\'}}</small>\n                </div>\n            </ion-item>\n        </ion-list>\n    </span>\n\n    <ion-item-divider translate>\n        Wallets\n    </ion-item-divider>\n    <ion-item *ngIf="!wallets"><ion-spinner item-left></ion-spinner><h2>Loading...</h2></ion-item>\n    <ion-list class="wallets" *ngIf="wallets">\n        <button ion-item *ngFor="let wallet of wallets" (click)="openWallet(wallet)" class="wallet">\n\n            <ion-avatar item-start class="btn wallet-icon" item-start [class.locked]="wallet.locked" [class.default]="!wallet.color" [style.background]="wallet.color">\n                <img src="assets/img/icon-wallet.svg">\n            </ion-avatar>\n\n            <h2 translate>{{wallet.name || wallet._id}}</h2>\n\n            <span *ngIf="!wallet.isComplete()" class="assertive" translate item-end>Incomplete</span>\n            <span class="detail" *ngIf="wallet.isComplete()" item-end>\n                <span class="amount" *ngIf="!wallet.balanceHidden && wallet.status">\n                    {{wallet.status.totalBalanceStr ? wallet.status.totalBalanceStr : ( wallet.cachedBalance ? wallet.cachedBalance + (wallet.cachedBalanceUpdatedOn\n                    ? \' &middot; \' + ( wallet.cachedBalanceUpdatedOn * 1000 | amTimeAgo) : \'\') : \'\' ) }}\n                    <ion-icon name="timer-outline" *ngIf="wallet.status.totalBalanceMicros != wallet.status.spendableAmount"></ion-icon>\n                </span>\n                <span *ngIf="wallet.balanceHidden" class="balance-hidden">\n                    [Balance Hidden]\n                </span>\n\n                <span *ngIf="wallet.n > 1">\n                    {{wallet.m}}-of-{{wallet.n}}\n                </span>\n                <div class="detail-fiat" *ngIf="!wallet.balanceHidden">\n                    {{wallet.status.totalBalanceAlternativeStr}}\n                </div>\n\n                <span class="error" *ngIf="wallet.error">{{wallet.error}}</span>\n            </span>\n\n        </button>\n    </ion-list>\n\n    <span class="recent-txns" *ngIf="recentTransactionsEnabled && recentTransactionsData && recentTransactionsData.length > 0">\n        <ion-item-divider translate>\n            <span>Recent Transactions</span>\n            <span class="badge badge-assertive m5t m10r" *ngIf="recentTransactionsData && recentTransactionsData.length>3"> {{recentTransactionsData.length}}</span>\n        </ion-item-divider>\n        <ion-list>\n            <button ion-item *ngFor="let recentTx of recentTransactionsData" (click)="openRecentTxDetail(recentTx)">\n                <h2>{{recentTx.actionStr}}</h2>\n                    <span class="detail" item-end>\n                        <span class="amount">{{recentTx.amountStr}}</span>\n                        <div class="detail-fiat">{{recentTx.fiatAmountStr}}</div>\n                    </span>\n            </button>\n        </ion-list>\n    </span>\n\n    <ion-item-divider translate>\n        Add New Wallet\n    </ion-item-divider>\n    <ion-list>\n        <button ion-item (click)="toAddWallet()" class="add-item">\n            <ion-avatar item-start class="btn">\n                <ion-icon name="add"></ion-icon>\n            </ion-avatar>\n            <h2 translate>\n                Create new wallet\n            </h2>\n        </button>\n\n        <button ion-item (click)="toImportWallet()" class="add-item">\n            <ion-avatar item-start class="btn">\n                <ion-icon name="ios-share-outline"></ion-icon>\n            </ion-avatar>\n            <h2 translate>\n                Import wallet\n            </h2>\n        </button>\n    </ion-list>\n\n    <view-vaults [vaults]="vaults" [refreshVaultList]="refreshVaultList"></view-vaults>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/wallets/wallets.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
        __WEBPACK_IMPORTED_MODULE_13_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_12_merit_easy_receive_easy_receive_service__["a" /* EasyReceiveService */],
        __WEBPACK_IMPORTED_MODULE_9_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_app_update_service__["a" /* AppUpdateService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_feedback_feedback_service__["a" /* FeedbackService */],
        __WEBPACK_IMPORTED_MODULE_10__ionic_native_in_app_browser__["a" /* InAppBrowser */],
        __WEBPACK_IMPORTED_MODULE_11_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_14_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_15_merit_transact_tx_format_service__["a" /* TxFormatService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_16_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_17_merit_vaults_vaults_service__["a" /* VaultsService */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ApplicationRef"],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
        __WEBPACK_IMPORTED_MODULE_19_merit_transact_rate_service__["a" /* RateService */],
        __WEBPACK_IMPORTED_MODULE_20_ionic_angular_platform_platform__["a" /* Platform */]])
], WalletsView);

//# sourceMappingURL=wallets.js.map

/***/ }),

/***/ 822:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Feedback {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Feedback;

//# sourceMappingURL=feedback.model.js.map

/***/ }),

/***/ 823:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_vaults_service__ = __webpack_require__(505);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let VaultsView = class VaultsView {
    constructor(navCtrl, vaultService) {
        this.navCtrl = navCtrl;
        this.vaultService = vaultService;
        this.vaults = [];
        this.refreshVaultList = () => { };
    }
    toAddVault() {
        this.navCtrl.push('CreateVaultGeneralInfoView', { refreshVaultList: this.refreshVaultList });
    }
    toVault(vault) {
        this.navCtrl.push('VaultDetailsView', { vaultId: vault._id, vault: vault });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], VaultsView.prototype, "vaults", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], VaultsView.prototype, "refreshVaultList", void 0);
VaultsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-vaults',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/vaults.html"*/'<ion-list>\n    <ion-item-divider translate *ngIf="vaults && vaults.length">\n        Vaults\n    </ion-item-divider>\n\n    <ion-list class="vaults" *ngIf="vaults && vaults.length">\n        <button ion-item *ngFor="let vault of vaults" (click)="toVault(vault)">\n\n            <ion-avatar item-start class="btn vault-icon">\n                <ion-icon name="lock"></ion-icon>\n            </ion-avatar>\n\n            <h2 translate class="vault-name">\n                {{ vault.name || vault._id }}\n            </h2>\n\n            <div class="detail" item-end>\n                <div class="amount">\n                    {{ vault.amountStr }}\n                </div>\n                <div class="detail-fiat">\n                    {{ vault.altAmountStr.amountStr }}\n                </div>\n                <div *ngIf="vault.status == \'pending\'" class="assertive detail-status" translate>\n                    Pending\n                </div>\n            </div>\n        </button>\n    </ion-list>\n\n    <ion-item-divider translate>\n            Add New Vault\n    </ion-item-divider>\n    <ion-list>\n        <button ion-item (click)="toAddVault()" class="add-item">\n            <ion-avatar item-start class="btn">\n                <ion-icon name="lock"></ion-icon>\n            </ion-avatar>\n            <h2 translate>\n                Create new vault\n            </h2>\n        </button>\n    </ion-list>\n</ion-list>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/vaults.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_merit_vaults_vaults_service__["a" /* VaultsService */]])
], VaultsView);

//# sourceMappingURL=vaults.js.map

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
        selector: 'notifications-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/settings/notifications/notifications.html"*/'<ion-header>\n        <ion-navbar color="secondary">\n          <ion-title>{{\'Notifications\' | translate}}</ion-title>\n        </ion-navbar>\n      \n      </ion-header>\n      \n      \n      <ion-content>\n      \n        <div *ngIf="usePushNotifications">\n          <ion-item>\n            <ion-label>{{ \'Enable push notifications\' | translate }}</ion-label>\n            <ion-toggle [(ngModel)]="pushNotifications" (ionChange)="pushNotificationsChange()"></ion-toggle>\n          </ion-item>\n        </div>\n      \n        <div *ngIf="!usePushNotifications && isIOSApp" translate>\n          Push notifications for {{appName}} are currently disabled. Enable them in the Settings app.\n        </div>\n      \n        <div *ngIf="usePushNotifications && pushNotifications">\n          <ion-item>\n            <ion-label>{{ \'Notify me when transactions are confirmed\' | translate }}</ion-label>\n            <ion-toggle [(ngModel)]="confirmedTxsNotifications" (ionChange)="confirmedTxsNotificationsChange()"></ion-toggle>\n          </ion-item>\n        </div>\n      \n      \n        <ion-item>\n          <ion-label>{{ \'Enable email notifications\' | translate }}</ion-label>\n          <ion-toggle [(ngModel)]="emailNotifications" (ionChange)="emailNotificationsChange()"></ion-toggle>\n        </ion-item>\n      \n        <div *ngIf="emailNotifications">\n          <div translate>\n            You\'ll receive email notifications about payments sent and received from your wallets.\n          </div>\n      \n          <form [formGroup]="emailForm">\n            <ion-list>\n              <ion-item>\n                <ion-label stacked>{{ \'Email Address\' | translate }}</ion-label>\n                <ion-input formControlName="email" type="email"></ion-input>\n              </ion-item>\n            </ion-list>\n      \n            <button ion-button block (click)="saveEmail()" [disabled]="emailForm.invalid">\n              {{ \'Save\' | translate }}\n            </button>\n          </form>\n        </div>\n      \n      </ion-content>\n      '/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/settings/notifications/notifications.html"*/,
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

/***/ }),

/***/ 860:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_in_app_browser__ = __webpack_require__(807);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let SettingsView = class SettingsView {
    constructor(navCtrl, navParams, app, alertCtrl, inAppBrowser, modalCtrl, configService, logger) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.inAppBrowser = inAppBrowser;
        this.modalCtrl = modalCtrl;
        this.configService = configService;
        this.logger = logger;
        this.availableLanguages = [];
        this.availableUnits = [];
        this.availableAlternateCurrencies = [];
        let config = this.configService.get();
        this.currentUnitName = config.wallet.settings.unitName;
        this.currentAlternativeName = config.wallet.settings.alternativeName;
        this.emailNotificationsEnabled = config.emailNotifications.enabled;
    }
    ionViewDidLoad() {
        //do something here
    }
    toAddressbook() {
        this.navCtrl.push('AddressBookView');
    }
    logout() {
        this.app.getRootNav().setRoot('OnboardingView');
    }
    toLanguageSelect() {
        let modal = this.modalCtrl.create('SelectLanguageModal', { currentLanguage: this.currentLanguageName, availableLanguages: [] });
        modal.present();
        modal.onDidDismiss((language) => {
            if (language)
                this.currentLanguageName = language;
        });
    }
    toFeedback() {
        this.navCtrl.push('FeedbackView');
    }
    toUnitSelect() {
        //@todo get from service
        let modal = this.modalCtrl.create('SelectUnitModal', { currentUnit: this.currentUnitName, availableUnits: [] });
        modal.present();
        modal.onDidDismiss((unit) => {
            this.logger.info(unit);
            if (unit)
                this.currentUnitName = unit;
        });
    }
    toCurrencySelect() {
        //@todo get from service
        let modal = this.modalCtrl.create('SelectCurrencyModal', { currentCurrency: this.currentAlternativeName, availableCurrencies: [] });
        modal.present();
        modal.onDidDismiss((unit) => {
            if (unit)
                this.currentUnitName = unit;
        });
    }
    toAdvancedSettings() {
        this.navCtrl.push('AdvancedSettingsView');
    }
    toAbout() {
        this.navCtrl.push('SettingsAboutView');
    }
    toNotifications() {
        this.navCtrl.push('NotificationsView');
    }
    help() {
        let url = this.configService.get().help.url;
        let confirm = this.alertCtrl.create({
            title: 'External link',
            message: 'Help and support information is available at the website',
            buttons: [
                { text: 'Cancel', role: 'cancel', handler: () => { } },
                { text: 'Open', handler: () => {
                        this.inAppBrowser.create(url);
                    } }
            ]
        });
        confirm.present();
    }
};
SettingsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-settings',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/settings/settings.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Settings</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list>\n\n        <!--<ion-item-divider translate>-->\n            <!--Information-->\n        <!--</ion-item-divider>-->\n\n\n        <!--<ion-item (click)="help()">-->\n            <!--<ion-icon name="help-circle" item-start></ion-icon>-->\n            <!--<ion-label>Help &amp; support</ion-label>-->\n        <!--</ion-item>-->\n\n        <!--<ion-item (click)="toFeedback()">-->\n            <!--<ion-icon name="mail" item-start></ion-icon>-->\n            <!--<ion-label translate>Send feedback</ion-label>-->\n        <!--</ion-item>-->\n\n        <ion-item-divider translate>\n            Preferences\n        </ion-item-divider>\n        <ion-item (click)="toNotifications()">\n                <ion-icon name="notifications" item-start></ion-icon>\n                Notifications\n              </ion-item>\n        <ion-item (click)="toAddressbook()">\n            <ion-icon name="contacts" item-start></ion-icon>\n            <ion-label translate>Address book</ion-label>\n        </ion-item>\n\n\n        <ion-item (click)="toLanguageSelect()" *ngIf="availableLanguages.length > 1">\n            <ion-icon name="globe" item-start></ion-icon>\n            <ion-label>\n               <h2 translate>Language</h2>\n               <p>{{currentLanguageName}}</p>\n            </ion-label>\n        </ion-item>\n\n\n        <ion-item (click)="toUnitSelect()" *ngIf="availableUnits.length > 1">\n            <ion-icon name="calculator" item-start></ion-icon>\n            <ion-label>\n                <h2 translate>Currency</h2>\n                <p>{{currentUnitName}}</p>\n            </ion-label>\n        </ion-item>\n\n        <ion-item (click)="toCurrencySelect()" *ngIf="availableAlternateCurrencies.length > 1">\n            <ion-icon name="cash" item-start></ion-icon>\n            <ion-label>\n                <h2  translate>Alternative currency</h2>\n                <p>{{currentAlternativeName}}</p>\n            </ion-label>\n        </ion-item>\n\n        <ion-item-divider translate>More</ion-item-divider>\n        <ion-item (click)="toAdvancedSettings()">\n            <ion-icon name="hammer" item-start></ion-icon>\n            Advanced\n        </ion-item>\n        <ion-item (click)="toAbout()">\n            <ion-icon name="apps" item-start></ion-icon>\n            About {{appName}}\n        </ion-item>\n    </ion-list>\n\n</ion-content>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/settings/settings.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_in_app_browser__["a" /* InAppBrowser */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */]])
], SettingsView);

//# sourceMappingURL=settings.js.map

/***/ })

});
//# sourceMappingURL=1.js.map