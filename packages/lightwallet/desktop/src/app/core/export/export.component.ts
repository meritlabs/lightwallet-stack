import { Component } from '@angular/core';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';


@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.sass']
})
export class ExportComponent {
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
  constructor(){}
}