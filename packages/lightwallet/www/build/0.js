webpackJsonp([0,5,9],{

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

/***/ 779:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReceiveComponentModule", function() { return ReceiveComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_receive_receive__ = __webpack_require__(866);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_qrcode__ = __webpack_require__(826);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallets_module__ = __webpack_require__(759);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_social_sharing__ = __webpack_require__(820);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_clipboard__ = __webpack_require__(825);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ng2_clip__ = __webpack_require__(830);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








let ReceiveComponentModule = class ReceiveComponentModule {
};
ReceiveComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_transact_receive_receive__["a" /* ReceiveView */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_social_sharing__["a" /* SocialSharing */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_clipboard__["a" /* Clipboard */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_angular2_qrcode__["a" /* QRCodeModule */],
            __WEBPACK_IMPORTED_MODULE_7_ng2_clip__["a" /* ClipModule */],
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallets_module__["WalletsModule"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_transact_receive_receive__["a" /* ReceiveView */]),
        ],
    })
], ReceiveComponentModule);

//# sourceMappingURL=receive.module.js.map

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
        selector: 'addressbook-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/shared/address-book/address-book.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Address Book</ion-title>\n\n        <ion-buttons end>\n            <button ion-button (click)="toAddContact()" translate>\n                <ion-icon name="add"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)"></ion-refresher>\n\n    <ion-searchbar\n            [(ngModel)]="searchQuery"\n            [showCancelButton]="shouldShowCancel"\n            (ionChange)="filterContacts()"\n            debounce="300">\n    </ion-searchbar>\n\n    <div *ngIf="loading" text-center>\n        <ion-spinner></ion-spinner>Loading contacts...\n    </div>\n\n    <ion-list *ngIf="!loading">\n        <ion-item *ngFor="let contact of renderingContacts" (click)="toContact(contact)">\n            <ion-avatar class="icon big-icon-svg" item-start>\n                <img [src]="sanitizePhotoUrl(contact.photos[0].value)" *ngIf="contact.photos.length">\n                <gravatar class="send-gravatar" [name]="contact.name.formatted" width="30" height="30" [email]="contact.emails[0]?.value || \'\'" *ngIf="!contact.photos.length"></gravatar>\n            </ion-avatar>\n            {{contact.name.formatted}}\n            <img item-right src="assets/img/16x16.png" *ngIf="contact.meritAddresses.length">\n        </ion-item>\n\n    </ion-list>\n\n    <ion-infinite-scroll (ionInfinite)="renderMoreContacts($event)" *ngIf="filteredContacts && filteredContacts.length > contactsOffset+contactsLimit">\n    </ion-infinite-scroll>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/shared/address-book/address-book.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["c" /* DomSanitizer */]])
], AddressBookView);

//# sourceMappingURL=address-book.js.map

/***/ }),

/***/ 820:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SocialSharing; });
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
 * @name Social Sharing
 * @description
 * Share text, files, images, and links via social networks, sms, and email.
 *
 * For Browser usage check out the Web Share API docs: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#web-share-api
 *
 * @usage
 * ```typescript
 * import { SocialSharing } from '@ionic-native/social-sharing';
 *
 * constructor(private socialSharing: SocialSharing) { }
 *
 * ...
 *
 * // Check if sharing via email is supported
 * this.socialSharing.canShareViaEmail().then(() => {
 *   // Sharing via email is possible
 * }).catch(() => {
 *   // Sharing via email is not possible
 * });
 *
 * // Share via email
 * this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
 *   // Success!
 * }).catch(() => {
 *   // Error!
 * });
 * ```
 */
var SocialSharing = (function (_super) {
    __extends(SocialSharing, _super);
    function SocialSharing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Shares using the share sheet
     * @param message {string} The message you would like to share.
     * @param subject {string} The subject
     * @param file {string|string[]} URL(s) to file(s) or image(s), local path(s) to file(s) or image(s), or base64 data of an image. Only the first file/image will be used on Windows Phone.
     * @param url {string} A URL to share
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.share = function (message, subject, file, url) { return; };
    /**
     * Shares using the share sheet with additional options and returns a result object or an error message (requires plugin version 5.1.0+)
     * @param options {object} The options object with the message, subject, files, url and chooserTitle properties.
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareWithOptions = function (options) { return; };
    /**
     * Checks if you can share via a specific app.
     * @param appName {string} App name or package name. Examples: instagram or com.apple.social.facebook
     * @param message {string}
     * @param subject {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.canShareVia = function (appName, message, subject, image, url) { return; };
    /**
     * Shares directly to Twitter
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaTwitter = function (message, image, url) { return; };
    /**
     * Shares directly to Facebook
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaFacebook = function (message, image, url) { return; };
    /**
     * Shares directly to Facebook with a paste message hint
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @param pasteMessageHint {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaFacebookWithPasteMessageHint = function (message, image, url, pasteMessageHint) { return; };
    /**
     * Shares directly to Instagram
     * @param message {string}
     * @param image {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaInstagram = function (message, image) { return; };
    /**
     * Shares directly to WhatsApp
     * @param message {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaWhatsApp = function (message, image, url) { return; };
    /**
     * Shares directly to a WhatsApp Contact
     * @param receiver {string} Pass phone number on Android, and Addressbook ID (abid) on iOS
     * @param message {string} Message to send
     * @param image {string} Image to send (does not work on iOS
     * @param url {string} Link to send
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaWhatsAppToReceiver = function (receiver, message, image, url) { return; };
    /**
     * Share via SMS
     * @param messge {string} message to send
     * @param phoneNumber {string} Number or multiple numbers seperated by commas
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaSMS = function (messge, phoneNumber) { return; };
    /**
     * Checks if you can share via email
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.canShareViaEmail = function () { return; };
    /**
     * Share via Email
     * @param message {string}
     * @param subject {string}
     * @param to {string[]}
     * @param cc {string[]} Optional
     * @param bcc {string[]} Optional
     * @param files {string|string[]} Optional URL or local path to file(s) to attach
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareViaEmail = function (message, subject, to, cc, bcc, files) { return; };
    /**
     * Share via AppName
     * @param appName {string} App name or package name. Examples: instagram or com.apple.social.facebook
     * @param message {string}
     * @param subject {string}
     * @param image {string}
     * @param url {string}
     * @returns {Promise<any>}
     */
    SocialSharing.prototype.shareVia = function (appName, message, subject, image, url) { return; };
    /**
     * defines the popup position before call the share method.
     * @param targetBounds {string} left, top, width, height
     */
    SocialSharing.prototype.setIPadPopupCoordinates = function (targetBounds) { };
    SocialSharing.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    SocialSharing.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 4,
            errorIndex: 5
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "share", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareWithOptions", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 5,
            errorIndex: 6,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "canShareVia", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 3,
            errorIndex: 4,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaTwitter", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 3,
            errorIndex: 4,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaFacebook", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 4,
            errorIndex: 5,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaFacebookWithPasteMessageHint", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaInstagram", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 3,
            errorIndex: 4,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaWhatsApp", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 4,
            errorIndex: 5,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaWhatsAppToReceiver", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaSMS", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "canShareViaEmail", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            platforms: ['iOS', 'Android'],
            successIndex: 6,
            errorIndex: 7
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Array, Array, Array, Object]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareViaEmail", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            successIndex: 5,
            errorIndex: 6,
            platforms: ['iOS', 'Android']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], SocialSharing.prototype, "shareVia", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            sync: true,
            platforms: ['iOS']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SocialSharing.prototype, "setIPadPopupCoordinates", null);
    SocialSharing = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'SocialSharing',
            plugin: 'cordova-plugin-x-socialsharing',
            pluginRef: 'plugins.socialsharing',
            repo: 'https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin',
            platforms: ['Android', 'Browser', 'iOS', 'Windows', 'Windows Phone']
        })
    ], SocialSharing);
    return SocialSharing;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

//# sourceMappingURL=index.js.map

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
        selector: 'view-wallets',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/wallets.html"*/'<ion-header>\n\n    <ion-navbar color="secondary" hideBackButton="true">\n        <ion-title>\n            <img src="assets/img/icons/logo-negative.svg">\n        </ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)" (onpull)="{}">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n\n    <ion-item-divider translate *ngIf="showFeatureBlock">\n        Features\n    </ion-item-divider>\n\n\n    <ion-item-divider translate>\n        Network\n    </ion-item-divider>\n\n    <ion-list class="network">\n        <ion-item>\n            <ion-avatar item-start>\n                <i class="merit-icon-merit"></i>\n            </ion-avatar>\n            <h2 style="white-space: normal">Total value of your network</h2>\n            <span item-end class="detail" >\n                <span *ngIf="totalNetworkValueMicros">\n                    <div class="amount">{{totalNetworkValueMicros}}</div>\n                    <div class="detail-fiat">\n                        {{totalNetworkValueFiat}}\n                    </div>\n                </span>\n                <ion-spinner *ngIf="!totalNetworkValueMicros"></ion-spinner>\n            </span>\n\n        </ion-item>\n    </ion-list>\n\n    <span *ngIf="txpsData?.txpsN && addressbook">\n        <ion-item-divider translate>\n            Payment Proposals\n            <ion-badge item-right>{{txpsData?.txpsN}}</ion-badge>\n        </ion-item-divider>\n        <ion-list>\n            <ion-item *ngFor="let txp of txpsData?.txps" (click)="toTxpDetails(txp)">\n                <span *ngIf="!txp.merchant">\n\n                    <span *ngIf="txp.message" class="ellipsis">{{txp.message}}</span>\n\n                    <span *ngIf="!txp.message && addressbook[txp.toAddress]" class="ellipsis">{{addressbook[txp.toAddress].name || addressbook[txp.toAddress]}}</span>\n\n                    <span *ngIf="!txp.message && !addressbook[txp.toAddress]" class="ellipsis" translate>Sending</span>\n                </span>\n\n                <span *ngIf="txp.merchant">\n                    <span *ngIf="txp.merchant.pr.ca" class="ellipsis">\n                        <ion-icon name="lock"></ion-icon> {{txp.merchant.domain}}</span>\n                    <span *ngIf="!txp.merchant.pr.ca" class="ellipsis">\n                        <ion-icon name="unlock"></ion-icon> {{txp.merchant.domain}}</span>\n                </span>\n\n                <span *ngIf="txp.action == \'sent\'">-</span>\n                <span *ngIf="txp.action == \'invalid\'" translate>(possible double spend)</span>\n                <span *ngIf="txp.action != \'invalid\'" translate> {{txp.amountStr}}</span>\n\n                <div *ngIf="txp.createdOn">\n                    <small *ngIf="txpCreatedWithinPastDay(txp)">{{txp.createdOn * 1000 | amTimeAgo}}</small>\n                    <small *ngIf="!txpCreatedWithinPastDay(txp)">{{txp.createdOn * 1000 | date:\'MMMM d, y\'}}</small>\n                </div>\n            </ion-item>\n        </ion-list>\n    </span>\n\n    <ion-item-divider translate>\n        Wallets\n    </ion-item-divider>\n    <ion-item *ngIf="!wallets"><ion-spinner item-left></ion-spinner><h2>Loading...</h2></ion-item>\n    <ion-list class="wallets" *ngIf="wallets">\n        <button ion-item *ngFor="let wallet of wallets" (click)="openWallet(wallet)" class="wallet">\n\n            <ion-avatar item-start class="btn wallet-icon" item-start [class.locked]="wallet.locked" [class.default]="!wallet.color" [style.background]="wallet.color">\n                <img src="assets/img/icon-wallet.svg">\n            </ion-avatar>\n\n            <h2 translate>{{wallet.name || wallet._id}}</h2>\n\n            <span *ngIf="!wallet.isComplete()" class="assertive" translate item-end>Incomplete</span>\n            <span class="detail" *ngIf="wallet.isComplete()" item-end>\n                <span class="amount" *ngIf="!wallet.balanceHidden && wallet.status">\n                    {{wallet.status.totalBalanceStr ? wallet.status.totalBalanceStr : ( wallet.cachedBalance ? wallet.cachedBalance + (wallet.cachedBalanceUpdatedOn\n                    ? \' &middot; \' + ( wallet.cachedBalanceUpdatedOn * 1000 | amTimeAgo) : \'\') : \'\' ) }}\n                    <ion-icon name="timer-outline" *ngIf="wallet.status.totalBalanceMicros != wallet.status.spendableAmount"></ion-icon>\n                </span>\n                <span *ngIf="wallet.balanceHidden" class="balance-hidden">\n                    [Balance Hidden]\n                </span>\n\n                <span *ngIf="wallet.n > 1">\n                    {{wallet.m}}-of-{{wallet.n}}\n                </span>\n                <div class="detail-fiat" *ngIf="!wallet.balanceHidden">\n                    {{wallet.status.totalBalanceAlternativeStr}}\n                </div>\n\n                <span class="error" *ngIf="wallet.error">{{wallet.error}}</span>\n            </span>\n\n        </button>\n    </ion-list>\n\n    <span class="recent-txns" *ngIf="recentTransactionsEnabled && recentTransactionsData && recentTransactionsData.length > 0">\n        <ion-item-divider translate>\n            <span>Recent Transactions</span>\n            <span class="badge badge-assertive m5t m10r" *ngIf="recentTransactionsData && recentTransactionsData.length>3"> {{recentTransactionsData.length}}</span>\n        </ion-item-divider>\n        <ion-list>\n            <button ion-item *ngFor="let recentTx of recentTransactionsData" (click)="openRecentTxDetail(recentTx)">\n                <h2>{{recentTx.actionStr}}</h2>\n                    <span class="detail" item-end>\n                        <span class="amount">{{recentTx.amountStr}}</span>\n                        <div class="detail-fiat">{{recentTx.fiatAmountStr}}</div>\n                    </span>\n            </button>\n        </ion-list>\n    </span>\n\n    <ion-item-divider translate>\n        Add New Wallet\n    </ion-item-divider>\n    <ion-list>\n        <button ion-item (click)="toAddWallet()" class="add-item">\n            <ion-avatar item-start class="btn">\n                <ion-icon name="add"></ion-icon>\n            </ion-avatar>\n            <h2 translate>\n                Create new wallet\n            </h2>\n        </button>\n\n        <button ion-item (click)="toImportWallet()" class="add-item">\n            <ion-avatar item-start class="btn">\n                <ion-icon name="ios-share-outline"></ion-icon>\n            </ion-avatar>\n            <h2 translate>\n                Import wallet\n            </h2>\n        </button>\n    </ion-list>\n\n    <view-vaults [vaults]="vaults" [refreshVaultList]="refreshVaultList"></view-vaults>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/wallets.html"*/,
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
        selector: 'view-vaults',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/vaults.html"*/'<ion-list>\n    <ion-item-divider translate *ngIf="vaults && vaults.length">\n        Vaults\n    </ion-item-divider>\n\n    <ion-list class="vaults" *ngIf="vaults && vaults.length">\n        <button ion-item *ngFor="let vault of vaults" (click)="toVault(vault)">\n\n            <ion-avatar item-start class="btn vault-icon">\n                <ion-icon name="lock"></ion-icon>\n            </ion-avatar>\n\n            <h2 translate class="vault-name">\n                {{ vault.name || vault._id }}\n            </h2>\n\n            <div class="detail" item-end>\n                <div class="amount">\n                    {{ vault.amountStr }}\n                </div>\n                <div class="detail-fiat">\n                    {{ vault.altAmountStr.amountStr }}\n                </div>\n                <div *ngIf="vault.status == \'pending\'" class="assertive detail-status" translate>\n                    Pending\n                </div>\n            </div>\n        </button>\n    </ion-list>\n\n    <ion-item-divider translate>\n            Add New Vault\n    </ion-item-divider>\n    <ion-list>\n        <button ion-item (click)="toAddVault()" class="add-item">\n            <ion-avatar item-start class="btn">\n                <ion-icon name="lock"></ion-icon>\n            </ion-avatar>\n            <h2 translate>\n                Create new vault\n            </h2>\n        </button>\n    </ion-list>\n</ion-list>'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/vaults.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_merit_vaults_vaults_service__["a" /* VaultsService */]])
], VaultsView);

//# sourceMappingURL=vaults.js.map

/***/ }),

/***/ 825:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Clipboard; });
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
 * @name Clipboard
 * @description
 * Clipboard management plugin for Cordova that supports iOS, Android, and Windows Phone 8.
 *
 *
 * @usage
 * ```typescript
 * import { Clipboard } from '@ionic-native/clipboard';
 *
 * constructor(private clipboard: Clipboard) { }
 *
 * ...
 *
 *
 * this.clipboard.copy('Hello world');
 *
 * this.clipboard.paste().then(
 *    (resolve: string) => {
 *       alert(resolve);
 *     },
 *     (reject: string) => {
 *       alert('Error: ' + reject);
 *     }
 *   );
 * ```
 */
var Clipboard = (function (_super) {
    __extends(Clipboard, _super);
    function Clipboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Copies the given text
     * @param {string} text Text that gets copied on the system clipboard
     * @returns {Promise<any>} Returns a promise after the text has been copied
     */
    Clipboard.prototype.copy = function (text) { return; };
    /**
     * Pastes the text stored in clipboard
     * @returns {Promise<any>} Returns a promise after the text has been pasted
     */
    Clipboard.prototype.paste = function () { return; };
    Clipboard.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Clipboard.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Clipboard.prototype, "copy", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Clipboard.prototype, "paste", null);
    Clipboard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'Clipboard',
            plugin: 'cordova-clipboard',
            pluginRef: 'cordova.plugins.clipboard',
            repo: 'https://github.com/ihadeed/cordova-clipboard',
            platforms: ['Android', 'iOS', 'Windows Phone 8']
        })
    ], Clipboard);
    return Clipboard;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 826:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export QRCodeComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QRCodeModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_qrious__ = __webpack_require__(827);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_qrious___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_qrious__);



var QRCodeComponent = (function () {
    /**
     * @param {?} elementRef
     */
    function QRCodeComponent(elementRef) {
        this.elementRef = elementRef;
        this.background = 'white';
        this.backgroundAlpha = 1.0;
        this.foreground = 'black';
        this.foregroundAlpha = 1.0;
        this.level = 'L';
        this.mime = 'image/png';
        this.padding = null;
        this.size = 100;
        this.value = '';
        this.canvas = false;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    QRCodeComponent.prototype.ngOnChanges = function (changes) {
        if ('background' in changes ||
            'backgroundAlpha' in changes ||
            'foreground' in changes ||
            'foregroundAlpha' in changes ||
            'level' in changes ||
            'mime' in changes ||
            'padding' in changes ||
            'size' in changes ||
            'value' in changes ||
            'canvas' in changes) {
            this.generate();
        }
    };
    /**
     * @return {?}
     */
    QRCodeComponent.prototype.generate = function () {
        try {
            var /** @type {?} */ el = this.elementRef.nativeElement;
            el.innerHTML = '';
            var /** @type {?} */ qr = new __WEBPACK_IMPORTED_MODULE_1_qrious___default.a({
                background: this.background,
                backgroundAlpha: this.backgroundAlpha,
                foreground: this.foreground,
                foregroundAlpha: this.foregroundAlpha,
                level: this.level,
                mime: this.mime,
                padding: this.padding,
                size: this.size,
                value: this.value
            });
            if (this.canvas) {
                el.appendChild(qr.canvas);
            }
            else {
                el.appendChild(qr.image);
            }
        }
        catch (e) {
            console.error("Could not generate QR Code: " + e.message);
        }
    };
    return QRCodeComponent;
}());
QRCodeComponent.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                moduleId: 'module.id',
                selector: 'qr-code',
                template: ""
            },] },
];
/**
 * @nocollapse
 */
QRCodeComponent.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
]; };
QRCodeComponent.propDecorators = {
    'background': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'backgroundAlpha': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'foreground': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'foregroundAlpha': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'level': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'mime': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'padding': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'size': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    'canvas': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
};
var QRCodeModule = (function () {
    function QRCodeModule() {
    }
    return QRCodeModule;
}());
QRCodeModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [QRCodeComponent],
                declarations: [QRCodeComponent]
            },] },
];
/**
 * @nocollapse
 */
QRCodeModule.ctorParameters = function () { return []; };

/**
 * Generated bundle index. Do not edit.
 */




/***/ }),

/***/ 827:
/***/ (function(module, exports, __webpack_require__) {

/*
 * QRious v2.3.0
 * Copyright (C) 2017 Alasdair Mercer
 * Copyright (C) 2010 Tom Zerucha
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('qrious', factory) :
	(global.QRious = factory());
}(this, (function () { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function(it){
	  return Object(_defined(it));
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
	});

	var SHARED = '__core-js_shared__';
	var store  = _global[SHARED] || (_global[SHARED] = {});
	var _shared = function(key){
	  return store[key] || (store[key] = {});
	};

	var id = 0;
	var px = Math.random();
	var _uid = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var shared = _shared('keys');
	var _sharedKey = function(key){
	  return shared[key] || (shared[key] = _uid(key));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var IE_PROTO    = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function(O){
	  O = _toObject(O);
	  if(_has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
	});

	var _aFunction = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function(fn, that, length){
	  _aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

	var _isObject = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function(it){
	  if(!_isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

	var document$1 = _global.document;
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function(it){
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function(){
	  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function(it, S){
	  if(!_isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP             = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if(_ie8DomDefine)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

	var _hide = _descriptors ? function(object, key, value){
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

	var PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? _core : _core[name] || (_core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? _ctx(out, _global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])_hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	var _export = $export;

	// most Object methods by ES6 should accept primitives

	var _objectSap = function(KEY, exec){
	  var fn  = (_core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function(){ fn(1); }), 'Object', exp);
	};

	// 19.1.2.9 Object.getPrototypeOf(O)


	_objectSap('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return _objectGpo(_toObject(it));
	  };
	});

	var getPrototypeOf$1 = _core.Object.getPrototypeOf;

	var getPrototypeOf = createCommonjsModule(function (module) {
	module.exports = { "default": getPrototypeOf$1, __esModule: true };
	});

	var _Object$getPrototypeOf = unwrapExports(getPrototypeOf);

	var classCallCheck = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	_export(_export.S + _export.F * !_descriptors, 'Object', {defineProperty: _objectDp.f});

	var $Object = _core.Object;
	var defineProperty$2 = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

	var defineProperty = createCommonjsModule(function (module) {
	module.exports = { "default": defineProperty$2, __esModule: true };
	});

	var createClass = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _defineProperty2 = _interopRequireDefault(defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();
	});

	var _createClass = unwrapExports(createClass);

	// 7.1.4 ToInteger
	var ceil  = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function(TO_STRING){
	  return function(that, pos){
	    var s = String(_defined(that))
	      , i = _toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _library = true;

	var _redefine = _hide;

	var _iterators = {};

	var toString = {}.toString;

	var _cof = function(it){
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings

	var _toIobject = function(it){
	  return _iobject(_defined(it));
	};

	// 7.1.15 ToLength
	var min       = Math.min;
	var _toLength = function(it){
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max       = Math.max;
	var min$1       = Math.min;
	var _toIndex = function(index, length){
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes

	var _arrayIncludes = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = _toIobject($this)
	      , length = _toLength(O.length)
	      , index  = _toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO$2     = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function(object, names){
	  var O      = _toIobject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO$2)_has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(_has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)


	var _objectKeys = Object.keys || function keys(O){
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
	  _anObject(O);
	  var keys   = _objectKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)_objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var _html = _global.document && document.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var IE_PROTO$1    = _sharedKey('IE_PROTO');
	var Empty       = function(){ /* empty */ };
	var PROTOTYPE$1   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe')
	    , i      = _enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var _wks = createCommonjsModule(function (module) {
	var store      = _shared('wks')
	  , Symbol     = _global.Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var def = _objectDp.f;
	var TAG = _wks('toStringTag');

	var _setToStringTag = function(it, tag, stat){
	  if(it && !_has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

	var _iterCreate = function(Constructor, NAME, next){
	  Constructor.prototype = _objectCreate(IteratorPrototype, {next: _propertyDesc(1, next)});
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	var ITERATOR       = _wks('iterator');
	var BUGGY          = !([].keys && 'next' in [].keys());
	var FF_ITERATOR    = '@@iterator';
	var KEYS           = 'keys';
	var VALUES         = 'values';

	var returnThis = function(){ return this; };

	var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = _objectGpo($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!_library && !_has(IteratorPrototype, ITERATOR))_hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    _hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))_redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var $at  = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

	var _addToUnscopables = function(){ /* empty */ };

	var _iterStep = function(done, value){
	  return {value: value, done: !!done};
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if(kind == 'keys'  )return _iterStep(0, index);
	  if(kind == 'values')return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var TO_STRING_TAG = _wks('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = _global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])_hide(proto, TO_STRING_TAG, NAME);
	  _iterators[NAME] = _iterators.Array;
	}

	var f$1 = _wks;

	var _wksExt = {
		f: f$1
	};

	var iterator$2 = _wksExt.f('iterator');

	var iterator = createCommonjsModule(function (module) {
	module.exports = { "default": iterator$2, __esModule: true };
	});

	var _meta = createCommonjsModule(function (module) {
	var META     = _uid('meta')
	  , setDesc  = _objectDp.f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !_fails(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!_isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!_has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!_has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !_has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};
	});

	var defineProperty$4 = _objectDp.f;
	var _wksDefine = function(name){
	  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty$4($Symbol, name, {value: _wksExt.f(name)});
	};

	var _keyof = function(object, el){
	  var O      = _toIobject(object)
	    , keys   = _objectKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

	var f$2 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$2
	};

	var f$3 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$3
	};

	// all enumerable object keys, includes symbols

	var _enumKeys = function(it){
	  var result     = _objectKeys(it)
	    , getSymbols = _objectGops.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = _objectPie.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg){
	  return _cof(arg) == 'Array';
	};

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$5
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var gOPN$1      = _objectGopn.f;
	var toString$1  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN$1(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	var f$4 = function getOwnPropertyNames(it){
	  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
	};

	var _objectGopnExt = {
		f: f$4
	};

	var gOPD$1           = Object.getOwnPropertyDescriptor;

	var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P){
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if(_ie8DomDefine)try {
	    return gOPD$1(O, P);
	  } catch(e){ /* empty */ }
	  if(_has(O, P))return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$6
	};

	// ECMAScript 6 symbols shim
	var META           = _meta.KEY;
	var gOPD           = _objectGopd.f;
	var dP$1             = _objectDp.f;
	var gOPN           = _objectGopnExt.f;
	var $Symbol        = _global.Symbol;
	var $JSON          = _global.JSON;
	var _stringify     = $JSON && $JSON.stringify;
	var PROTOTYPE$2      = 'prototype';
	var HIDDEN         = _wks('_hidden');
	var TO_PRIMITIVE   = _wks('toPrimitive');
	var isEnum         = {}.propertyIsEnumerable;
	var SymbolRegistry = _shared('symbol-registry');
	var AllSymbols     = _shared('symbols');
	var OPSymbols      = _shared('op-symbols');
	var ObjectProto$1    = Object[PROTOTYPE$2];
	var USE_NATIVE     = typeof $Symbol == 'function';
	var QObject        = _global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = _descriptors && _fails(function(){
	  return _objectCreate(dP$1({}, 'a', {
	    get: function(){ return dP$1(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto$1, key);
	  if(protoDesc)delete ObjectProto$1[key];
	  dP$1(it, key, D);
	  if(protoDesc && it !== ObjectProto$1)dP$1(ObjectProto$1, key, protoDesc);
	} : dP$1;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto$1)$defineProperty(OPSymbols, key, D);
	  _anObject(it);
	  key = _toPrimitive(key, true);
	  _anObject(D);
	  if(_has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!_has(it, HIDDEN))dP$1(it, HIDDEN, _propertyDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(_has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _objectCreate(D, {enumerable: _propertyDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP$1(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  _anObject(it);
	  var keys = _enumKeys(P = _toIobject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = _toPrimitive(key, true));
	  if(this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return false;
	  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = _toIobject(it);
	  key = _toPrimitive(key, true);
	  if(it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(_toIobject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto$1
	    , names  = gOPN(IS_OP ? OPSymbols : _toIobject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto$1)$set.call(OPSymbols, value);
	      if(_has(this, HIDDEN) && _has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, _propertyDesc(1, value));
	    };
	    if(_descriptors && setter)setSymbolDesc(ObjectProto$1, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString(){
	    return this._k;
	  });

	  _objectGopd.f = $getOwnPropertyDescriptor;
	  _objectDp.f   = $defineProperty;
	  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
	  _objectPie.f  = $propertyIsEnumerable;
	  _objectGops.f = $getOwnPropertySymbols;

	  if(_descriptors && !_library){
	    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  _wksExt.f = function(name){
	    return wrap(_wks(name));
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i$1 = 0; symbols.length > i$1; )_wks(symbols[i$1++]);

	for(var symbols = _objectKeys(_wks.store), i$1 = 0; symbols.length > i$1; )_wksDefine(symbols[i$1++]);

	_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return _has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return _keyof(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !_isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	_setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	_setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	_setToStringTag(_global.JSON, 'JSON', true);

	_wksDefine('asyncIterator');

	_wksDefine('observable');

	var index = _core.Symbol;

	var symbol = createCommonjsModule(function (module) {
	module.exports = { "default": index, __esModule: true };
	});

	var _typeof_1 = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _iterator2 = _interopRequireDefault(iterator);



	var _symbol2 = _interopRequireDefault(symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};
	});

	var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _typeof3 = _interopRequireDefault(_typeof_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};
	});

	var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */

	var check = function(O, proto){
	  _anObject(O);
	  if(!_isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	// 19.1.3.19 Object.setPrototypeOf(O, proto)

	_export(_export.S, 'Object', {setPrototypeOf: _setProto.set});

	var setPrototypeOf$2 = _core.Object.setPrototypeOf;

	var setPrototypeOf = createCommonjsModule(function (module) {
	module.exports = { "default": setPrototypeOf$2, __esModule: true };
	});

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	_export(_export.S, 'Object', {create: _objectCreate});

	var $Object$1 = _core.Object;
	var create$2 = function create(P, D){
	  return $Object$1.create(P, D);
	};

	var create = createCommonjsModule(function (module) {
	module.exports = { "default": create$2, __esModule: true };
	});

	var inherits = createCommonjsModule(function (module, exports) {
	"use strict";

	exports.__esModule = true;



	var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf);



	var _create2 = _interopRequireDefault(create);



	var _typeof3 = _interopRequireDefault(_typeof_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};
	});

	var _inherits = unwrapExports(inherits);

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Contains utility methods that are useful throughout the library.
	 *
	 * @public
	 */
	var Utilities = function () {
	  function Utilities() {
	    _classCallCheck(this, Utilities);
	  }

	  _createClass(Utilities, null, [{
	    key: "abs",


	    /**
	     * Returns the absolute value of a given number.
	     *
	     * This method is simply a convenient shorthand for <code>Math.abs</code> while ensuring that nulls are returned as
	     * <code>null</code> instead of zero.
	     *
	     * @param {number} value - the number whose absolute value is to be returned
	     * @return {number} The absolute value of <code>value</code> or <code>null</code> if <code>value</code> is
	     * <code>null</code>.
	     * @public
	     * @static
	     */
	    value: function abs(value) {
	      return value != null ? Math.abs(value) : null;
	    }

	    /**
	     * Returns whether the specified <code>object</code> has a property with the specified <code>name</code> as an own
	     * (not inherited) property.
	     *
	     * @param {Object} object - the object on which the property is to be checked
	     * @param {string} name - the name of the property to be checked
	     * @return {boolean} <code>true</code> if <code>object</code> has an own property with <code>name</code>.
	     * @public
	     * @static
	     */

	  }, {
	    key: "hasOwn",
	    value: function hasOwn(object, name) {
	      return Object.prototype.hasOwnProperty.call(object, name);
	    }

	    /**
	     * Throws an error indicating that the a given method on a specific class has not been implemented.
	     *
	     * @param {string} className - the name of the class on which the method has not been implemented
	     * @param {string} methodName - the name of the method which has not been implemented
	     * @return {void}
	     * @throws {Error} The error describing the class method which has not been implemented.
	     * @public
	     * @static
	     */

	  }, {
	    key: "throwUnimplemented",
	    value: function throwUnimplemented(className, methodName) {
	      throw new Error("\"" + methodName + "\" method must be implemented on the " + className + " class");
	    }

	    /**
	     * Transforms the specified <code>string</code> to upper case while remaining null-safe.
	     *
	     * @param {string} string - the string to be transformed to upper case
	     * @return {string} <code>string</code> transformed to upper case if <code>string</code> is not <code>null</code>.
	     * @public
	     * @static
	     */

	  }, {
	    key: "toUpperCase",
	    value: function toUpperCase(string) {
	      return string != null ? string.toUpperCase() : null;
	    }
	  }]);

	  return Utilities;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Defines a service contract that must be met by all implementations.
	 *
	 * @public
	 */

	var Service = function () {
	  function Service() {
	    _classCallCheck(this, Service);
	  }

	  _createClass(Service, [{
	    key: 'getName',


	    /**
	     * Returns the name of this {@link Service}.
	     *
	     * @return {string} The service name.
	     * @public
	     */
	    value: function getName() {
	      Utilities.throwUnimplemented('Service', 'getName');
	    }
	  }]);

	  return Service;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * A service for working with elements.
	 *
	 * @public
	 * @extends Service
	 */

	var ElementService = function (_Service) {
	  _inherits(ElementService, _Service);

	  function ElementService() {
	    _classCallCheck(this, ElementService);

	    return _possibleConstructorReturn(this, (ElementService.__proto__ || _Object$getPrototypeOf(ElementService)).apply(this, arguments));
	  }

	  _createClass(ElementService, [{
	    key: 'createCanvas',


	    /**
	     * Creates an instance of a canvas element.
	     *
	     * @return {*} The newly created canvas element.
	     * @public
	     */
	    value: function createCanvas() {
	      Utilities.throwUnimplemented('ElementService', 'createCanvas');
	    }

	    /**
	     * Creates an instance of a image element.
	     *
	     * @return {*} The newly created image element.
	     * @public
	     */

	  }, {
	    key: 'createImage',
	    value: function createImage() {
	      Utilities.throwUnimplemented('ElementService', 'createImage');
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'getName',
	    value: function getName() {
	      return 'element';
	    }

	    /**
	     * Returns whether the specified <code>element</code> is a canvas.
	     *
	     * @param {*} element - the element to be checked
	     * @return {boolean} <code>true</code> if <code>element</code> is a canvas; otherwise <code>false</code>.
	     * @public
	     */

	  }, {
	    key: 'isCanvas',
	    value: function isCanvas(element) {
	      Utilities.throwUnimplemented('ElementService', 'isCanvas');
	    }

	    /**
	     * Returns whether the specified <code>element</code> is an image.
	     *
	     * @param {*} element - the element to be checked
	     * @return {boolean} <code>true</code> if <code>element</code> is an image; otherwise <code>false</code>.
	     * @public
	     */

	  }, {
	    key: 'isImage',
	    value: function isImage(element) {
	      Utilities.throwUnimplemented('ElementService', 'isImage');
	    }
	  }]);

	  return ElementService;
	}(Service);

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * An implementation of {@link ElementService} intended for use within a browser environment.
	 *
	 * @public
	 * @extends ElementService
	 */

	var BrowserElementService = function (_ElementService) {
	  _inherits(BrowserElementService, _ElementService);

	  function BrowserElementService() {
	    _classCallCheck(this, BrowserElementService);

	    return _possibleConstructorReturn(this, (BrowserElementService.__proto__ || _Object$getPrototypeOf(BrowserElementService)).apply(this, arguments));
	  }

	  _createClass(BrowserElementService, [{
	    key: 'createCanvas',


	    /**
	     * @override
	     */
	    value: function createCanvas() {
	      return document.createElement('canvas');
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'createImage',
	    value: function createImage() {
	      return document.createElement('img');
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'isCanvas',
	    value: function isCanvas(element) {
	      return element instanceof HTMLCanvasElement;
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'isImage',
	    value: function isImage(element) {
	      return element instanceof HTMLImageElement;
	    }
	  }]);

	  return BrowserElementService;
	}(ElementService);

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Responsible for rendering a QR code {@link Frame} on a specific type of element.
	 *
	 * A renderer may be dependant on the rendering of another element, so the ordering of their execution is important.
	 *
	 * The rendering of a element can be deferred by disabling the renderer initially, however, any attempt get the element
	 * from the renderer will result in it being immediately enabled and the element being rendered.
	 *
	 * @public
	 */

	var Renderer = function () {

	  /**
	   * Creates a new instance of {@link Renderer} for the <code>qrious</code> instance and <code>element</code> provided.
	   *
	   * @param {QRious} qrious - the {@link QRious} instance to be used
	   * @param {*} element - the element onto which the QR code is to be rendered
	   * @param {boolean} [enabled] - <code>true</code> this {@link Renderer} is enabled; otherwise <code>false</code>.
	   * @public
	   */
	  function Renderer(qrious, element, enabled) {
	    _classCallCheck(this, Renderer);

	    /**
	     * The {@link QRious} instance.
	     *
	     * @protected
	     * @type {QRious}
	     */
	    this.qrious = qrious;

	    /**
	     * The element onto which this {@link Renderer} is rendering the QR code.
	     *
	     * @protected
	     * @type {*}
	     */
	    this.element = element;
	    this.element.qrious = qrious;

	    /**
	     * Whether this {@link Renderer} is enabled.
	     *
	     * @protected
	     * @type {boolean}
	     */
	    this.enabled = Boolean(enabled);
	  }

	  /**
	   * Draws the specified QR code <code>frame</code> on the underlying element.
	   *
	   * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
	   *
	   * @param {Frame} frame - the {@link Frame} to be drawn
	   * @return {void}
	   * @protected
	   */


	  _createClass(Renderer, [{
	    key: 'draw',
	    value: function draw(frame) {
	      Utilities.throwUnimplemented('Renderer', 'draw');
	    }

	    /**
	     * Returns the element onto which this {@link Renderer} is rendering the QR code.
	     *
	     * If this method is called while this {@link Renderer} is disabled, it will be immediately enabled and rendered
	     * before the element is returned.
	     *
	     * @return {*} The element.
	     * @public
	     */

	  }, {
	    key: 'getElement',
	    value: function getElement() {
	      if (!this.enabled) {
	        this.enabled = true;
	        this.render();
	      }

	      return this.element;
	    }

	    /**
	     * Calculates the size (in pixel units) to represent an individual module within the QR code based on the
	     * <code>frame</code> provided.
	     *
	     * Any configured padding will be excluded from the returned size.
	     *
	     * The returned value will be at least one, even in cases where the size of the QR code does not fit its contents.
	     * This is done so that the inevitable clipping is handled more gracefully since this way at least something is
	     * displayed instead of just a blank space filled by the background color.
	     *
	     * @param {Frame} frame - the {@link Frame} from which the module size is to be derived
	     * @return {number} The pixel size for each module in the QR code which will be no less than one.
	     * @protected
	     */

	  }, {
	    key: 'getModuleSize',
	    value: function getModuleSize(frame) {
	      var qrious = this.qrious;
	      var padding = qrious.padding || 0;
	      var pixels = Math.floor((qrious.size - padding * 2) / frame.width);

	      return Math.max(1, pixels);
	    }

	    /**
	     * Calculates the offset/padding (in pixel units) to be inserted before the QR code based on the <code>frame</code>
	     * provided.
	     *
	     * The returned value will be zero if there is no available offset or if the size of the QR code does not fit its
	     * contents. It will never be a negative value. This is done so that the inevitable clipping appears more naturally
	     * and it is not clipped from all directions.
	     *
	     * @param {Frame} frame - the {@link Frame} from which the offset is to be derived
	     * @return {number} The pixel offset for the QR code which will be no less than zero.
	     * @protected
	     */

	  }, {
	    key: 'getOffset',
	    value: function getOffset(frame) {
	      var qrious = this.qrious;
	      var padding = qrious.padding;

	      if (padding != null) {
	        return padding;
	      }

	      var moduleSize = this.getModuleSize(frame);
	      var offset = Math.floor((qrious.size - moduleSize * frame.width) / 2);

	      return Math.max(0, offset);
	    }

	    /**
	     * Renders a QR code on the underlying element based on the <code>frame</code> provided.
	     *
	     * @param {Frame} frame - the {@link Frame} to be rendered
	     * @return {void}
	     * @public
	     */

	  }, {
	    key: 'render',
	    value: function render(frame) {
	      if (this.enabled) {
	        this.resize();
	        this.reset();
	        this.draw(frame);
	      }
	    }

	    /**
	     * Resets the underlying element, effectively clearing any previously rendered QR code.
	     *
	     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
	     *
	     * @return {void}
	     * @protected
	     */

	  }, {
	    key: 'reset',
	    value: function reset() {
	      Utilities.throwUnimplemented('Renderer', 'reset');
	    }

	    /**
	     * Ensures that the size of the underlying element matches that defined on the associated {@link QRious} instance.
	     *
	     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
	     *
	     * @return {void}
	     * @protected
	     */

	  }, {
	    key: 'resize',
	    value: function resize() {
	      Utilities.throwUnimplemented('Renderer', 'resize');
	    }
	  }]);

	  return Renderer;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * An implementation of {@link Renderer} for working with <code>canvas</code> elements.
	 *
	 * @public
	 * @extends Renderer
	 */

	var CanvasRenderer = function (_Renderer) {
	  _inherits(CanvasRenderer, _Renderer);

	  function CanvasRenderer() {
	    _classCallCheck(this, CanvasRenderer);

	    return _possibleConstructorReturn(this, (CanvasRenderer.__proto__ || _Object$getPrototypeOf(CanvasRenderer)).apply(this, arguments));
	  }

	  _createClass(CanvasRenderer, [{
	    key: 'draw',


	    /**
	     * @override
	     */
	    value: function draw(frame) {
	      var qrious = this.qrious;
	      var moduleSize = this.getModuleSize(frame);
	      var offset = this.getOffset(frame);
	      var context = this.element.getContext('2d');

	      context.fillStyle = qrious.foreground;
	      context.globalAlpha = qrious.foregroundAlpha;

	      for (var i = 0; i < frame.width; i++) {
	        for (var j = 0; j < frame.width; j++) {
	          if (frame.buffer[j * frame.width + i]) {
	            context.fillRect(moduleSize * i + offset, moduleSize * j + offset, moduleSize, moduleSize);
	          }
	        }
	      }
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'reset',
	    value: function reset() {
	      var qrious = this.qrious;
	      var context = this.element.getContext('2d');
	      var size = qrious.size;

	      context.lineWidth = 1;
	      context.clearRect(0, 0, size, size);
	      context.fillStyle = qrious.background;
	      context.globalAlpha = qrious.backgroundAlpha;
	      context.fillRect(0, 0, size, size);
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'resize',
	    value: function resize() {
	      this.element.width = this.element.height = this.qrious.size;
	    }
	  }]);

	  return CanvasRenderer;
	}(Renderer);

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/* eslint no-multi-spaces: "off" */

	/**
	 * Contains alignment pattern information.
	 *
	 * @public
	 */
	var Alignment = function () {
	  function Alignment() {
	    _classCallCheck(this, Alignment);
	  }

	  _createClass(Alignment, null, [{
	    key: "BLOCK",


	    /**
	     * Returns the alignment pattern block.
	     *
	     * @return {number[]} The alignment pattern block.
	     * @public
	     * @static
	     */
	    get: function get() {
	      return [0, 11, 15, 19, 23, 27, 31, 16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24, 26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28];
	    }
	  }]);

	  return Alignment;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/* eslint no-multi-spaces: "off" */

	/**
	 * Contains error correction information.
	 *
	 * @public
	 */
	var ErrorCorrection = function () {
	  function ErrorCorrection() {
	    _classCallCheck(this, ErrorCorrection);
	  }

	  _createClass(ErrorCorrection, null, [{
	    key: "BLOCKS",


	    /**
	     * Returns the error correction blocks.
	     *
	     * There are four elements per version. The first two indicate the number of blocks, then the data width, and finally
	     * the ECC width.
	     *
	     * @return {number[]} The ECC blocks.
	     * @public
	     * @static
	     */
	    get: function get() {
	      return [1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17, 1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28, 1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22, 1, 0, 80, 20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16, 1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22, 2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28, 2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26, 2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26, 2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24, 2, 2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28, 4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24, 2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28, 4, 0, 107, 26, 8, 1, 37, 22, 8, 4, 20, 24, 12, 4, 11, 22, 3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24, 5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24, 5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19, 24, 3, 13, 15, 30, 1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28, 5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28, 3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16, 13, 26, 3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28, 4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30, 2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24, 4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30, 6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30, 8, 4, 106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30, 10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30, 8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30, 3, 10, 117, 30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30, 7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30, 5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30, 13, 3, 115, 30, 2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30, 17, 0, 115, 30, 10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30, 17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30, 13, 6, 115, 30, 14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30, 12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30, 6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30, 17, 4, 122, 30, 29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30, 4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30, 20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30, 19, 6, 118, 30, 18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30];
	    }

	    /**
	     * Returns the final format bits with mask (level << 3 | mask).
	     *
	     * @return {number[]} The final format bits.
	     * @public
	     * @static
	     */

	  }, {
	    key: "FINAL_FORMAT",
	    get: function get() {
	      return [
	      // L
	      0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
	      // M
	      0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
	      // Q
	      0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
	      // H
	      0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b];
	    }

	    /**
	     * Returns a map of human-readable ECC levels.
	     *
	     * @return {Object<string, number>} A ECC level mapping.
	     * @public
	     * @static
	     */

	  }, {
	    key: "LEVELS",
	    get: function get() {
	      return {
	        L: 1,
	        M: 2,
	        Q: 3,
	        H: 4
	      };
	    }
	  }]);

	  return ErrorCorrection;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Contains Galois field information.
	 *
	 * @public
	 */
	var Galois = function () {
	  function Galois() {
	    _classCallCheck(this, Galois);
	  }

	  _createClass(Galois, null, [{
	    key: "EXPONENT",


	    /**
	     * Returns the Galois field exponent table.
	     *
	     * @return {number[]} The Galois field exponent table.
	     * @public
	     * @static
	     */
	    get: function get() {
	      return [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26, 0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0, 0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23, 0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1, 0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0, 0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2, 0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce, 0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc, 0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54, 0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73, 0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff, 0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41, 0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6, 0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09, 0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16, 0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00];
	    }

	    /**
	     * Returns the Galois field log table.
	     *
	     * @return {number[]} The Galois field log table.
	     * @public
	     * @static
	     */

	  }, {
	    key: "LOG",
	    get: function get() {
	      return [0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b, 0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71, 0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45, 0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6, 0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88, 0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40, 0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d, 0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57, 0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18, 0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e, 0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61, 0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2, 0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6, 0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a, 0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7, 0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf];
	    }
	  }]);

	  return Galois;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Contains version pattern information.
	 *
	 * @public
	 */
	var Version = function () {
	  function Version() {
	    _classCallCheck(this, Version);
	  }

	  _createClass(Version, null, [{
	    key: "BLOCK",


	    /**
	     * Returns the version pattern block.
	     *
	     * @return {number[]} The version pattern block.
	     * @public
	     * @static
	     */
	    get: function get() {
	      return [0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532, 0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5, 0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69];
	    }
	  }]);

	  return Version;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Generates information for a QR code frame based on a specific value to be encoded.
	 *
	 * @public
	 */

	var Frame = function () {
	  _createClass(Frame, null, [{
	    key: '_createArray',
	    value: function _createArray(length) {
	      var array = [];

	      for (var i = 0; i < length; i++) {
	        array[i] = 0;
	      }

	      return array;
	    }
	  }, {
	    key: '_getMaskBit',
	    value: function _getMaskBit(x, y) {
	      var bit = void 0;

	      if (x > y) {
	        bit = x;
	        x = y;
	        y = bit;
	      }

	      bit = y;
	      bit += y * y;
	      bit >>= 1;
	      bit += x;

	      return bit;
	    }
	  }, {
	    key: '_modN',
	    value: function _modN(x) {
	      while (x >= 255) {
	        x -= 255;
	        x = (x >> 8) + (x & 255);
	      }

	      return x;
	    }

	    // *Badness* coefficients.

	  }, {
	    key: 'N1',
	    get: function get() {
	      return 3;
	    }
	  }, {
	    key: 'N2',
	    get: function get() {
	      return 3;
	    }
	  }, {
	    key: 'N3',
	    get: function get() {
	      return 40;
	    }
	  }, {
	    key: 'N4',
	    get: function get() {
	      return 10;
	    }

	    /**
	     * Creates an instance of {@link Frame} based on the <code>options</code> provided.
	     *
	     * @param {Frame~Options} options - the options to be used
	     * @public
	     */

	  }]);

	  function Frame(options) {
	    _classCallCheck(this, Frame);

	    this._badness = [];
	    this._level = ErrorCorrection.LEVELS[options.level];
	    this._polynomial = [];
	    this._value = options.value;
	    this._valueLength = this._value.length;
	    this._version = 0;
	    this._stringBuffer = [];

	    var dataBlock = void 0;
	    var eccBlock = void 0;
	    var neccBlock1 = void 0;
	    var neccBlock2 = void 0;

	    while (this._version < 40) {
	      this._version++;

	      var index = (this._level - 1) * 4 + (this._version - 1) * 16;

	      neccBlock1 = ErrorCorrection.BLOCKS[index++];
	      neccBlock2 = ErrorCorrection.BLOCKS[index++];
	      dataBlock = ErrorCorrection.BLOCKS[index++];
	      eccBlock = ErrorCorrection.BLOCKS[index];

	      index = dataBlock * (neccBlock1 + neccBlock2) + neccBlock2 - 3 + (this._version <= 9);

	      if (this._valueLength <= index) {
	        break;
	      }
	    }

	    this._dataBlock = dataBlock;
	    this._eccBlock = eccBlock;
	    this._neccBlock1 = neccBlock1;
	    this._neccBlock2 = neccBlock2;

	    /**
	     * The data width is based on version.
	     *
	     * @public
	     * @type {number}
	     */
	    // FIXME: Ensure that it fits instead of being truncated.
	    this.width = 17 + 4 * this._version;

	    /**
	     * The image buffer.
	     *
	     * @public
	     * @type {number[]}
	     */
	    this.buffer = Frame._createArray(this.width * this.width);

	    this._ecc = Frame._createArray(this._dataBlock + (this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2) + this._neccBlock2);
	    this._mask = Frame._createArray((this.width * (this.width + 1) + 1) / 2);

	    this._insertFinders();
	    this._insertAlignments();

	    // Insert single foreground cell.
	    this.buffer[8 + this.width * (this.width - 8)] = 1;

	    this._insertTimingGap();
	    this._reverseMask();
	    this._insertTimingRowAndColumn();
	    this._insertVersion();
	    this._syncMask();
	    this._convertBitStream(this._value.length);
	    this._calculatePolynomial();
	    this._appendEccToData();
	    this._interleaveBlocks();
	    this._pack();
	    this._finish();
	  }

	  _createClass(Frame, [{
	    key: '_addAlignment',
	    value: function _addAlignment(x, y) {
	      this.buffer[x + this.width * y] = 1;

	      for (var i = -2; i < 2; i++) {
	        this.buffer[x + i + this.width * (y - 2)] = 1;
	        this.buffer[x - 2 + this.width * (y + i + 1)] = 1;
	        this.buffer[x + 2 + this.width * (y + i)] = 1;
	        this.buffer[x + i + 1 + this.width * (y + 2)] = 1;
	      }

	      for (var _i = 0; _i < 2; _i++) {
	        this._setMask(x - 1, y + _i);
	        this._setMask(x + 1, y - _i);
	        this._setMask(x - _i, y - 1);
	        this._setMask(x + _i, y + 1);
	      }
	    }
	  }, {
	    key: '_appendData',
	    value: function _appendData(data, dataLength, ecc, eccLength) {
	      for (var i = 0; i < eccLength; i++) {
	        this._stringBuffer[ecc + i] = 0;
	      }

	      for (var _i2 = 0; _i2 < dataLength; _i2++) {
	        var bit = Galois.LOG[this._stringBuffer[data + _i2] ^ this._stringBuffer[ecc]];

	        if (bit !== 255) {
	          for (var j = 1; j < eccLength; j++) {
	            this._stringBuffer[ecc + j - 1] = this._stringBuffer[ecc + j] ^ Galois.EXPONENT[Frame._modN(bit + this._polynomial[eccLength - j])];
	          }
	        } else {
	          for (var _j = ecc; _j < ecc + eccLength; _j++) {
	            this._stringBuffer[_j] = this._stringBuffer[_j + 1];
	          }
	        }

	        this._stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois.EXPONENT[Frame._modN(bit + this._polynomial[0])];
	      }
	    }
	  }, {
	    key: '_appendEccToData',
	    value: function _appendEccToData() {
	      var data = 0;
	      var ecc = this._calculateMaxLength();

	      for (var i = 0; i < this._neccBlock1; i++) {
	        this._appendData(data, this._dataBlock, ecc, this._eccBlock);

	        data += this._dataBlock;
	        ecc += this._eccBlock;
	      }

	      for (var _i3 = 0; _i3 < this._neccBlock2; _i3++) {
	        this._appendData(data, this._dataBlock + 1, ecc, this._eccBlock);

	        data += this._dataBlock + 1;
	        ecc += this._eccBlock;
	      }
	    }
	  }, {
	    key: '_applyMask',
	    value: function _applyMask(mask) {
	      var width = this.width;

	      switch (mask) {
	        case 0:
	          for (var y = 0; y < width; y++) {
	            for (var x = 0; x < width; x++) {
	              if (!(x + y & 1) && !this._isMasked(x, y)) {
	                this.buffer[x + y * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 1:
	          for (var _y = 0; _y < width; _y++) {
	            for (var _x = 0; _x < width; _x++) {
	              if (!(_y & 1) && !this._isMasked(_x, _y)) {
	                this.buffer[_x + _y * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 2:
	          for (var _y2 = 0; _y2 < width; _y2++) {
	            for (var r3x = 0, _x2 = 0; _x2 < width; _x2++, r3x++) {
	              if (r3x === 3) {
	                r3x = 0;
	              }

	              if (!r3x && !this._isMasked(_x2, _y2)) {
	                this.buffer[_x2 + _y2 * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 3:
	          for (var r3y = 0, _y3 = 0; _y3 < width; _y3++, r3y++) {
	            if (r3y === 3) {
	              r3y = 0;
	            }

	            for (var _r3x = r3y, _x3 = 0; _x3 < width; _x3++, _r3x++) {
	              if (_r3x === 3) {
	                _r3x = 0;
	              }

	              if (!_r3x && !this._isMasked(_x3, _y3)) {
	                this.buffer[_x3 + _y3 * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 4:
	          for (var _y4 = 0; _y4 < width; _y4++) {
	            for (var _r3x2 = 0, _r3y = _y4 >> 1 & 1, _x4 = 0; _x4 < width; _x4++, _r3x2++) {
	              if (_r3x2 === 3) {
	                _r3x2 = 0;
	                _r3y = !_r3y;
	              }

	              if (!_r3y && !this._isMasked(_x4, _y4)) {
	                this.buffer[_x4 + _y4 * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 5:
	          for (var _r3y2 = 0, _y5 = 0; _y5 < width; _y5++, _r3y2++) {
	            if (_r3y2 === 3) {
	              _r3y2 = 0;
	            }

	            for (var _r3x3 = 0, _x5 = 0; _x5 < width; _x5++, _r3x3++) {
	              if (_r3x3 === 3) {
	                _r3x3 = 0;
	              }

	              if (!((_x5 & _y5 & 1) + !(!_r3x3 | !_r3y2)) && !this._isMasked(_x5, _y5)) {
	                this.buffer[_x5 + _y5 * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 6:
	          for (var _r3y3 = 0, _y6 = 0; _y6 < width; _y6++, _r3y3++) {
	            if (_r3y3 === 3) {
	              _r3y3 = 0;
	            }

	            for (var _r3x4 = 0, _x6 = 0; _x6 < width; _x6++, _r3x4++) {
	              if (_r3x4 === 3) {
	                _r3x4 = 0;
	              }

	              if (!((_x6 & _y6 & 1) + (_r3x4 && _r3x4 === _r3y3) & 1) && !this._isMasked(_x6, _y6)) {
	                this.buffer[_x6 + _y6 * width] ^= 1;
	              }
	            }
	          }

	          break;
	        case 7:
	          for (var _r3y4 = 0, _y7 = 0; _y7 < width; _y7++, _r3y4++) {
	            if (_r3y4 === 3) {
	              _r3y4 = 0;
	            }

	            for (var _r3x5 = 0, _x7 = 0; _x7 < width; _x7++, _r3x5++) {
	              if (_r3x5 === 3) {
	                _r3x5 = 0;
	              }

	              if (!((_r3x5 && _r3x5 === _r3y4) + (_x7 + _y7 & 1) & 1) && !this._isMasked(_x7, _y7)) {
	                this.buffer[_x7 + _y7 * width] ^= 1;
	              }
	            }
	          }

	          break;
	      }
	    }
	  }, {
	    key: '_calculateMaxLength',
	    value: function _calculateMaxLength() {
	      return this._dataBlock * (this._neccBlock1 + this._neccBlock2) + this._neccBlock2;
	    }
	  }, {
	    key: '_calculatePolynomial',
	    value: function _calculatePolynomial() {
	      this._polynomial[0] = 1;

	      for (var i = 0; i < this._eccBlock; i++) {
	        this._polynomial[i + 1] = 1;

	        for (var j = i; j > 0; j--) {
	          this._polynomial[j] = this._polynomial[j] ? this._polynomial[j - 1] ^ Galois.EXPONENT[Frame._modN(Galois.LOG[this._polynomial[j]] + i)] : this._polynomial[j - 1];
	        }

	        this._polynomial[0] = Galois.EXPONENT[Frame._modN(Galois.LOG[this._polynomial[0]] + i)];
	      }

	      // Use logs for generator polynomial to save calculation step.
	      for (var _i4 = 0; _i4 <= this._eccBlock; _i4++) {
	        this._polynomial[_i4] = Galois.LOG[this._polynomial[_i4]];
	      }
	    }
	  }, {
	    key: '_checkBadness',
	    value: function _checkBadness() {
	      var bad = 0;
	      var width = this.width;

	      // Blocks of same colour.
	      for (var y = 0; y < width - 1; y++) {
	        for (var x = 0; x < width - 1; x++) {
	          // All foreground colour.
	          if (this.buffer[x + width * y] && this.buffer[x + 1 + width * y] && this.buffer[x + width * (y + 1)] && this.buffer[x + 1 + width * (y + 1)] ||
	          // All background colour.
	          !(this.buffer[x + width * y] || this.buffer[x + 1 + width * y] || this.buffer[x + width * (y + 1)] || this.buffer[x + 1 + width * (y + 1)])) {
	            bad += Frame.N2;
	          }
	        }
	      }

	      var bw = 0;

	      // X runs.
	      for (var _y8 = 0; _y8 < width; _y8++) {
	        var h = 0;

	        this._badness[0] = 0;

	        for (var b = 0, _x8 = 0; _x8 < width; _x8++) {
	          var b1 = this.buffer[_x8 + width * _y8];

	          if (b === b1) {
	            this._badness[h]++;
	          } else {
	            this._badness[++h] = 1;
	          }

	          b = b1;
	          bw += b ? 1 : -1;
	        }

	        bad += this._getBadness(h);
	      }

	      if (bw < 0) {
	        bw = -bw;
	      }

	      var count = 0;
	      var big = bw;
	      big += big << 2;
	      big <<= 1;

	      while (big > width * width) {
	        big -= width * width;
	        count++;
	      }

	      bad += count * Frame.N4;

	      // Y runs.
	      for (var _x9 = 0; _x9 < width; _x9++) {
	        var _h = 0;

	        this._badness[0] = 0;

	        for (var _b = 0, _y9 = 0; _y9 < width; _y9++) {
	          var _b2 = this.buffer[_x9 + width * _y9];

	          if (_b === _b2) {
	            this._badness[_h]++;
	          } else {
	            this._badness[++_h] = 1;
	          }

	          _b = _b2;
	        }

	        bad += this._getBadness(_h);
	      }

	      return bad;
	    }
	  }, {
	    key: '_convertBitStream',
	    value: function _convertBitStream(length) {
	      // Convert string to bit stream. 8-bit data to QR-coded 8-bit data (numeric, alphanumeric, or kanji not supported).
	      for (var i = 0; i < length; i++) {
	        this._ecc[i] = this._value.charCodeAt(i);
	      }

	      this._stringBuffer = this._ecc.slice(0);

	      var maxLength = this._calculateMaxLength();

	      if (length >= maxLength - 2) {
	        length = maxLength - 2;

	        if (this._version > 9) {
	          length--;
	        }
	      }

	      // Shift and re-pack to insert length prefix.
	      var index = length;

	      if (this._version > 9) {
	        this._stringBuffer[index + 2] = 0;
	        this._stringBuffer[index + 3] = 0;

	        while (index--) {
	          var bit = this._stringBuffer[index];

	          this._stringBuffer[index + 3] |= 255 & bit << 4;
	          this._stringBuffer[index + 2] = bit >> 4;
	        }

	        this._stringBuffer[2] |= 255 & length << 4;
	        this._stringBuffer[1] = length >> 4;
	        this._stringBuffer[0] = 0x40 | length >> 12;
	      } else {
	        this._stringBuffer[index + 1] = 0;
	        this._stringBuffer[index + 2] = 0;

	        while (index--) {
	          var _bit = this._stringBuffer[index];

	          this._stringBuffer[index + 2] |= 255 & _bit << 4;
	          this._stringBuffer[index + 1] = _bit >> 4;
	        }

	        this._stringBuffer[1] |= 255 & length << 4;
	        this._stringBuffer[0] = 0x40 | length >> 4;
	      }

	      // Fill to end with pad pattern.
	      index = length + 3 - (this._version < 10);

	      while (index < maxLength) {
	        this._stringBuffer[index++] = 0xec;
	        this._stringBuffer[index++] = 0x11;
	      }
	    }
	  }, {
	    key: '_getBadness',
	    value: function _getBadness(length) {
	      var badRuns = 0;

	      for (var i = 0; i <= length; i++) {
	        if (this._badness[i] >= 5) {
	          badRuns += Frame.N1 + this._badness[i] - 5;
	        }
	      }

	      // FBFFFBF as in finder.
	      for (var _i5 = 3; _i5 < length - 1; _i5 += 2) {
	        if (this._badness[_i5 - 2] === this._badness[_i5 + 2] && this._badness[_i5 + 2] === this._badness[_i5 - 1] && this._badness[_i5 - 1] === this._badness[_i5 + 1] && this._badness[_i5 - 1] * 3 === this._badness[_i5] && (
	        // Background around the foreground pattern? Not part of the specs.
	        this._badness[_i5 - 3] === 0 || _i5 + 3 > length || this._badness[_i5 - 3] * 3 >= this._badness[_i5] * 4 || this._badness[_i5 + 3] * 3 >= this._badness[_i5] * 4)) {
	          badRuns += Frame.N3;
	        }
	      }

	      return badRuns;
	    }
	  }, {
	    key: '_finish',
	    value: function _finish() {
	      // Save pre-mask copy of frame.
	      this._stringBuffer = this.buffer.slice(0);

	      var bit = 0;
	      var i = void 0;
	      var mask = 30000;

	      /*
	       * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
	       * a better one since they get more complex and take longer.
	       */
	      for (i = 0; i < 8; i++) {
	        // Returns foreground-background imbalance.
	        this._applyMask(i);

	        var currentMask = this._checkBadness();

	        // Is current mask better than previous best?
	        if (currentMask < mask) {
	          mask = currentMask;
	          bit = i;
	        }

	        // Don't increment "i" to a void redoing mask.
	        if (bit === 7) {
	          break;
	        }

	        // Reset for next pass.
	        this.buffer = this._stringBuffer.slice(0);
	      }

	      // Redo best mask as none were "good enough" (i.e. last wasn't bit).
	      if (bit !== i) {
	        this._applyMask(bit);
	      }

	      // Add in final mask/ECC level bytes.
	      mask = ErrorCorrection.FINAL_FORMAT[bit + (this._level - 1 << 3)];

	      // Low byte.
	      for (i = 0; i < 8; i++, mask >>= 1) {
	        if (mask & 1) {
	          this.buffer[this.width - 1 - i + this.width * 8] = 1;

	          if (i < 6) {
	            this.buffer[8 + this.width * i] = 1;
	          } else {
	            this.buffer[8 + this.width * (i + 1)] = 1;
	          }
	        }
	      }

	      // High byte.
	      for (i = 0; i < 7; i++, mask >>= 1) {
	        if (mask & 1) {
	          this.buffer[8 + this.width * (this.width - 7 + i)] = 1;

	          if (i) {
	            this.buffer[6 - i + this.width * 8] = 1;
	          } else {
	            this.buffer[7 + this.width * 8] = 1;
	          }
	        }
	      }
	    }
	  }, {
	    key: '_interleaveBlocks',
	    value: function _interleaveBlocks() {
	      var maxLength = this._calculateMaxLength();
	      var i = void 0;
	      var k = 0;

	      for (i = 0; i < this._dataBlock; i++) {
	        for (var j = 0; j < this._neccBlock1; j++) {
	          this._ecc[k++] = this._stringBuffer[i + j * this._dataBlock];
	        }

	        for (var _j2 = 0; _j2 < this._neccBlock2; _j2++) {
	          this._ecc[k++] = this._stringBuffer[this._neccBlock1 * this._dataBlock + i + _j2 * (this._dataBlock + 1)];
	        }
	      }

	      for (var _j3 = 0; _j3 < this._neccBlock2; _j3++) {
	        this._ecc[k++] = this._stringBuffer[this._neccBlock1 * this._dataBlock + i + _j3 * (this._dataBlock + 1)];
	      }

	      for (i = 0; i < this._eccBlock; i++) {
	        for (var _j4 = 0; _j4 < this._neccBlock1 + this._neccBlock2; _j4++) {
	          this._ecc[k++] = this._stringBuffer[maxLength + i + _j4 * this._eccBlock];
	        }
	      }

	      this._stringBuffer = this._ecc;
	    }
	  }, {
	    key: '_insertAlignments',
	    value: function _insertAlignments() {
	      var width = this.width;

	      if (this._version > 1) {
	        var i = Alignment.BLOCK[this._version];
	        var y = width - 7;

	        for (;;) {
	          var x = width - 7;

	          while (x > i - 3) {
	            this._addAlignment(x, y);

	            if (x < i) {
	              break;
	            }

	            x -= i;
	          }

	          if (y <= i + 9) {
	            break;
	          }

	          y -= i;

	          this._addAlignment(6, y);
	          this._addAlignment(y, 6);
	        }
	      }
	    }
	  }, {
	    key: '_insertFinders',
	    value: function _insertFinders() {
	      var width = this.width;

	      for (var i = 0; i < 3; i++) {
	        var j = 0;
	        var y = 0;

	        if (i === 1) {
	          j = width - 7;
	        }
	        if (i === 2) {
	          y = width - 7;
	        }

	        this.buffer[y + 3 + width * (j + 3)] = 1;

	        for (var x = 0; x < 6; x++) {
	          this.buffer[y + x + width * j] = 1;
	          this.buffer[y + width * (j + x + 1)] = 1;
	          this.buffer[y + 6 + width * (j + x)] = 1;
	          this.buffer[y + x + 1 + width * (j + 6)] = 1;
	        }

	        for (var _x10 = 1; _x10 < 5; _x10++) {
	          this._setMask(y + _x10, j + 1);
	          this._setMask(y + 1, j + _x10 + 1);
	          this._setMask(y + 5, j + _x10);
	          this._setMask(y + _x10 + 1, j + 5);
	        }

	        for (var _x11 = 2; _x11 < 4; _x11++) {
	          this.buffer[y + _x11 + width * (j + 2)] = 1;
	          this.buffer[y + 2 + width * (j + _x11 + 1)] = 1;
	          this.buffer[y + 4 + width * (j + _x11)] = 1;
	          this.buffer[y + _x11 + 1 + width * (j + 4)] = 1;
	        }
	      }
	    }
	  }, {
	    key: '_insertTimingGap',
	    value: function _insertTimingGap() {
	      var width = this.width;

	      for (var y = 0; y < 7; y++) {
	        this._setMask(7, y);
	        this._setMask(width - 8, y);
	        this._setMask(7, y + width - 7);
	      }

	      for (var x = 0; x < 8; x++) {
	        this._setMask(x, 7);
	        this._setMask(x + width - 8, 7);
	        this._setMask(x, width - 8);
	      }
	    }
	  }, {
	    key: '_insertTimingRowAndColumn',
	    value: function _insertTimingRowAndColumn() {
	      var width = this.width;

	      for (var x = 0; x < width - 14; x++) {
	        if (x & 1) {
	          this._setMask(8 + x, 6);
	          this._setMask(6, 8 + x);
	        } else {
	          this.buffer[8 + x + width * 6] = 1;
	          this.buffer[6 + width * (8 + x)] = 1;
	        }
	      }
	    }
	  }, {
	    key: '_insertVersion',
	    value: function _insertVersion() {
	      var width = this.width;

	      if (this._version > 6) {
	        var i = Version.BLOCK[this._version - 7];
	        var j = 17;

	        for (var x = 0; x < 6; x++) {
	          for (var y = 0; y < 3; y++, j--) {
	            if (1 & (j > 11 ? this._version >> j - 12 : i >> j)) {
	              this.buffer[5 - x + width * (2 - y + width - 11)] = 1;
	              this.buffer[2 - y + width - 11 + width * (5 - x)] = 1;
	            } else {
	              this._setMask(5 - x, 2 - y + width - 11);
	              this._setMask(2 - y + width - 11, 5 - x);
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: '_isMasked',
	    value: function _isMasked(x, y) {
	      var bit = Frame._getMaskBit(x, y);

	      return this._mask[bit] === 1;
	    }
	  }, {
	    key: '_pack',
	    value: function _pack() {
	      var x = this.width - 1;
	      var y = this.width - 1;
	      var k = 1;
	      var v = 1;

	      // Interleaved data and ECC codes.
	      var length = (this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2) + this._neccBlock2;

	      for (var i = 0; i < length; i++) {
	        var bit = this._stringBuffer[i];

	        for (var j = 0; j < 8; j++, bit <<= 1) {
	          if (0x80 & bit) {
	            this.buffer[x + this.width * y] = 1;
	          }

	          // Find next fill position.
	          do {
	            if (v) {
	              x--;
	            } else {
	              x++;

	              if (k) {
	                if (y !== 0) {
	                  y--;
	                } else {
	                  x -= 2;
	                  k = !k;

	                  if (x === 6) {
	                    x--;
	                    y = 9;
	                  }
	                }
	              } else if (y !== this.width - 1) {
	                y++;
	              } else {
	                x -= 2;
	                k = !k;

	                if (x === 6) {
	                  x--;
	                  y -= 8;
	                }
	              }
	            }

	            v = !v;
	          } while (this._isMasked(x, y));
	        }
	      }
	    }
	  }, {
	    key: '_reverseMask',
	    value: function _reverseMask() {
	      var width = this.width;

	      for (var x = 0; x < 9; x++) {
	        this._setMask(x, 8);
	      }

	      for (var _x12 = 0; _x12 < 8; _x12++) {
	        this._setMask(_x12 + width - 8, 8);
	        this._setMask(8, _x12);
	      }

	      for (var y = 0; y < 7; y++) {
	        this._setMask(8, y + width - 7);
	      }
	    }
	  }, {
	    key: '_setMask',
	    value: function _setMask(x, y) {
	      var bit = Frame._getMaskBit(x, y);

	      this._mask[bit] = 1;
	    }
	  }, {
	    key: '_syncMask',
	    value: function _syncMask() {
	      var width = this.width;

	      for (var y = 0; y < width; y++) {
	        for (var x = 0; x <= y; x++) {
	          if (this.buffer[x + width * y]) {
	            this._setMask(x, y);
	          }
	        }
	      }
	    }
	  }]);

	  return Frame;
	}();



	/**
	 * The options used by {@link Frame}.
	 *
	 * @typedef {Object} Frame~Options
	 * @property {string} level - The ECC level to be used.
	 * @property {string} value - The value to be encoded.
	 */

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * An implementation of {@link Renderer} for working with <code>img</code> elements.
	 *
	 * This depends on {@link CanvasRenderer} being executed first as this implementation simply applies the data URL from
	 * the rendered <code>canvas</code> element as the <code>src</code> for the <code>img</code> element being rendered.
	 *
	 * @public
	 * @extends Renderer
	 */

	var ImageRenderer = function (_Renderer) {
	  _inherits(ImageRenderer, _Renderer);

	  function ImageRenderer() {
	    _classCallCheck(this, ImageRenderer);

	    return _possibleConstructorReturn(this, (ImageRenderer.__proto__ || _Object$getPrototypeOf(ImageRenderer)).apply(this, arguments));
	  }

	  _createClass(ImageRenderer, [{
	    key: 'draw',


	    /**
	     * @override
	     */
	    value: function draw() {
	      this.element.src = this.qrious.toDataURL();
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.element.src = '';
	    }

	    /**
	     * @override
	     */

	  }, {
	    key: 'resize',
	    value: function resize() {
	      this.element.width = this.element.height = this.qrious.size;
	    }
	  }]);

	  return ImageRenderer;
	}(Renderer);

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Defines an available option while also configuring how values are applied to the target object.
	 *
	 * While a value associated with an option can be changed on the target object, the option definition itself is
	 * immutable.
	 *
	 * @public
	 */
	var Option = function () {

	  /**
	   * Creates a new instance of {@link Option} based on the <code>name</code> provided.
	   *
	   * Optionally, a <code>defaultValue</code> can be specified as well a <code>valueTransformer</code> and
	   * <code>fieldNameResolver</code> for greater control over how the option value is applied.
	   *
	   * If no <code>valueTransformer</code> is specified, then any specified option will be applied directly.
	   *
	   * If no <code>fieldNameResolver</code> is specified, then the field name will be resolved to <code>name</code>
	   * prefixed with a single underscore when the option is applied.
	   *
	   * @param {string} name - the name to be used
	   * @param {*} [defaultValue] - the default value to be used
	   * @param {Option~ValueTransformer} [valueTransformer] - the value transformer to be used
	   * @param {Option~FieldNameResolver} [fieldNameResolver] - the field name resolver to be used
	   * @public
	   */
	  function Option(name, defaultValue, valueTransformer, fieldNameResolver) {
	    _classCallCheck(this, Option);

	    this._name = name;
	    this._defaultValue = defaultValue;
	    this._valueTransformer = valueTransformer;
	    this._fieldName = typeof fieldNameResolver === 'function' ? fieldNameResolver(this) : '_' + name;
	  }

	  /**
	   * Transforms the specified <code>value</code> so that it can be applied for this {@link Option}.
	   *
	   * If a value transformer has been specified for this {@link Option}, it will be called upon to transform
	   * <code>value</code>. Otherwise, <code>value</code> will be returned directly.
	   *
	   * @param {*} value - the value to be transformed
	   * @return {*} The transformed value or <code>value</code> if no value transformer is specified.
	   * @public
	   */


	  _createClass(Option, [{
	    key: 'transform',
	    value: function transform(value) {
	      var transformer = this._valueTransformer;
	      if (typeof transformer === 'function') {
	        return transformer(value, this);
	      }

	      return value;
	    }

	    /**
	     * Returns the field name for this {@link Option}.
	     *
	     * @return {string} The field name.
	     * @public
	     */

	  }, {
	    key: 'fieldName',
	    get: function get() {
	      return this._fieldName;
	    }

	    /**
	     * Returns the name for this {@link Option}.
	     *
	     * @return {string} The name.
	     * @public
	     */

	  }, {
	    key: 'name',
	    get: function get() {
	      return this._name;
	    }

	    /**
	     * Returns the default value for this {@link Option}.
	     *
	     * @return {*} The default value.
	     * @public
	     */

	  }, {
	    key: 'defaultValue',
	    get: function get() {
	      return this._defaultValue;
	    }
	  }]);

	  return Option;
	}();



	/**
	 * Returns the field name to which the specified <code>option</code> is associated on the target object.
	 *
	 * The resolved name will be used to identify the field that values for <code>option</code> are to be read from and
	 * written to.
	 *
	 * This function will only called once for <code>option</code>, upon initialization.
	 *
	 * @callback Option~FieldNameResolver
	 * @param {Option} option - the {@link Option} whose field name is to be resolved
	 * @return {string} The resolved field name for <code>option</code>.
	 */

	/**
	 * Returns a transformed value for the specified <code>value</code> to be applied for the <code>option</code> provided.
	 *
	 * @callback Option~ValueTransformer
	 * @param {*} value - the value to be transformed
	 * @param {Option} option - the {@link Option} for which <code>value</code> is being transformed
	 * @return {*} The transform value.
	 */

	var isEnum$1    = _objectPie.f;
	var _objectToArray = function(isEntries){
	  return function(it){
	    var O      = _toIobject(it)
	      , keys   = _objectKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = []
	      , key;
	    while(length > i)if(isEnum$1.call(O, key = keys[i++])){
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

	// https://github.com/tc39/proposal-object-values-entries
	var $values = _objectToArray(false);

	_export(_export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

	var values$1 = _core.Object.values;

	var values = createCommonjsModule(function (module) {
	module.exports = { "default": values$1, __esModule: true };
	});

	var _Object$values = unwrapExports(values);

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * Manages multiple {@link Option} instances that are intended to be used by multiple implementations.
	 *
	 * Although the option definitions are shared between targets, the values are maintained on the targets themselves.
	 *
	 * While a value associated with each option can be changed on the target objects, the manager and the option
	 * definitions themselves are immutable.
	 *
	 * @public
	 */

	var OptionManager = function () {
	  _createClass(OptionManager, null, [{
	    key: '_get',
	    value: function _get(option, target) {
	      return target[option.fieldName];
	    }
	  }, {
	    key: '_set',
	    value: function _set(option, value, target) {
	      var fieldName = option.fieldName;
	      var oldValue = target[fieldName];
	      var newValue = option.transform(value != null ? value : option.defaultValue);

	      target[fieldName] = newValue;

	      return newValue !== oldValue;
	    }

	    /**
	     * Creates a new instance of {@link OptionManager} for the specified available <code>options</code>.
	     *
	     * @param {Option[]} options - the options to be used
	     * @public
	     */

	  }]);

	  function OptionManager(options) {
	    var _this = this;

	    _classCallCheck(this, OptionManager);

	    this._options = {};

	    options.forEach(function (option) {
	      _this._options[option.name] = option;
	    });
	  }

	  /**
	   * Sets the default values for all of the available options on the <code>target</code> object provided.
	   *
	   * @param {Object} target - the object on which the default values are to be set for each available option
	   * @return {void}
	   * @public
	   */


	  _createClass(OptionManager, [{
	    key: 'applyDefaults',
	    value: function applyDefaults(target) {
	      var options = this._options;

	      for (var name in options) {
	        if (Utilities.hasOwn(options, name)) {
	          var option = options[name];

	          OptionManager._set(option, option.defaultValue, target);
	        }
	      }
	    }

	    /**
	     * Returns whether an option with the specified <code>name</code> is available.
	     *
	     * @param {string} name - the name of the {@link Option} whose existence is to be checked
	     * @return {boolean} <code>true</code> if an {@link Option} exists with <code>name</code>; otherwise
	     * <code>false</code>.
	     * @public
	     */

	  }, {
	    key: 'exists',
	    value: function exists(name) {
	      return this._options[name] != null;
	    }

	    /**
	     * Returns the value of the option with the specified <code>name</code> on the <code>target</code> object provided.
	     *
	     * @param {string} name - the name of the {@link Option} whose value on <code>target</code> is to be returned
	     * @param {Object} target - the object from which the value of the named {@link Option} is to be returned
	     * @return {*} The value of the {@link Option} with <code>name</code> on <code>target</code>.
	     * @public
	     */

	  }, {
	    key: 'get',
	    value: function get(name, target) {
	      return OptionManager._get(this._options[name], target);
	    }

	    /**
	     * Returns a copy of all of the available options on the <code>target</code> object provided.
	     *
	     * @param {Object} target - the object from which the option name/value pairs are to be returned
	     * @return {Object.<string, *>} A hash containing the name/value pairs of all options on <code>target</code>.
	     * @public
	     */

	  }, {
	    key: 'getAll',
	    value: function getAll(target) {
	      var options = this._options;
	      var result = {};

	      for (var name in options) {
	        if (Utilities.hasOwn(options, name)) {
	          result[name] = OptionManager._get(options[name], target);
	        }
	      }

	      return result;
	    }

	    /**
	     * Sets the value of the option with the specified <code>name</code> on the <code>target</code> object provided to
	     * <code>value</code>.
	     *
	     * This method will throw an error if <code>name</code> does not match an available option.
	     *
	     * If <code>value</code> is <code>null</code> and the {@link Option} has a default value configured, then that default
	     * value will be used instead. If the {@link Option} also has a value transformer configured, it will be used to
	     * transform whichever value was determined to be used.
	     *
	     * This method returns whether the value of the underlying field on <code>target</code> was changed as a result.
	     *
	     * @param {string} name - the name of the {@link Option} whose value is to be set
	     * @param {*} value - the value to be set for the named {@link Option} on <code>target</code>
	     * @param {Object} target - the object on which <code>value</code> is to be set for the named {@link Option}
	     * @return {boolean} <code>true</code> if the underlying field on <code>target</code> was changed; otherwise
	     * <code>false</code>.
	     * @throws {Error} If no {@link Option} is being managed with <code>name</code>.
	     * @public
	     */

	  }, {
	    key: 'set',
	    value: function set(name, value, target) {
	      var option = this._options[name];
	      if (!option) {
	        throw new Error('Invalid option: ' + name);
	      }

	      return OptionManager._set(option, value, target);
	    }

	    /**
	     * Sets all of the specified <code>options</code> on the <code>target</code> object provided to their corresponding
	     * values.
	     *
	     * This method will throw an error if any of the names within <code>options</code> does not match an available option.
	     *
	     * If any value within <code>options</code> is <code>null</code> and the corresponding {@link Option} has a default
	     * value configured, then that default value will be used instead. If an {@link Option} also has a value transformer
	     * configured, it will be used to transform whichever value was determined to be used.
	     *
	     * This method returns whether the value for any of the underlying fields on <code>target</code> were changed as a
	     * result.
	     *
	     * @param {Object.<string, *>} options - the name/value pairs of options to be set
	     * @param {Object} target - the object on which the options are to be set
	     * @return {boolean} <code>true</code> if any of the underlying fields on <code>target</code> were changed; otherwise
	     * <code>false</code>.
	     * @throws {Error} If no {@link Option} is being managed with for any of the names within <code>options</code>.
	     * @public
	     */

	  }, {
	    key: 'setAll',
	    value: function setAll(options, target) {
	      if (!options) {
	        return false;
	      }

	      var changed = false;

	      for (var name in options) {
	        if (Utilities.hasOwn(options, name) && this.set(name, options[name], target)) {
	          changed = true;
	        }
	      }

	      return changed;
	    }

	    /**
	     * Returns a copy of the available options for this {@link OptionManager}.
	     *
	     * @return {Option[]} The available options.
	     * @public
	     */

	  }, {
	    key: 'options',
	    get: function get() {
	      return _Object$values(this._options);
	    }
	  }]);

	  return OptionManager;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	/**
	 * A basic manager for {@link Service} implementations that are mapped to simple names.
	 *
	 * @public
	 */
	var ServiceManager = function () {

	  /**
	   * Creates a new instance of {@link ServiceManager}.
	   *
	   * @public
	   */
	  function ServiceManager() {
	    _classCallCheck(this, ServiceManager);

	    this._services = {};
	  }

	  /**
	   * Returns the {@link Service} being managed with the specified <code>name</code>.
	   *
	   * @param {string} name - the name of the {@link Service} to be returned
	   * @return {Service} The {@link Service} is being managed with <code>name</code>.
	   * @throws {Error} If no {@link Service} is being managed with <code>name</code>.
	   * @public
	   */


	  _createClass(ServiceManager, [{
	    key: "getService",
	    value: function getService(name) {
	      var service = this._services[name];
	      if (!service) {
	        throw new Error("Service is not being managed with name: " + name);
	      }

	      return service;
	    }

	    /**
	     * Sets the {@link Service} implementation to be managed for the specified <code>name</code> to the
	     * <code>service</code> provided.
	     *
	     * @param {string} name - the name of the {@link Service} to be managed with <code>name</code>
	     * @param {Service} service - the {@link Service} implementation to be managed
	     * @return {void}
	     * @throws {Error} If a {@link Service} is already being managed with the same <code>name</code>.
	     * @public
	     */

	  }, {
	    key: "setService",
	    value: function setService(name, service) {
	      if (this._services[name]) {
	        throw new Error("Service is already managed with name: " + name);
	      }

	      if (service) {
	        this._services[name] = service;
	      }
	    }
	  }]);

	  return ServiceManager;
	}();

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	var optionManager = new OptionManager([new Option('background', 'white'), new Option('backgroundAlpha', 1, Utilities.abs), new Option('element'), new Option('foreground', 'black'), new Option('foregroundAlpha', 1, Utilities.abs), new Option('level', 'L', Utilities.toUpperCase), new Option('mime', 'image/png'), new Option('padding', null, Utilities.abs), new Option('size', 100, Utilities.abs), new Option('value', '')]);
	var serviceManager = new ServiceManager();

	/**
	 * Enables configuration of a QR code generator which uses HTML5 <code>canvas</code> for rendering.
	 *
	 * @public
	 */

	var QRious$1 = function () {
	  _createClass(QRious, null, [{
	    key: 'use',


	    /**
	     * Configures the <code>service</code> provided to be used by all {@link QRious} instances.
	     *
	     * @param {Service} service - the {@link Service} to be configured
	     * @return {void}
	     * @throws {Error} If a {@link Service} has already been configured with the same name.
	     * @public
	     * @static
	     */
	    value: function use(service) {
	      serviceManager.setService(service.getName(), service);
	    }

	    /**
	     * Creates a new instance of {@link QRious} based on the <code>options</code> provided.
	     *
	     * @param {QRious~Options} [options] - the options to be used
	     * @throws {Error} If any <code>options</code> are invalid.
	     * @public
	     */

	  }, {
	    key: 'DEFAULTS',


	    /**
	     * Returns the default options for {@link QRious}.
	     *
	     * @return {QRious~Options} The default options.
	     * @deprecated Since 2.3.0
	     * @public
	     * @static
	     */
	    get: function get() {
	      var result = {};

	      optionManager.options.forEach(function (option) {
	        result[option.name] = option.defaultValue;
	      });

	      return result;
	    }

	    /**
	     * Returns the current version of {@link QRious}.
	     *
	     * @return {string} The current version.
	     * @public
	     * @static
	     */

	  }, {
	    key: 'VERSION',
	    get: function get() {
	      return '2.3.0';
	    }
	  }]);

	  function QRious(options) {
	    _classCallCheck(this, QRious);

	    optionManager.applyDefaults(this);
	    optionManager.setAll(options, this);

	    var element = optionManager.get('element', this);
	    var elementService = serviceManager.getService('element');
	    var canvas = element && elementService.isCanvas(element) ? element : elementService.createCanvas();
	    var image = element && elementService.isImage(element) ? element : elementService.createImage();

	    this._canvasRenderer = new CanvasRenderer(this, canvas, true);
	    this._imageRenderer = new ImageRenderer(this, image, image === element);

	    this.update();
	  }

	  /**
	   * Returns all of the options configured for this {@link QRious}.
	   *
	   * Any changes made to the returned object will not be reflected in the options themselves or their corresponding
	   * underlying fields.
	   *
	   * @return {Object.<string, *>} A copy of the applied options.
	   * @public
	   */


	  _createClass(QRious, [{
	    key: 'get',
	    value: function get() {
	      return optionManager.getAll(this);
	    }

	    /**
	     * Sets all of the specified <code>options</code> and automatically updates this {@link QRious} if any of the
	     * underlying fields are changed as a result.
	     *
	     * This is the preferred method for updating multiple options at one time to avoid unnecessary updates between
	     * changes.
	     *
	     * @param {QRious~Options} options - the options to be set
	     * @return {void}
	     * @throws {Error} If any <code>options</code> are invalid.
	     * @public
	     */

	  }, {
	    key: 'set',
	    value: function set(options) {
	      if (optionManager.setAll(options, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the image data URI for the generated QR code using the <code>mime</code> provided.
	     *
	     * @param {string} [mime] - the MIME type for the image
	     * @return {string} The image data URI for the QR code.
	     * @public
	     */

	  }, {
	    key: 'toDataURL',
	    value: function toDataURL(mime) {
	      return this.canvas.toDataURL(mime || this.mime);
	    }

	    /**
	     * Updates this {@link QRious} by generating a new {@link Frame} and re-rendering the QR code.
	     *
	     * @return {void}
	     * @protected
	     */

	  }, {
	    key: 'update',
	    value: function update() {
	      var frame = new Frame({
	        level: this.level,
	        value: this.value
	      });

	      this._canvasRenderer.render(frame);
	      this._imageRenderer.render(frame);
	    }

	    /**
	     * Returns the background color for the QR code.
	     *
	     * @return {string} The background color.
	     * @public
	     */

	  }, {
	    key: 'background',
	    get: function get() {
	      return optionManager.get('background', this);
	    }

	    /**
	     * Sets the background color for the QR code to <code>background</code> and automatically updates this {@link QRious}
	     * if the underlying field is changed as a result.
	     *
	     * @param {string} [background="white"] - the background color to be set
	     * @public
	     */
	    ,
	    set: function set(background) {
	      if (optionManager.set('background', background, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the background alpha for the QR code.
	     *
	     * @return {number} The background alpha.
	     * @public
	     */

	  }, {
	    key: 'backgroundAlpha',
	    get: function get() {
	      return optionManager.get('backgroundAlpha', this);
	    }

	    /**
	     * Sets the background alpha for the QR code to <code>backgroundAlpha</code> and automatically updates this
	     * {@link QRious} if the underlying field is changed as a result.
	     *
	     * @param {number} [backgroundAlpha=1] - the background alpha to be set
	     * @public
	     */
	    ,
	    set: function set(backgroundAlpha) {
	      if (optionManager.set('backgroundAlpha', backgroundAlpha, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the <code>canvas</code> element being used to render the QR code for this {@link QRious}.
	     *
	     * @return {*} The <code>canvas</code> element.
	     * @public
	     */

	  }, {
	    key: 'canvas',
	    get: function get() {
	      return this._canvasRenderer.getElement();
	    }

	    /**
	     * Returns the foreground color for the QR code.
	     *
	     * @return {string} The foreground color.
	     * @public
	     */

	  }, {
	    key: 'foreground',
	    get: function get() {
	      return optionManager.get('foreground', this);
	    }

	    /**
	     * Sets the foreground color for the QR code to <code>foreground</code> and automatically updates this {@link QRious}
	     * if the underlying field is changed as a result.
	     *
	     * @param {string} [foreground="black"] - the foreground color to be set
	     * @public
	     */
	    ,
	    set: function set(foreground) {
	      if (optionManager.set('foreground', foreground, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the foreground alpha for the QR code.
	     *
	     * @return {number} The foreground alpha.
	     * @public
	     */

	  }, {
	    key: 'foregroundAlpha',
	    get: function get() {
	      return optionManager.get('foregroundAlpha', this);
	    }

	    /**
	     * Sets the foreground alpha for the QR code to <code>foregroundAlpha</code> and automatically updates this
	     * {@link QRious} if the underlying field is changed as a result.
	     *
	     * @param {number} [foregroundAlpha=1] - the foreground alpha to be set
	     * @public
	     */
	    ,
	    set: function set(foregroundAlpha) {
	      if (optionManager.set('foregroundAlpha', foregroundAlpha, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the <code>img</code> element being used to render the QR code for this {@link QRious}.
	     *
	     * @return {*} The <code>img</code> element.
	     * @public
	     */

	  }, {
	    key: 'image',
	    get: function get() {
	      return this._imageRenderer.getElement();
	    }

	    /**
	     * Returns the error correction level for the QR code.
	     *
	     * @return {string} The ECC level.
	     * @public
	     */

	  }, {
	    key: 'level',
	    get: function get() {
	      return optionManager.get('level', this);
	    }

	    /**
	     * Sets the error correction level for the QR code to <code>level</code> and automatically updates this {@link QRious}
	     * if the underlying field is changed as a result.
	     *
	     * <code>level</code> will be transformed to upper case to aid mapping to known ECC level blocks.
	     *
	     * @param {string} [level="L"] - the ECC level to be set
	     * @public
	     */
	    ,
	    set: function set(level) {
	      if (optionManager.set('level', level, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the MIME type for the image rendered for the QR code.
	     *
	     * @return {string} The image MIME type.
	     * @public
	     */

	  }, {
	    key: 'mime',
	    get: function get() {
	      return optionManager.get('mime', this);
	    }

	    /**
	     * Sets the MIME type for the image rendered for the QR code to <code>mime</code> and automatically updates this
	     * {@link QRious} if the underlying field is changed as a result.
	     *
	     * @param {string} [mime="image/png"] - the image MIME type to be set
	     * @public
	     */
	    ,
	    set: function set(mime) {
	      if (optionManager.set('mime', mime, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the padding for the QR code.
	     *
	     * @return {number} The padding in pixels.
	     * @public
	     */

	  }, {
	    key: 'padding',
	    get: function get() {
	      return optionManager.get('padding', this);
	    }

	    /**
	     * Sets the padding for the QR code to <code>padding</code> and automatically updates this {@link QRious} if the
	     * underlying field is changed as a result.
	     *
	     * <code>padding</code> will be transformed to ensure that it is always an absolute positive numbers (e.g.
	     * <code>-10</code> would become <code>10</code>).
	     *
	     * @param {number} [padding] - the padding in pixels to be set
	     * @public
	     */
	    ,
	    set: function set(padding) {
	      if (optionManager.set('padding', padding, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the size of the QR code.
	     *
	     * @return {number} The size in pixels.
	     * @public
	     */

	  }, {
	    key: 'size',
	    get: function get() {
	      return optionManager.get('size', this);
	    }

	    /**
	     * Sets the size of the QR code to <code>size</code> and automatically updates this {@link QRious} if the underlying
	     * field is changed as a result.
	     *
	     * <code>size</code> will be transformed to ensure that it is always an absolute positive numbers (e.g.
	     * <code>-100</code> would become <code>100</code>).
	     *
	     * @param {number} [size=100] - the size in pixels to be set
	     * @public
	     */
	    ,
	    set: function set(size) {
	      if (optionManager.set('size', size, this)) {
	        this.update();
	      }
	    }

	    /**
	     * Returns the value of the QR code.
	     *
	     * @return {string} The value.
	     * @public
	     */

	  }, {
	    key: 'value',
	    get: function get() {
	      return optionManager.get('value', this);
	    }

	    /**
	     * Sets the value of the QR code to <code>value</code> and automatically updates this {@link QRious} if the underlying
	     * field is changed as a result.
	     *
	     * @param {string} [value=""] - the value to be set
	     * @public
	     */
	    ,
	    set: function set(value) {
	      if (optionManager.set('value', value, this)) {
	        this.update();
	      }
	    }
	  }]);

	  return QRious;
	}();



	/**
	 * The options used by {@link QRious}.
	 *
	 * @typedef {Object} QRious~Options
	 * @property {string} [background="white"] - The background color to be applied to the QR code.
	 * @property {number} [backgroundAlpha=1] - The background alpha to be applied to the QR code.
	 * @property {*} [element] - The element to be used to render the QR code which may either be an <code>canvas</code> or
	 * <code>img</code>. The element(s) will be created if needed.
	 * @property {string} [foreground="black"] - The foreground color to be applied to the QR code.
	 * @property {number} [foregroundAlpha=1] - The foreground alpha to be applied to the QR code.
	 * @property {string} [level="L"] - The error correction level to be applied to the QR code.
	 * @property {string} [mime="image/png"] - The MIME type to be used to render the image for the QR code.
	 * @property {number} [padding] - The padding for the QR code in pixels.
	 * @property {number} [size=100] - The size of the QR code in pixels.
	 * @property {string} [value=""] - The value to be encoded within the QR code.
	 */

	/*
	 * QRious
	 * Copyright (C) 2017 Alasdair Mercer
	 * Copyright (C) 2010 Tom Zerucha
	 *
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 *
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */

	QRious$1.use(new BrowserElementService());

	return QRious$1;

})));

//# sourceMappingURL=qrious.js.map

/***/ }),

/***/ 830:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src__ = __webpack_require__(831);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__src__["a"]; });

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 831:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClipModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clip_directive__ = __webpack_require__(832);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ClipModule = ClipModule_1 = (function () {
    function ClipModule() {
    }
    ClipModule.forRoot = function () {
        return {
            ngModule: ClipModule_1
        };
    };
    return ClipModule;
}());
ClipModule = ClipModule_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1__clip_directive__["a" /* ClipDirective */]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1__clip_directive__["a" /* ClipDirective */]
        ]
    })
], ClipModule);

var ClipModule_1;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 832:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClipDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_clipboard__ = __webpack_require__(833);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_clipboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_clipboard__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ClipDirective = (function () {
    function ClipDirective(_ele) {
        this._ele = _ele;
        this.content = '';
        this.onClip = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    ClipDirective.prototype.ngOnInit = function () {
        var _this = this;
        var option = {
            text: function (ele) {
                return _this.content;
            }
        };
        this.clipboard = new __WEBPACK_IMPORTED_MODULE_1_clipboard__(this._ele.nativeElement, option);
        this.clipboard.on('success', function () {
            _this.onClip.emit(true);
        })
            .on('error', function () {
            _this.onClip.emit(false);
        });
    };
    ClipDirective.prototype.ngOnDestroy = function () {
        if (this.clipboard) {
            this.clipboard.destroy();
        }
    };
    return ClipDirective;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('clip'),
    __metadata("design:type", String)
], ClipDirective.prototype, "content", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], ClipDirective.prototype, "onClip", void 0);
ClipDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
        selector: '[clip]'
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
], ClipDirective);

//# sourceMappingURL=clip.directive.js.map

/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(834), __webpack_require__(836), __webpack_require__(837)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});

/***/ }),

/***/ 834:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(835)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});

/***/ }),

/***/ 835:
/***/ (function(module, exports) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ }),

/***/ 836:
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),

/***/ 837:
/***/ (function(module, exports, __webpack_require__) {

var is = __webpack_require__(838);
var delegate = __webpack_require__(839);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),

/***/ 838:
/***/ (function(module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(840);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),

/***/ 840:
/***/ (function(module, exports) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),

/***/ 866:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiveView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_social_sharing__ = __webpack_require__(820);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_clipboard__ = __webpack_require__(825);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_transact_rate_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_shared_config_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











let ReceiveView = class ReceiveView {
    constructor(navCtrl, navParams, modalCtrl, profileService, walletService, loadCtrl, toastCtrl, logger, socialSharing, clipboard, rateService, configService, events) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.profileService = profileService;
        this.walletService = walletService;
        this.loadCtrl = loadCtrl;
        this.toastCtrl = toastCtrl;
        this.logger = logger;
        this.socialSharing = socialSharing;
        this.clipboard = clipboard;
        this.rateService = rateService;
        this.configService = configService;
        this.events = events;
        this.protocolHandler = "merit";
        this.availableUnits = [
            this.configService.get().wallet.settings.unitCode.toUpperCase(),
            this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
        ];
        this.amountCurrency = this.availableUnits[0];
    }
    ionViewDidLoad() {
        this.profileService.getWallets().then((wallets) => {
            this.wallets = wallets;
            if (this.wallets && this.wallets[0]) {
                this.wallet = this.wallets[0];
                this.generateAddress();
            }
        });
        // Get a new address if we just received an incoming TX (on an address we already have)
        this.events.subscribe('Remote:IncomingTx', (walletId, type, n) => {
            this.logger.info("Got an incomingTx on receive screen: ", n);
            if (this.wallet && this.wallet.id == walletId && n.data.address == this.address) {
                this.generateAddress(true);
            }
        });
    }
    generateAddress(forceNew) {
        this.addressGenerationInProgress = true;
        this.walletService.getAddress(this.wallet, forceNew).then((address) => {
            this.address = address;
            this.addressGenerationInProgress = false;
            this.formatAddress();
        }).catch((err) => {
            this.addressGenerationInProgress = false;
            this.logger.warn('Failed to generate new adrress ' + err);
            this.toastCtrl.create({
                message: 'Failed to generate new adrress',
                cssClass: __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
    }
    selectWallet() {
        let modal = this.modalCtrl.create('SelectWalletModal', { selectedWallet: this.wallet, availableWallets: this.wallets });
        modal.present();
        modal.onDidDismiss((wallet) => {
            if (wallet) {
                this.wallet = wallet;
                this.generateAddress(false);
            }
        });
    }
    share() {
        this.socialSharing.share(this.qrAddress);
    }
    copyToClipboard(addressString) {
        if (!addressString)
            return;
        const address = addressString.split(':')[1] || addressString;
        this.clipboard.copy(address);
        this.toastCtrl.create({
            message: 'Address copied to clipboard',
            cssClass: __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_config__["a" /* ToastConfig */].CLASS_MESSAGE
        }).present();
    }
    toCopayers() {
        this.navCtrl.push('CopayersView', { walletId: this.wallet.id, wallet: this.wallet });
    }
    toggleCurrency() {
        this.amountCurrency = this.amountCurrency == this.availableUnits[0] ? this.availableUnits[1] : this.availableUnits[0];
        this.changeAmount();
    }
    changeAmount() {
        if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
            this.amountMicros = this.rateService.mrtToMicro(this.amount);
        }
        else {
            this.amountMicros = this.rateService.fromFiatToMicros(this.amount, this.amountCurrency);
        }
        this.formatAddress();
    }
    formatAddress() {
        this.qrAddress = `${this.protocolHandler}:${this.address}${this.amountMicros ? '?micros=' + this.amountMicros : ''}`;
    }
};
ReceiveView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-receive',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/transact/receive/receive.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Receive Merit</ion-title>\n        <ion-buttons end>\n            <button ion-button icon-only (click)="share()">\n                <ion-icon name="share"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-card *ngIf="wallet && !wallet.isComplete()" margin-top> \n        <ion-card-header translate>This wallet is incomplete.</ion-card-header>\n        <ion-card-content translate>\n            All signing devices must be added to this multisig wallet before merit addresses can be created.\n        </ion-card-content>\n\n        <button (click)="toCopayers()" ion-button>Open Wallet</button>\n    </ion-card>\n\n    <div class="container" *ngIf="wallet && wallet.isComplete() && qrAddress && !addressGenerationInProgress">\n\n        <qr-code *ngIf="address" [value]="qrAddress" [level]="M" [size]="220" [foreground]="\'#334\'"></qr-code>\n        <div  class="address" (click)="copyToClipboard(address)"  [clip]="qrAddress">{{qrAddress}}</div>\n    </div>\n\n    <div class="container">\n        <div class="spinner-wrapper" *ngIf="addressGenerationInProgress">\n            <ion-spinner></ion-spinner>\n        </div>\n    </div>\n\n\n    <div class="container" *ngIf="wallet && wallet.isComplete() && !qrAddress && !addressGenerationInProgress">\n        No address available for this wallet\n    </div>\n\n\n\n</ion-content>\n\n<ion-footer >\n    <ion-toolbar>\n\n        <ion-item *ngIf="!wallet">\n            <ion-label translate>You don\'t have any wallet</ion-label>\n        </ion-item>\n\n\n        <span *ngIf="wallet">\n\n            <div class="row">\n                <span class="label" text-left>Amount</span>\n                <input type="number"\n                       [style.flex]="1"\n                       text-right\n                       pattern="[0-9\.]"\n                       [(ngModel)]="amount"\n                       (ngModelChange)="changeAmount()"\n                       [placeholder]="\'Request specific amount (optional)\'">\n                <button ion-button clear color="primary" (click)="toggleCurrency()">\n                    {{amountCurrency}}\n                </button>\n            </div>\n\n\n            <div class="row">\n                <span class="label" text-left >Address</span>\n                <span item-right text-right [style.flex]="1" [style.font-size]="\'10px\'" (click)="copyToClipboard(address)" [clip]="address">\n                    {{address}}\n                </span>\n                <button ion-button icon-only clear color="primary" (click)="generateAddress(forceNew = true)"  class="select-button">\n                    <ion-icon name="refresh"></ion-icon>\n                </button>\n            </div>\n\n             <div class="label" class="row" (click)="selectWallet()">\n                 <span text-left class="label">Receive in</span>\n                 <span item-right text-right [style.flex]="1">\n                     {{wallet.name || wallet._id}}\n                     <button ion-button icon-only clear color="primary"  class="wallet-button">\n                         <i class="wallet-icon" item-start [class.locked]="wallet.locked" [class.default]="!wallet.color" [style.background]="wallet.color">\n                             <img src="assets/img/icon-wallet.svg"   >\n                         </i>\n                     </button>\n                 </span>\n             </div>\n        </span>\n\n    </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/transact/receive/receive.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_7__ionic_native_social_sharing__["a" /* SocialSharing */],
        __WEBPACK_IMPORTED_MODULE_8__ionic_native_clipboard__["a" /* Clipboard */],
        __WEBPACK_IMPORTED_MODULE_9_merit_transact_rate_service__["a" /* RateService */],
        __WEBPACK_IMPORTED_MODULE_10_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]])
], ReceiveView);

//# sourceMappingURL=receive.js.map

/***/ })

});
//# sourceMappingURL=0.js.map