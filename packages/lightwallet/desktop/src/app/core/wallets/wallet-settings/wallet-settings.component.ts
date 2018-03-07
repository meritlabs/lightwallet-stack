import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-wallet-settings',
  templateUrl: './wallet-settings.component.html',
  styleUrls: ['./wallet-settings.component.sass']
})
export class WalletSettingsComponent implements OnInit {
  wallet: any = {
    name: 'Wallet name',
    color: {
      name: 'Green',
      rgba: '87,182,121, .6'
    }
  };
  avalibleColors: any = [
    {
      name: 'Green',
      rgba: '87,182,121, .6'
    },
    {
      name: 'Blue',
      rgba: '0,0,255, .5'
    },
    {
      name: 'Red',
      rgba: '255,0,0, .5'
    }
  ];
  constructor() { }
  ngOnInit() { }
  selectColor($event) {
    this.wallet.color = $event
  }
}
