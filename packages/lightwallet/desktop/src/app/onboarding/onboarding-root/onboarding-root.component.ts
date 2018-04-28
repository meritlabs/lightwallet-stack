import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';

@Component({
  selector: 'view-onboarding-root',
  templateUrl: './onboarding-root.component.html',
  styleUrls: ['./onboarding-root.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class OnboardingRootComponent implements OnInit {
  constructor(
    private router: Router,
    private easyReceiveService: EasyReceiveService
  ) {
  }

  async ngOnInit() {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (receipts && receipts[0]) {
      this.router.navigateByUrl('onboarding/unlock');
    } 
  }

}
