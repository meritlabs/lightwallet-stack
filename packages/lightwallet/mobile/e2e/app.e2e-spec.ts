import { browser, by, element, ProtractorExpectedConditions } from 'protractor';

export const TEST_WALLET_MNEMONIC = 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild';
export const TEST_WALLET_ALIAS = '@ibby-demo-mac';
export const TEST_WALLET_NAME = 'Personal wallet';
export const EC: ProtractorExpectedConditions = new ProtractorExpectedConditions(browser);


describe('[Mobile] Onboarding', () => {

  beforeAll(() => {
    browser.get('/');
    browser.driver.manage().window().maximize();

    // Clickblock prevents us from making certain click actions, so let's get rid of it
    browser.executeScript(`document.querySelector('.click-block').remove()`)
  });

  it('title should be "Merit Wallet"', () => {
    expect(browser.getTitle()).toBe('Merit Wallet');
  });

  describe('Onboarding', () => {
    it('should take us to onboarding page', () => {
      expect(browser.getCurrentUrl()).toContain('onboarding');
    });

    it('should say "Welcome to Merit"', () => {
      const el = element(by.css('h1.main-header'));
      expect(el).toBeDefined();
      expect(el.isDisplayed()).toBeTruthy();
      expect(el.getText()).toContain('Welcome to Merit');
    });

    it('should have a "Get started" button', async () => {
      const el = element(by.buttonText('Get started'));
      expect(el).toBeDefined('Button does not exist');
      expect(el.isDisplayed()).toBeTruthy('Button is not displayed');
      expect((await el.getText()).toLowerCase()).toBe('get started');
      expect(el.getAttribute('navpush')).toBe('TourView', 'Does not have a navPush');
    });

    it('should have a "Restore" button', async () => {
      const el = element(by.buttonText('Restore'));
      expect(el).toBeDefined('Button does not exist');
      expect(el.isDisplayed()).toBeTruthy('Button is not displayed');
      expect((await el.getText()).toLowerCase()).toBe('restore');
      expect(el.getAttribute('navpush')).toBe('ImportView', 'Does not have a navPush');
    });

    it('restore button should open ImportView', () => {
      const el = element(by.buttonText('Restore'));
      el.click();
      const importView = element(by.css('view-import'));
      expect(importView).toBeDefined('Import view is not defined');
      expect(importView.isDisplayed()).toBeTruthy('Import view is not displayed');

      const backButton = importView.element(by.css('button.back-button'));
      expect(backButton.isDisplayed()).toBeTruthy('There is no back button');
      browser.sleep(500);
      browser.wait(EC.elementToBeClickable(backButton));
      backButton.click();
      browser.wait(EC.invisibilityOf(importView));
    });
  });

});
