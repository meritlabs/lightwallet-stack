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
      name: 'Sunglo',
      color: 'rgba(87,182,121, .6)'
    }
  };
  avalibleColors: any = [
    {
      name: 'Sunglo',
      color: '#E57373'
    },
    {
      name: 'Carissma',
      color: '#E985A7'
    },
    {
      name: 'Light Wisteria',
      color: '#ca85d6'
    },
    {
      name: 'Lilac Bush',
      color: '#A185D4'
    },
    {
      name: 'Moody Blue',
      color: '#7987d1'
    },
    {
      name: 'Havelock Blue',
      color: '#64aae3'
    },
    {
      name: 'Picton Blue',
      color: '#53b9e8'
    },
    {
      name: 'Viking',
      color: '#4ccdde'
    },
    {
      name: 'Ocean Green',
      color: '#48ae6c'
    },
    {
      name: 'Puerto Rico',
      color: '#44baad'
    },
    {
      name: 'Wild Willow',
      color: '#99c666'
    },
    {
      name: 'Turmeric',
      color: '#bcc84c'
    },
    {
      name: 'Buttercup',
      color: '#f5a623'
    },
    {
      name: 'Supernova',
      color: '#ffc30e'
    },
    {
      name: 'Yellow Orange',
      color: '#ffaf37'
    },
    {
      name: 'Portage',
      color: '#8997eb'
    },
    {
      name: 'Gray',
      color: '#808080'
    },
    {
      name: 'Shuttle Gray',
      color: '#5f6c82'
    },
    {
      name: 'Tuna',
      color: '#383d43'
    }
  ];
  constructor() { }
  ngOnInit() { }
  selectColor($event) {
    this.wallet.color = $event
  }
}
