import { Transact } from './transact.po';
import { browser, by, element } from 'protractor';
import { EC } from './app.e2e-spec';

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

    it('should confirm transaction after sliding slider', async() => {
      const sliderEl = confirmViewEl.element(by.css('slide-to-action .slider'));

      // TODO need to do conditional TouchAction if we're testing on mobile
      browser.actions()
        .click(sliderEl)
        .mouseMove(sliderEl, { x: 311, y: 10 }) // pixel 2
        .click(sliderEl)
        .perform();
    });

    it('should show an alert dialog to confirm again', () => {
      const el = element(by.css('ion-alert'));
      browser.wait(EC.visibilityOf(el));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.element(by.css('.alert-title')).getText()).toContain('Confirm Send');

      const okEl = el.element(by.css('.alert-button-group .alert-button:last-child'));
      expect(okEl.isDisplayed()).toBeTruthy();
      expect(okEl.isEnabled()).toBeTruthy();
      okEl.click();
    });

    it('should show a view to copy Global Send link', async () => {
      const el = element(by.css('view-easy-send-share'));
      browser.wait(EC.visibilityOf(el));
      expect(el.isDisplayed()).toBeTruthy('View easy send share is not visible');

      const linkEl = el.element(by.css('ion-card-content a'));
      expect(linkEl.isDisplayed()).toBeTruthy('Global send link is not displayed');
      const link = await linkEl.getText();
      console.log('GLOBAL LINK IS: ', link);

      const backButton = el.element(by.css('.action-button'));
      expect(backButton.isDisplayed()).toBeTruthy('Back button is not found');
      expect(backButton.isEnabled()).toBeTruthy('Back button is not enabled');
    });
  });

  describe('> Classic send', () => {

  });


});
