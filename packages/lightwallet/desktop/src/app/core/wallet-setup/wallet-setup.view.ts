import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { MeritAchivementClient } from '@merit/common/achievements-client/api';
import { ENV } from '@app/env';

@Component({
  selector: 'app-wallet-setup',
  templateUrl: './wallet-setup.view.html',
  styleUrls: ['./wallet-setup.view.sass'],
})
export class WalletSetupView implements OnInit {
  constructor(private persistenceService: PersistenceService) {}

  ngOnInit() {}
}
