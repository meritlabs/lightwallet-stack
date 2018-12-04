import { Component } from '@angular/core';
import { IDynamicComponent } from '../dom.controller';
import { ToastControllerService } from '../toast-notification/toast-controller.service';

@Component({
  selector: 'meritmoney-link-popup',
  styleUrls: ['./globalsend-link-popup.component.sass'],
  template: `
    <div class="ui-prompt">
      <h2 class="title">{{ isInvite? 'MeritInvite' : 'MeritMoney' }} Link</h2>
      <div class="message">
        Click on the link to copy
        <div class="globalsend-link" (click)="onCopy()" [clip]="globalSendURL">{{ globalSendURL }}</div>
      </div>
      <div class="controls">
        <button (click)="dismiss()"
                class="ui-button ui-button--md ui-button--blue">Close
        </button>
      </div>
    </div>
    <app-backdrop (click)="dismiss()"></app-backdrop>

  `,
})
export class GlobalsendLinkPopupComponent implements IDynamicComponent {
  destroy: Function;
  globalSendURL: string;
  isInvite: boolean;

  constructor(private toastCtrl: ToastControllerService) {}

  init(globalSendURL: string, isInvite?: boolean) {
    this.isInvite = isInvite;
    this.globalSendURL = globalSendURL;
  }

  onCopy() {
    this.toastCtrl.success((this.isInvite ? 'MeritInvite' : 'MeritMoney') + ' link copied!');
  }

  dismiss() {
    this.destroy();
  }
}
