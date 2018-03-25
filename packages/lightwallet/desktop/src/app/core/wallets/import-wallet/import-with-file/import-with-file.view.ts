import { Component } from '@angular/core';
import { MWCService } from '@merit/common/services/mwc.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { LoggerService } from '@merit/common/services/logger.service';
import { ENV } from '@app/env';
import { ProfileService } from '@merit/common/services/profile.service';
import { AddWalletAction } from '@merit/common/reducers/wallets.reducer';
import { createDisplayWallet } from '@merit/common/models/display-wallet';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { Router } from '@angular/router';

@Component({
  selector: 'view-import-with-file',
  templateUrl: './import-with-file.view.html',
  styleUrls: ['./import-with-file.view.scss']
})
export class ImportWithFileView {

  formData = {
    backupFile: null,
    backupFileBlob: null,
    filePassword: '',
    mwsUrl: ENV.mwsUrl
  };

  private sjcl = this.mwcService.getSJCL();

  constructor(private mwcService: MWCService,
              private store: Store<IRootAppState>,
              private logger: LoggerService,
              private profileService: ProfileService,
              private walletService: WalletService,
              private addressService: AddressService,
              private txFormatService: TxFormatService,
              private router: Router) {
  }

  fileChangeListener($event) {
    this.formData.backupFile = $event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = (loadEvent: any) => {
      if (loadEvent.target.readyState == 2) { //DONE  == 2
        this.formData.backupFileBlob = loadEvent.target.result;
      }
    };

    reader.readAsText($event.target.files[0]);
  }

  async importBlob() {
    let decrypted;
    try {
      decrypted = this.sjcl.decrypt(this.formData.filePassword, this.formData.backupFileBlob);
    } catch (e) {

      this.logger.warn(e);
      // return this.toastCtrl.create({
      //   message: 'Could not decrypt file, check your password',
      //   cssClass: ToastConfig.CLASS_ERROR
      // }).present();
    }

    // const loader = this.loadingCtrl.create({ content: 'importingWallet' });
    // loader.present();

    try {
      const wallet = await this.profileService.importWallet(decrypted, { bwsurl: this.formData.mwsUrl });
      this.profileService.setBackupFlag(wallet.credentials.walletId);
      // this.pushNotificationsService.subscribe(wallet);

      console.log('Done importing wallet!');
      this.store.dispatch(
        new AddWalletAction(
          await createDisplayWallet(wallet, this.walletService, this.addressService, this.txFormatService)
        )
      );

      return this.router.navigateByUrl('/wallets');

    } catch (err) {
      // loader.dismiss();
      this.logger.warn(err);
      // this.toastCtrl.create({
      //   message: err,
      //   cssClass: ToastConfig.CLASS_ERROR
      // }).present();
    }
  }

}
