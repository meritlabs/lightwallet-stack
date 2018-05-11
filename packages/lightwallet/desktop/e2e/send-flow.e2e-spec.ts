import { browser, by, element } from 'protractor';
import { TEST_WALLET_ALIAS } from './app.e2e-spec';

describe('[Desktop] Sending Merit', () => {

  beforeAll(() => {
    browser.get('/send');
    browser.takeScreenshot();
  });

  afterAll(() => {
    browser.takeScreenshot();
  });

  it('should take user to the send page', () => {
    expect(browser.getCurrentUrl()).toContain('/send');
  });

  describe('> Tour', () => {
    it('should show tour', () => {
      expect(element(by.css('.sendingTour')).isDisplayed()).toBeTruthy();
    });

    it('should have a next button', () => {
      const nextButtonEl = element(by.css('.next_slide'));
      expect(nextButtonEl.isDisplayed()).toBeTruthy('Button not displayed');
      expect(nextButtonEl.isEnabled()).toBeTruthy('Button not enabled');
    });

    it('first pager circle should be active', () => {
      expect(element(by.css('.tour_steps li:first-child')).getAttribute('class')).toContain('active');
    });

    it('should navigate to second slide', () => {
      element(by.css('.next_slide')).click();
    });

    it('second pager circle should be active', () => {
      expect(element(by.css('.tour_steps li:nth-child(2)')).getAttribute('class')).toContain('active');
    });

    it('should navigate to third slide', () => {
      element(by.css('.next_slide')).click();
    });

    it('third pager circle should be active', () => {
      expect(element(by.css('.tour_steps li:nth-child(3)')).getAttribute('class')).toContain('active');
    });

    it('clicking on last pager circle should take navigate to last slide', () => {
      element(by.css('.tour_steps li:last-child')).click();
    });

    it('fourth pager circle should be active', () => {
      expect(element(by.css('.tour_steps li:nth-child(4)')).getAttribute('class')).toContain('active');
    });

    it('should have a "Get Started" button', () => {
      const el = element(by.css('.next_slide'));
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('Get Started');
    });

    it('clicking on first pager circle should navigate back to first slide', () => {
      const el = element(by.css('.tour_steps li:first-child'));
      el.click();
      expect(el.getAttribute('class')).toContain('active');
    });

    const skipButtonEl = element(by.css('.skip_intro'));

    it('should have a skip intro button', () => {
      expect(skipButtonEl.isDisplayed()).toBeTruthy('Button not displayed');
      expect(skipButtonEl.isEnabled()).toBeTruthy('Button not enabled');
      expect(skipButtonEl.getText()).toContain('Skip Intro', 'Doesn\'t contain "Skip Intro"');
    });

    it('skip button should skip intro', () => {
      skipButtonEl.click();
      expect(element(by.css('.sendingTour')).isPresent()).toBeFalsy();
    });
  });


  describe('> Sending', () => {

    const InAmountMrt = element(by.css('[formcontrolname=amountMrt]')),
      selectBox = element(by.css('.ui-input.ui-input--select.ui-input--form.selectbox__selected')),
      selectMethod = element(by.css('.select-method')),
      classicSendChoice = selectMethod.element(by.css('.method:first-child')),
      globalSendChoice = selectMethod.element(by.css('.method:last-child')),
      sendButton = element(by.css('button[type=submit]'));

    it('should have an amount input', () => {
      expect(InAmountMrt.isDisplayed()).toBeTruthy();
      InAmountMrt.sendKeys(1);
    });

    it('should have an select wallet drop down', () => {
      expect(selectBox.isDisplayed()).toBeTruthy();
    });

    it('should have an sending method choice box', () => {
      expect(element(by.css('.select-method')).isDisplayed()).toBeTruthy();
    });

    it('should have an classic send activated by default', () => {
      expect(classicSendChoice.getAttribute('class')).toContain('active');
    });

    it('should have a recipient address input', async () => {
      const el = element(by.css('[formcontrolname=address]'));
      expect(el.isDisplayed()).toBeTruthy();
      el.sendKeys(TEST_WALLET_ALIAS);
    });

    it('should activate sending button after alias input', async () => {
      expect(sendButton.isDisplayed()).toBeTruthy();
    });

    it('should have ability switch to Global Send Method', async () => {
      expect(globalSendChoice.isDisplayed()).toBeTruthy();
      globalSendChoice.click();
    });

    it('should activate Global Send Method after choice selection', async () => {
      expect(globalSendChoice.getAttribute('class')).toContain('active');
    });

    it('should have an password input if Global Send Method selected', async () => {
      expect(element(by.css('[formcontrolname=password]')).isDisplayed()).toBeTruthy();
    });

  });

  describe('> Classic Send', () => {

  });

  describe('> Global Send', () => {

  });

});
