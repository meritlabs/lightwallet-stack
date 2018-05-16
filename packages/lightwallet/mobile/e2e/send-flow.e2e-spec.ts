import { browser, by, element } from 'protractor';
import { EC, TEST_WALLET_ALIAS } from './app.e2e-spec';
import { Transact } from './transact.po';

describe('[Mobile] Send flow', () => {
  let transact: Transact,
    sendViewEl;

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
      transact.selectTab(3);
      const el = element(by.css('view-send'));
      browser.wait(EC.visibilityOf(el), 5000);
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
      el.sendKeys('0.1');
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
      expect(el.getText()).toContain('0.1 MRT');
    });

    it('should confirm transaction after sliding slider', async () => {
      const sliderEl = confirmViewEl.element(by.css('slide-to-action .slider'));
      browser.wait(EC.visibilityOf(sliderEl));
      browser.executeScript('_slideToConfirm()');
    });

    it('should show an alert dialog to confirm again', () => {
      const el = element(by.css('ion-alert'));
      browser.wait(EC.visibilityOf(el), 3000, 'Element was not visible within 3s');
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.element(by.css('.alert-title')).getText()).toContain('Confirm Send');

      const okEl = el.element(by.css('.alert-button-group .alert-button:last-child'));
      browser.wait(EC.elementToBeClickable(okEl), 5000);
      expect(okEl.isDisplayed()).toBeTruthy();
      expect(okEl.isEnabled()).toBeTruthy();
      okEl.click();
    });

    it('should show a view to copy Global Send link', async () => {
      const el = element(by.css('view-easy-send-share'));
      browser.wait(EC.visibilityOf(el), 10000);
      expect(el.isDisplayed()).toBeTruthy('View easy send share is not visible');

      const linkEl = el.element(by.css('ion-card-content a'));
      expect(linkEl.isDisplayed()).toBeTruthy('Global send link is not displayed');
      const link = await linkEl.getText();

      browser.sleep(1000);

      browser.takeScreenshot();

      const copyButton = el.element(by.css('ion-content > div.scroll-content > div > div > ion-card > ion-row > ion-col:nth-child(1) > button'));
      browser.wait(EC.visibilityOf(copyButton), 5000);
      browser.wait(EC.elementToBeClickable(copyButton), 5000, 'Button is not clickable');
      copyButton.click();

      browser.sleep(1000);
      browser.takeScreenshot();

      const backButton = el.element(by.css('.action-button'));
      browser.wait(EC.elementToBeClickable(backButton), 5000);
      expect(backButton.isDisplayed()).toBeTruthy('Back button is not found');
      expect(backButton.isEnabled()).toBeTruthy('Back button is not enabled');
      backButton.click();
    });

    it('should go to wallets page', () => {
      const el = element(by.css('view-wallets'));
      browser.wait(EC.visibilityOf(el), 5000);
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('should go to history page', () => {
      transact.selectTab(2);
      browser.wait(EC.visibilityOf(transact.getHistoryView()), 5000);
      const spinner = transact.getHistoryView().element(by.css('ion-header ion-spinner'));
      browser.wait(EC.invisibilityOf(spinner), 10000);
    });

    it('should have the GlobalSend tx listed', () => {
      const txHistory = transact.getHistoryView().element(by.css('transaction-history'));
      const firstTx = txHistory.element(by.css('button[ion-item]:first-child'));

      browser.wait(EC.visibilityOf(firstTx), 5000);
      browser.wait(EC.elementToBeClickable(firstTx), 5000);

      expect(firstTx.isDisplayed()).toBeTruthy();
      expect(firstTx.isEnabled()).toBeTruthy();

      browser.takeScreenshot();

      firstTx.click();
    });

    it('modal should show up', () => {
       const modalEl = element(by.css('ion-modal.merit-modal tx-details-view'));
       browser.wait(EC.visibilityOf(modalEl), 5000);
       browser.takeScreenshot();
       expect(modalEl.isDisplayed()).toBeTruthy();

       const cancelButtonEl = modalEl.element(by.css('button[ion-item]:nth-child(2)'));
       browser.wait(EC.visibilityOf(cancelButtonEl), 5000);
       browser.wait(EC.elementToBeClickable(cancelButtonEl), 5000);
       expect(cancelButtonEl.isDisplayed()).toBeTruthy();
       expect(cancelButtonEl.isEnabled()).toBeTruthy();
       cancelButtonEl.click();
    });

    it('cancel button should cancel', () => {
      const cancelConfirmEl = element(by.css('body > ion-app > ion-alert > div > div.alert-button-group > button:nth-child(2)'));
      browser.wait(EC.visibilityOf(cancelConfirmEl), 5000);
      browser.wait(EC.elementToBeClickable(cancelConfirmEl), 5000);
      expect(cancelConfirmEl.isEnabled()).toBeTruthy();
      browser.takeScreenshot();
      cancelConfirmEl.click();

      browser.wait(EC.invisibilityOf(cancelConfirmEl));
      const closeButtonEl = element(by.css('tx-details-view > ion-header > ion-navbar > ion-buttons > button'));
      browser.wait(EC.visibilityOf(closeButtonEl), 5000);
      browser.wait(EC.elementToBeClickable(closeButtonEl), 5000);
      closeButtonEl.click();
      browser.wait(EC.invisibilityOf(closeButtonEl), 5000);
      browser.takeScreenshot();
    });

  });

  describe('> Classic send', () => {

    let sendAmountEl;
    let confirmViewEl;


    beforeAll(() => {
      const searchBarEl = element(by.css('view-send ion-searchbar > div > input'));
      browser.wait(EC.visibilityOf(searchBarEl), 5000);
      searchBarEl.sendKeys(TEST_WALLET_ALIAS);
    });

    it('should display "Send to address" button', () => {
      const el = element(by.css('view-send > ion-content > div.scroll-content > div > div:nth-child(5) > button:nth-child(2)'));
      browser.wait(EC.visibilityOf(el), 10000);
      browser.wait(EC.elementToBeClickable(el), 10000);
      el.click();
    });

    it('should ask for amount', () => {
      sendAmountEl = element(by.css('view-send-amount'));
      browser.wait(EC.visibilityOf(sendAmountEl), 5000);
      expect(sendAmountEl.isDisplayed()).toBeTruthy();
    });

    it('should process amount', () => {
      const el = sendAmountEl.element(by.css('div.main-amount ion-input > input'));
      browser.wait(EC.visibilityOf(el));
      el.sendKeys('0.1');
    });

    it('send merit button should be enabled', () => {
      const sendButtonEl = sendAmountEl.element(by.css('.scroll-content .action-button'));
      browser.wait(EC.visibilityOf(sendButtonEl), 5000);
      expect(sendButtonEl.isDisplayed()).toBeTruthy();
      expect(sendButtonEl.isEnabled()).toBeTruthy();
      sendButtonEl.click();
    });


    it('should take us to confirm page', () => {
      confirmViewEl = transact.getRootEl().element(by.css('view-send-confirmation'));
      browser.wait(EC.visibilityOf(confirmViewEl));
      expect(confirmViewEl.isDisplayed()).toBeTruthy();
    });

    it('should have the merit amount in the header', () => {
      const el = confirmViewEl.element(by.css('.big-header'));
      expect(el.getText()).toContain('0.1 MRT');
    });

    it('should confirm transaction after sliding slider', async () => {
      const sliderEl = confirmViewEl.element(by.css('slide-to-action .slider'));
      browser.wait(EC.visibilityOf(sliderEl));
      browser.executeScript('_slideToConfirm()');
    });

    it('should show an alert dialog to confirm again', () => {
      const el = element(by.css('ion-alert'));
      browser.wait(EC.visibilityOf(el), 3000, 'Element was not visible within 3s');
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.element(by.css('.alert-title')).getText()).toContain('Confirm Send');

      const okEl = el.element(by.css('.alert-button-group .alert-button:last-child'));
      browser.wait(EC.elementToBeClickable(okEl), 5000);
      expect(okEl.isDisplayed()).toBeTruthy();
      expect(okEl.isEnabled()).toBeTruthy();
      okEl.click();
    });

    it('should go to wallets page', () => {
      const el = element(by.css('view-wallets'));
      browser.wait(EC.visibilityOf(el), 10000);
      expect(el.isDisplayed()).toBeTruthy();
    });

  });


});
