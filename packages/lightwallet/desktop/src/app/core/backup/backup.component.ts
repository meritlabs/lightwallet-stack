import { Component, OnInit } from '@angular/core';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import { WalletService } from '@merit/common/services/wallet.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.sass']
})
export class BackupComponent implements OnInit {
  wallet$: DisplayWallet; 
  segment: string = 'mnemonic';
  accessGranted: boolean; 
  mnemonic: string;
  qrcode: string;
  private sjcl;

  formData = {
    password: '',
    repeatPassword: ''
  }

  qrCode: Observable<String> = fromPromise(this.walletsService.getEncodedWalletInfo(this.wallet$.client, password));

  constructor(
    private walletsService: WalletService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
  }

  
}
