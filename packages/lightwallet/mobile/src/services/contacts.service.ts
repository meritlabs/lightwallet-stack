import { Injectable } from '@angular/core';
import { ContactsService as OriginalContactsProvider } from '@merit/common/services/contacts.service';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Contacts } from '@ionic-native/contacts';
import { PersistenceService } from '@merit/common/services/persistence.service';

const DESIRED_FIELDS = ['displayName', 'emails', 'name', 'phoneNumbers', 'photos'];

@Injectable()
export class ContactsService extends OriginalContactsProvider {
  private devicePermissionGranted: boolean;
  private devicePermissionStatus: string;

  constructor(
    private deviceContactsProvider: Contacts,
    private deviceDiagnosticProvider: Diagnostic,
    persistenceService: PersistenceService,
  ) {
    super(persistenceService);
  }

  protected async _init() {
    this.devicePermissionGranted = await this.hasDevicePermission();
    if (!this.devicePermissionGranted && Diagnostic.installed()) {
      this.devicePermissionStatus = await this.deviceDiagnosticProvider.getContactsAuthorizationStatus();
    }
    return super._init();
  }

  async requestDevicePermission() {
    if (!Diagnostic.installed()) return false;

    // we have permission, no need to request it again
    if (await this.hasDevicePermission()) return true;

    // we do not have permission
    const status: string = (this.devicePermissionStatus = await this.deviceDiagnosticProvider.requestContactsAuthorization());

    // permission was granted
    if (
      [
        this.deviceDiagnosticProvider.permissionStatus.GRANTED,
        this.deviceDiagnosticProvider.permissionStatus.GRANTED_WHEN_IN_USE,
      ].indexOf(status) > -1
    )
      return (this.devicePermissionGranted = true);

    // permission wasn't granted
    return false;
  }

  async getDeviceContacts() {
    if (!(await this.hasDevicePermission())) return [];

    return this.deviceContactsProvider.find(['emails', 'phoneNumbers'], {
      desiredFields: DESIRED_FIELDS,
      multiple: true,
    });
  }

  async isDevicePermissionDeclined() {
    await this.init;

    if (this.devicePermissionGranted === true) return true;
    return (
      [
        this.deviceDiagnosticProvider.permissionStatus.DENIED,
        this.deviceDiagnosticProvider.permissionStatus.DENIED_ALWAYS,
      ].indexOf(this.devicePermissionStatus) > -1
    );
  }

  async getAllMeritContacts() {
    return super.getAllMeritContacts(await this.getDeviceContacts());
  }

  private async hasDevicePermission() {
    if (!Diagnostic.installed()) return false;
    return (
      (await this.deviceDiagnosticProvider.getContactsAuthorizationStatus()) ===
      this.deviceDiagnosticProvider.permissionStatus.GRANTED
    );
  }
}
