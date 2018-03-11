import { Component, OnDestroy, OnInit } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { selectWalletById, UpdateOneWalletAction } from '@merit/common/reducers/wallets.reducer';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'view-wallet-settings',
  templateUrl: './wallet-settings.component.html',
  styleUrls: ['./wallet-settings.component.sass']
})
export class WalletSettingsComponent implements OnInit, OnDestroy {
  availableColors: any = [
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

  selectedColor: any;

  wallet: DisplayWallet;

  settingsForm = this.formBuilder.group({
    name: '',
    balanceHidden: false
  });

  passwordChangeForm = this.formBuilder.group({
    currentPassword: '',
    password: '',
    repeatPassword: ''
  });

  private subs: any[] = [];

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.subs.push(this.route.parent.params.pipe(
      tap(params => console.log('Params are ', params)),
      switchMap(({ id }) => this.store.select(selectWalletById(id)))
    ).subscribe((wallet: DisplayWallet) => {
      this.wallet = wallet;

      this.settingsForm.get('name').setValue(wallet.name);
      this.settingsForm.get('balanceHidden').setValue(wallet.balanceHidden);

      this.selectedColor = this.availableColors.find(c => wallet.color == c.color);
      this.subs.push(this.settingsForm.valueChanges.pipe(debounceTime(100)).subscribe(({ name, balanceHidden }) => {
        this.wallet.name = name;
        this.wallet.balanceHidden = balanceHidden;
        this.store.dispatch(new UpdateOneWalletAction(this.wallet));
      }));
    }));
  }

  ngOnDestroy() {
    try {
      this.subs.forEach(sub => sub.unsubscribe());
    } catch (e) {}
  }

  selectColor(selectedColor: any) {
    this.selectedColor = selectedColor;
    this.wallet.color = selectedColor.color;
    this.store.dispatch(new UpdateOneWalletAction(this.wallet));
  }
}
