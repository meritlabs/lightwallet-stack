import { DebugElement, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { ClipModule } from 'ng2-clip';
import { GlobalsendLinkPopupController } from '../../../components/globalsend-link-popup/globalsend-link-popup.controller';
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
class MockGlobalSendLinkPopupController {
  create() {}
}

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
        { provide: GlobalsendLinkPopupController, useClass: MockGlobalSendLinkPopupController }
      ],
      imports: [
        ClipModule
      ]
    }).compileComponents();

    instance = TestBed.createComponent(HistoryItemComponent);
    comp = instance.componentInstance;
  });

  describe('Received Merit', () => {
    const name = '@meritlover',
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
    });

    it('should show merit icon', () => {
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
