import { Component, Input, OnInit} from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'app-welcome-guide',
  templateUrl: './welcome-guide.component.html',
  styleUrls: ['./welcome-guide.component.sass']
})

export class WelcomeGuideComponent {
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
  copy: string = "COPY";
  hideWinow: boolean = false;
  copyState() {
    this.copy = "COPIED";
    let _this = this;
    setTimeout(function() {
      _this.copy = "COPY";
    }, 1000);
  }
  disableWinow() {
    this.hideWinow = true;
    localStorage.setItem("hideWalletWelcomeWinow", "true");
  }
  ngOnInit() {
    let hideWinow;
    if("hideWalletWelcomeWinow" in localStorage && localStorage.getItem("hideWalletWelcomeWinow") === 'true') {
      hideWinow = true;
    }else {
      hideWinow  = false;
    }
    this.hideWinow = hideWinow;
  }
}
