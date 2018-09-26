import { DebugElement, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { GlobalsendLinkPopupController } from '@merit/desktop/app/components/globalsend-link-popup/globalsend-link-popup.controller';
import { ClipModule } from 'ng2-clip';
import { MomentModule } from 'ngx-moment';
import { HistoryItemComponent } from './history-item.component';


const BASE_TRANSACTION: Partial<IDisplayTransaction> = {
  isConfirmed: true,
  isInvite: false,
  isCoinbase: false,
  wallet: <MeritWalletClient>{
    name: 'Personal wallet'
  },
  time: Date.now() / 1000
};

@Injectable()
class MockToastController {
  create() {}
  success() {}
}

@Injectable()
class MockMeritMoneyLinkPopupController {
  create() {}
}

@Injectable()
class MockEasyReceiveService {}

describe('History item component', () => {

  let instance: ComponentFixture<HistoryItemComponent>,
    de: DebugElement,
    comp: HistoryItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HistoryItemComponent
      ],
      providers: [
        { provide: GlobalsendLinkPopupController, useClass: MockMeritMoneyLinkPopupController },
        { provide: ToastControllerService, useClass: MockToastController },
        { provide: EasyReceiveService, useClass: MockEasyReceiveService },
      ],
      imports: [
        ClipModule,
        MomentModule
      ]
    }).compileComponents();

    instance = TestBed.createComponent(HistoryItemComponent);
    comp = instance.componentInstance;
    de = instance.debugElement;
  });

  describe('Received Merit', () => {
    const name = '@demo',
      amountStr = '10.00',
      alternativeAmountStr = '10.00 USD';

    beforeEach(() => {
      comp.tx = <IDisplayTransaction>{
        ...BASE_TRANSACTION,
        type: 'credit',
        action: TransactionAction.RECEIVED,
        name,
        amountStr,
        alternativeAmountStr
      };
      instance.detectChanges();
    });

    it('should show Merit icon', () => {
      expect(de.nativeElement.querySelector('img[src*=merit]')).toBeDefined();
    });

    it('should show alias of sender', () => {
      expect(de.nativeElement.querySelector('.title').innerHTML).toContain(name);
    });

    it('should show "Received to <wallet name>"', () => {
      const { innerHTML } = de.nativeElement.querySelector('.title:nth-child(2)');
      expect(innerHTML).toContain('Received to');
      expect(innerHTML).toContain('Personal wallet');
    });

  });

});
