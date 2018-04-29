import { browser, by, element } from 'protractor';
import { Transact } from './transact.po';
import { EC, TEST_WALLET_ALIAS, TEST_WALLET_NAME } from './app.e2e-spec';

describe('[Mobile] Wallet details', () => {

  let transact: Transact,
    rootEl;

  beforeAll(() => {
    transact = new Transact();
    transact.selectTab(0);
    browser.wait(EC.visibilityOf(transact.getRootEl()));
    transact.getRootEl().element('ion-list.wallets button[ion-item]').click();
    rootEl =  transact.getRootEl().element(by.css('view-wallet-details'));
    browser.wait(EC.visibilityOf(rootEl));
  });

  it('should show wallet details view', () => {
    expect(rootEl.isDisplayed()).toBeTruthy();
    expect(browser.getCurrenturl()).toContain('wallets/wallet');
  });

  describe('> Header', () => {
    let headerEl,
    titleEl,
    bigHeaderEl;

    beforeAll(() => {
      headerEl = rootEl.element(by.css('ion-header'));
      titleEl = headerEl.element(by.css('ion-title'));
      bigHeaderEl = headerEl.element(by.css('.big-header'));
    });

    it('should display wallet name', () => {
      expect(titleEl.getText()).toContain(TEST_WALLET_NAME);
    });

    it('should display wallet alias', () => {
      expect(titleEl.getText()).toContain(TEST_WALLET_ALIAS);
    });

    it('should display wallet balance', () => {
      expect(bigHeaderEl.element('.amount').getText()).toContain('MRT');
    });

    it('should have a button to deposit merit', () => {
      const el = bigHeaderEl.element('.action-buttons .button-cell:first-child');
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('DEPOSIT');
    });

    it('should have a button to send merit', () => {
      const el = bigHeaderEl.element('.action-buttons .button-cell:last-child');
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('SEND');
    });

    it('should have a button to edit wallet preferences', () => {
      const el = bigHeaderEl.element('button[navpush=EditWalletView]');
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.isEnabled()).toBeTruthy();
    });
  });


});
