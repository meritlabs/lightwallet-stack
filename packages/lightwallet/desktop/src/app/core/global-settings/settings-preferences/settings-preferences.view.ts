import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { State } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { isEmpty } from 'lodash';
import { filter, tap } from 'rxjs/operators';

declare const WEBPACK_CONFIG: any;

@Component({
  selector: 'view-settings-preferences',
  templateUrl: './settings-preferences.view.html',
  styleUrls: ['./settings-preferences.view.sass']
})
export class SettingsPreferencesView {

  formData: FormGroup = this.formBuilder.group({
    pushNotifications: false,
    notifyOnConfirmedTx: false,
    emailNotifications: false,
    email: [''] // TODO(ibby): validate email
  });

  commitHash: string;
  version: string;

  private subscription;


  constructor(private formBuilder: FormBuilder,
              private state: State<IRootAppState>,
              private persistenceService: PersistenceService2) {
    if (typeof WEBPACK_CONFIG !== 'undefined') {
      this.commitHash = WEBPACK_CONFIG.COMMIT_HASH;
      this.version = WEBPACK_CONFIG.VERSION;
    }
  }

  async ngOnInit() {
    const settings = await this.persistenceService.getNotificationSettings();
    if (!isEmpty(settings)) {
      this.formData.setValue(settings);
    }

    this.subscription = this.formData.valueChanges
      .pipe(
        filter(() => !this.formData.invalid),
        tap((newValue: any) => this.persistenceService.setNotificationSettings(newValue))
      )
      .subscribe();
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (e) {
    }
  }
}
