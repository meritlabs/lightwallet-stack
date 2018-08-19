import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import * as FileSaver from 'file-saver';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { WalletService } from '@merit/common/services/wallet.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { DisplayWallet } from '../../../../../common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-export-wallet',
  templateUrl: 'export-wallet.html',
})
export class ExportWalletView {

  wallet: DisplayWallet;
  segment = 'mnemonic';
  accessGranted: boolean;
  formData = {
    password: '',
    repeatPassword: ''
  };
  mnemonic: string;
  qrcode: string;
  private sjcl;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletsService: WalletService,
              private alertController: AlertController,
              private persistenceService: PersistenceService,
              private appService: AppSettingsService,
              private bwcService: MWCService,
              private toastCtrl: ToastControllerService,
              private file: File,
              private platform: Platform,
              private logger: LoggerService) {
    this.wallet = this.navParams.get('wallet');
    this.sjcl = this.bwcService.getSJCL();
  }

  ionViewDidLoad() {

    let setQrInfo = (password) => {
      this.walletsService.getEncodedWalletInfo(this.wallet.client, password).then((info) => {
        this.qrcode = info;
      });
    };

    if (this.walletsService.isWalletEncrypted(this.wallet.client)) {

      let showPrompt = (highlightInvalid = false) => {
        this.alertController.create({
          title: 'Enter spending password',
          message: 'Spending password required to export this wallet. This is not the password you will use to protect exported file.',
          cssClass: highlightInvalid ? 'invalid-input-prompt' : '',
          inputs: [{
            name: 'password',
            placeholder: 'Password',
            type: 'password'
          }],
          buttons: [
            {
              text: 'Cancel', role: 'cancel', handler: () => {
              this.navCtrl.pop();
            }
            },
            {
              text: 'Ok', handler: (data) => {
              if (!data.password) {
                showPrompt(true);
              } else {
                try {
                  this.walletsService.decryptWallet(this.wallet.client, data.password);
                  this.mnemonic = this.wallet.client.getMnemonic();
                  setQrInfo(data.password);
                  this.walletsService.encryptWallet(this.wallet.client, data.password);
                  this.accessGranted = true;
                } catch (err) {
                  showPrompt();
                }
              }
            }
            }
          ]
        }).present();
      };
      showPrompt();
    } else {
      this.mnemonic = this.wallet.client.getMnemonic();
      setQrInfo(null);
      this.accessGranted = true;
    }
  }

  saveEnabled() {
    return (
      this.formData.password
      && this.formData.password == this.formData.repeatPassword
    );
  }

  async download() {

    const addressBook = await this.persistenceService.getAddressbook(this.wallet.credentials.network);
    const exportData = this.wallet.client.export({ addressBook: addressBook });
    const encryptedData = this.sjcl.encrypt(this.formData.password, exportData, { iter: 10000 });
    const walletName = this.wallet.name;
    const info: any = await this.appService.getInfo();
    const defaultFileName = `${walletName}-${info.nameCase || ''}.backup.aes.json`;
    const blob = new Blob([encryptedData], { type: 'text/plain;charset=utf-8' });

    const done = (fileName: string = defaultFileName) => this.toastCtrl.success(`Wallet exported to ${ fileName }`);

    if (this.platform.is('cordova')) {
      const root = this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalRootDirectory;
      return this.alertController.create({
        title: 'Set file name',
        message: 'Enter a name for the file to export your wallet',
        inputs: [
          {
            name: 'name',
            placeholder: 'File name',
            value: defaultFileName
          }
        ],
        buttons: [
          'Cancel',
          {
            text: 'Export',
            handler: (data) => {
              if (data.name && data.name.length) {
                (async () => {

                  try {
                    await this.file.checkFile(root, data.name);
                    // file exists
                    return this.toastCtrl.error('There is already a file with the name you specified. Please pick another name.');
                  } catch (e) {
                    // file doesn't exist
                    try {
                      await this.file.writeFile(root, data.name, blob);
                      return done();
                    } catch (e) {
                      this.logger.error('Error export wallet to file', e);
                      return this.toastCtrl.error('An error occurred while exporting your wallet.');
                    }
                  }

                })();
              } else {
                return false;
              }
            }
          }
        ]
      }).present();

    } else {
      await FileSaver.saveAs(blob, defaultFileName);
      return done();
    }
  }


  public notifyCopied() {
    this.toastCtrl.success('Copied to clipboard');
  }

}
