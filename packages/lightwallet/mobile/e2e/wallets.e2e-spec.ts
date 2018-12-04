import { browser, by, element } from 'protractor';
import { EC, TEST_WALLET_ALIAS, TEST_WALLET_NAME } from './app.e2e-spec';
import { Transact } from './transact.po';

describe('[Mobile] Wallets view', () => {
  let rootEl;
  let headerEl;
  let transact: Transact;

  beforeAll(() => {
    transact = new Transact();
    transact.selectTab(0);
    rootEl = element(by.css('view-wallets'));
  });

  describe('> Header', () => {
    it('should be visible', () => {
      headerEl = rootEl.element(by.css('.big-header'));
      browser.wait(EC.visibilityOf(headerEl), 2000);
      expect(headerEl.isDisplayed()).toBeTruthy();
    });

    it('should have a button to go to settings', () => {
      const el = headerEl.element(by.css('button[navpush=SettingsView]'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.isEnabled()).toBeTruthy();
    });

    it('should show merit balance', () => {
      const el = headerEl.element(by.css('h2.amount'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('MRT');
    });

    it('should show invites balance', () => {
      const el = headerEl.element(by.css('.detail-fiat:last-child'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('Invites');
    });
  });

  describe('> Wallets list', () => {
    let walletsListEl, walletItemEl, walletItemLabelEl;

    beforeAll(() => {
      walletsListEl = rootEl.element(by.css('ion-list.wallets'));
      walletItemEl = walletsListEl.element(by.css('button[ion-item]'));
      walletItemLabelEl = walletItemEl.element(by.css('ion-label'));
    });

    it('should be visible', () => {
      expect(walletsListEl.isDisplayed()).toBeTruthy();
    });

    it('should show one wallet', () => {
      expect(walletItemEl.isDisplayed()).toBeTruthy();
    });

    it('should show wallet name', () => {
      expect(walletItemLabelEl.getText()).toContain(TEST_WALLET_NAME);
    });

    it('should show wallet balance', () => {
      expect(walletItemLabelEl.getText()).toContain('MRT');
    });

    it('should show wallet alias', () => {
      expect(walletItemLabelEl.getText()).toContain(TEST_WALLET_ALIAS);
    });
  });
});
