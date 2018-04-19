import { Component, Input, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-welcome-guide',
  templateUrl: './welcome-guide.component.html',
  styleUrls: ['./welcome-guide.component.sass']
})

export class WelcomeGuideComponent {
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
  mnemonic: any;
  ngOnInit() {
    this.mnemonic = this.wallets[0].client.getMnemonic();
  }
}
