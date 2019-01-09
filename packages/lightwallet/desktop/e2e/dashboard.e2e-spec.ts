import { browser, by, element } from 'protractor';
import { TEST_WALLET_MNEMONIC, EC } from './app.e2e-spec';

describe('[Desktop] Dashboard view', () => {
  beforeAll(() => {
    const link = element(by.css('[ng-reflect-router-link="/dashboard"]'));
    browser.wait(EC.visibilityOf(link), 5000);
    link.click();
  });

  it('should go to dashboard page', async () => {
    expect(browser.getCurrentUrl()).toContain('dashboard');
  });

  it('should have list of wallets', async () => {
    expect(element(by.css('wallets-list')).isDisplayed()).toBeTruthy();
    expect(element(by.css('wallets-list .wallets__group__wallet')).isDisplayed()).toBeTruthy();
  });

  describe('> Welcome guide', () => {
    let rootEl;

    beforeEach(() => {
      rootEl = element(by.css('app-welcome-guide'));
    });

    it('should show a welcome guide', () => {
      expect(rootEl.isPresent()).toBeTruthy();
      expect(rootEl.isDisplayed()).toBeTruthy();
    });

    it('should have a "Show recovery phrase button"', () => {
      const el = rootEl.element(by.css('.mnemonic > .mnemonic_button > button'));
      expect(el.isDisplayed()).toBeTruthy('Button is not displayed');
      expect(el.isEnabled()).toBeTruthy('Button is not enabled');
    });

    it('should show mnemonic phrase when clicking on show phrase button', () => {
      const el = rootEl.element(by.css('.mnemonic > .mnemonic_button > button'));
      el.click();
      browser.wait(EC.visibilityOf(rootEl.element(by.css('.mnemonic .box'))));
      const mnemonicEl = rootEl.element(by.css('.mnemonic .box'));
      expect(mnemonicEl.isDisplayed()).toBeTruthy();
      expect(mnemonicEl.getText()).toContain(TEST_WALLET_MNEMONIC);
    });

    it('should have a hide mnemonic button', () => {
      const el = rootEl.element(by.css('.mnemonic > .mnemonic_button > button'));
      expect(el.isDisplayed()).toBeTruthy('Button is not displayed');
      expect(el.isEnabled()).toBeTruthy('Button is not enabled');
    });

    it('should hide mnemonic when pressing hide button', () => {
      const el = rootEl.element(by.css('.mnemonic > .mnemonic_button > button'));
      el.click();
      browser.sleep(200);
      expect(rootEl.element(by.css('.mnemonic .box')).isDisplayed()).toBeFalsy();
    });

    it('should have a button to hide the guide', () => {
      const el = rootEl.element(by.css('.nav button'));
      expect(el.isDisplayed()).toBeTruthy('Button is not displayed');
      expect(el.isEnabled()).toBeTruthy('Button is not enabled');
      el.click();
      browser.sleep(200);
      expect(rootEl.isPresent()).toBeFalsy('Guide is still visible');
    });
  });
});
