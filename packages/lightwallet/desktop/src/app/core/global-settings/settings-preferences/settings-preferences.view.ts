import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { State } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { isEmpty } from 'lodash';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { merge } from 'rxjs/observable/merge';

declare const WEBPACK_CONFIG: any;

@Component({
  selector: 'view-settings-preferences',
  templateUrl: './settings-preferences.view.html',
  styleUrls: ['./settings-preferences.view.sass']
})
export class SettingsPreferencesView implements OnInit, OnDestroy {

  formData: FormGroup = this.formBuilder.group({
    pushNotifications: false,
    emailNotifications: false,
    email: [''] // TODO(ibby): validate email
  });

  commitHash: string;
  version: string;

  private subs: any[] = [];


  constructor(private formBuilder: FormBuilder,
              private state: State<IRootAppState>,
              private persistenceService: PersistenceService2,
              private emailNotificationsService: EmailNotificationsService,
              private pushNotificationsService: PushNotificationsService) {
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

    this.subs.push(
      this.formData.valueChanges
        .pipe(
          filter(() => this.formData.valid),
          tap((newValue: any) => this.persistenceService.setNotificationSettings(newValue))
        )
        .subscribe()
    );

    this.subs.push(
      this.formData.get('pushNotifications').valueChanges
        .pipe(
          debounceTime(100),
          tap((enabled: boolean) => {
            if (enabled) {
              this.pushNotificationsService.init();
            } else {
              this.pushNotificationsService.disable();
            }
          })
        )
        .subscribe()
    );

    this.subs.push(
      merge(this.formData.get('email').valueChanges, this.formData.get('emailNotifications').valueChanges)
        .pipe(
          debounceTime(100),
          filter(() => this.formData.valid),
          tap(() =>
            this.emailNotificationsService.updateEmail({
              enabled: this.formData.get('emailNotifications').value,
              email: this.formData.get('email').value
            })
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    try {
      this.subs.forEach(sub => sub.unsubscribe());
    } catch (e) {
    }
  }
}
