import { browser, by, element } from 'protractor';
import { EC, TEST_WALLET_ALIAS, TEST_WALLET_MNEMONIC, TEST_WALLET_NAME } from './app.e2e-spec';

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

});
