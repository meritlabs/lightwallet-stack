import { browser, by, element } from 'protractor';
import { EC, TEST_WALLET_ALIAS, TEST_WALLET_NAME } from './app.e2e-spec';
import { Transact } from './transact.po';

describe('[Mobile] Wallet details', () => {

  let transact: Transact,
    rootEl;

  beforeAll(async () => {
    transact = new Transact();
    transact.selectTab(0);
    browser.wait(EC.visibilityOf(transact.getRootEl()));
    await transact.getRootEl().element(by.css('ion-list.wallets button[ion-item]')).click();
    rootEl = element(by.css('wallet-details-view'));
    browser.wait(EC.visibilityOf(rootEl), 3000, 'Element was not visible in 3s');
  });

  afterAll(() => {
    const backButton = rootEl.element(by.css('.back-button'));
    browser.wait(EC.elementToBeClickable(backButton), 1000);
    backButton.click();
    browser.wait(EC.not(EC.elementToBeClickable(backButton)), 1000);
    browser.wait(EC.invisibilityOf(rootEl), 2000);
  });

  it('should show wallet details view', () => {
    expect(rootEl.isDisplayed()).toBeTruthy();
    expect(browser.getCurrentUrl()).toContain('wallets/wallet');
  });

  describe('> Header', () => {
    let bigHeaderEl;

    beforeAll(() => {
      bigHeaderEl = rootEl.element(by.css('.big-header'));
      browser.wait(EC.visibilityOf(bigHeaderEl), 1000);
    });

    it('should display wallet balance', () => {
      expect(bigHeaderEl.element(by.css('.amount')).getText()).toContain('MRT');
    });

    it('should have a button to deposit Merit', () => {
      const el = bigHeaderEl.element(by.css('.action-buttons .button-cell:first-child'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('DEPOSIT');
    });

    it('should have a button to send Merit', () => {
      const el = bigHeaderEl.element(by.css('.action-buttons .button-cell:last-child'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('SEND');
    });

    it('should have a button to edit wallet preferences', () => {
      const el = rootEl.element(by.css('button[navpush=EditWalletView]'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.isEnabled()).toBeTruthy();
    });
  });


});
