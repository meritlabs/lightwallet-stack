import { browser, by, element } from 'protractor';
import { EC } from './app.e2e-spec';
import { Transact } from './transact.po';

describe('[Mobile] Send flow', () => {
  let transact: Transact, sendViewEl;

  beforeAll(async () => {
    transact = new Transact();
    await transact.selectTab(3);
    sendViewEl = transact.getSendView();
    browser.wait(EC.visibilityOf(sendViewEl));
  });

  it('should display send view', () => {
    expect(sendViewEl.isDisplayed()).toBeTruthy();
  });

  describe('> Global send', () => {
    let globalSendButton;
    let sendAmountViewEl;
    let confirmViewEl;

    beforeAll(() => {
      globalSendButton = sendViewEl.element(by.css('.global-send-button'));
    });

    afterAll(() => {
      browser.wait(EC.invisibilityOf(element(by.css('ion-backdrop'))));

      let backButton = confirmViewEl.element(by.css('.back-button'));
      backButton.click();
      browser.wait(EC.invisibilityOf(confirmViewEl));

      browser.wait(EC.invisibilityOf(element(by.css('ion-backdrop'))));
      backButton = sendAmountViewEl.element(by.css('.back-button'));
      browser.wait(EC.elementToBeClickable(backButton));

      backButton.click();
      browser.wait(EC.invisibilityOf(sendAmountViewEl));
      browser.wait(EC.invisibilityOf(element(by.css('ion-backdrop'))));
    });

    it('should have a button to use Global Send', () => {
      expect(globalSendButton.isDisplayed()).toBeTruthy();
      expect(globalSendButton.isEnabled()).toBeTruthy();
    });

    it('button should go to send amount page', () => {
      globalSendButton.click();
      sendAmountViewEl = transact.getRootEl().element(by.css('view-send-amount'));
      browser.wait(EC.visibilityOf(sendAmountViewEl));
      expect(sendAmountViewEl.isDisplayed()).toBeTruthy();
    });

    it('should input amount to send', () => {
      const el = sendAmountViewEl.element(by.css('.big-header .main-amount input'));
      expect(el.isDisplayed()).toBeTruthy();
      el.sendKeys('0.01');
    });

    it('should go to next step after clicking button', () => {
      browser.sleep(500); // give it time to start loading
      const buttonEl = sendAmountViewEl.element(by.css('button.action-button'));
      expect(buttonEl.isPresent()).toBeTruthy('Button does not exist');
      browser.wait(EC.elementToBeClickable(buttonEl), 5000, 'Button was not clickable in 5 seconds');
      expect(buttonEl.isEnabled()).toBeTruthy('Button is not enabled');
      buttonEl.click();
    });

    it('should take us to confirm page', () => {
      confirmViewEl = transact.getRootEl().element(by.css('view-send-confirmation'));
      browser.wait(EC.visibilityOf(confirmViewEl));
      expect(confirmViewEl.isDisplayed()).toBeTruthy();
    });

    it('should have the merit amount in the header', () => {
      const el = confirmViewEl.element(by.css('.big-header'));
      expect(el.getText()).toContain('0.01 MRT');
    });
  });

  describe('> Classic send', () => {});
});
