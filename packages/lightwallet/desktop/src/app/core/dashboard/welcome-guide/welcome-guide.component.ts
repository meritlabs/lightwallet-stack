import { Component, Input} from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'app-welcome-guide',
  templateUrl: './welcome-guide.component.html',
  styleUrls: ['./welcome-guide.component.sass']
})

export class WelcomeGuideComponent {
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
}
