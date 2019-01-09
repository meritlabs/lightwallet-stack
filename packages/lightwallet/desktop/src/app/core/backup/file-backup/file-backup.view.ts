import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { IRootAppState } from '@merit/common/reducers';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { MWCService } from '@merit/common/services/mwc.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import * as FileSaver from 'file-saver';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

@Component({
  selector: 'view-file-backup',
  templateUrl: './file-backup.view.html',
})
export class FileBackupView {
  formData = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(1)]],
    repeatPassword: ['', [Validators.required, PasswordValidator.MatchPassword]],
  });

  get password() {
    return this.formData.get('password');
  }

  get repeatPassword() {
    return this.formData.get('repeatPassword');
  }

  wallet$: Observable<DisplayWallet> = this.route.parent.params.pipe(
    switchMap((params: any) => this.store.select(selectWalletById(params.id))),
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<IRootAppState>,
    private formBuilder: FormBuilder,
    private mwcService: MWCService,
    private appSettingsService: AppSettingsService,
  ) {}

  async downloadFileBackup() {
    const wallet = await this.wallet$.take(1).toPromise();
    const exportData = wallet.client.export();
    const encryptedData = this.mwcService.getSJCL().encrypt(this.password.value, exportData, { iter: 10000 });
    const walletName = wallet.name;
    const info = await this.appSettingsService.getInfo();
    const fileName = `${walletName}-${info.nameCase || ''}.backup.aes.json`;
    const blob = new Blob([encryptedData], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(blob, fileName);
  }
}
