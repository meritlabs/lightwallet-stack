import { Transact } from './transact.po';
import { browser, by, ElementFinder } from 'protractor';
import { EC, TEST_WALLET_ALIAS } from './app.e2e-spec';

describe('[Mobile] Receive', () => {
  let transact: Transact, receiveViewEl: ElementFinder, qrCodeEl: ElementFinder;

  beforeAll(async () => {
    transact = new Transact();
    receiveViewEl = transact.getReceiveView();
    await transact.selectTab(1);
    browser.wait(EC.visibilityOf(receiveViewEl));
  });

  it('should go to receive view', () => {
    expect(browser.getCurrentUrl()).toContain('receive');
    expect(receiveViewEl.isDisplayed()).toBeTruthy();
  });

  it('should display a QR code', () => {
    qrCodeEl = receiveViewEl.element(by.css('qr-code img'));
    expect(qrCodeEl.isDisplayed()).toBeTruthy();
  });

  it('should change QR code when changing requested amount', async () => {
    const initialAmount = await qrCodeEl.getAttribute('src');
    const input = receiveViewEl.element(by.css('ion-footer input[type=number]'));
    expect(input.isDisplayed());
    input.sendKeys(1);
    expect(qrCodeEl.getAttribute('src')).not.toBe(initialAmount);
  });

  it('should display wallet alias', () => {
    expect(receiveViewEl.element(by.css('ion-footer')).getText()).toContain(TEST_WALLET_ALIAS);
  });
});
