import { $, browser, by, element, ProtractorExpectedConditions } from 'protractor';

describe('Desktop Lightwallet App', () => {

  let EC: ProtractorExpectedConditions;

  beforeAll(() => {
    browser.get('/');
    EC = new ProtractorExpectedConditions(browser);
    // browser.driver.fullscreen();
  });

  it('title should be Merit Lightwallet', () => {

    expect(browser.getTitle()).toEqual('Merit Lightwallet');
  });

  it('should take user to onboarding view', () => {
    expect(EC.urlContains('onboarding')).toBeTruthy();
    expect(browser.getCurrentUrl()).toContain('onboarding');
  });

  it('shouldn\'t let the user go to dashboard', async () => {
    await browser.get('/dashboard');
    expect(browser.getCurrentUrl()).toContain('onboarding');
  });

  describe('Tutorial', () => {
    let el;

    beforeAll(() => {
      el = element(by.css('.skipTutorial'));
    });

    it('should skip tutorial', async () => {
      expect(await el.isPresent()).toBeTruthy();
    });

    it('should go to unlock view', async () => {
      await el.click();
      expect(browser.getCurrentUrl()).toContain('onboarding/unlock');
    });

    it('should have a link to the import page', async () => {
      const el = element(by.css('a[routerLink="../import"]'));
      expect(el.isPresent()).toBeTruthy();
      expect(el.isDisplayed()).toBeTruthy();
    });
  });

  describe('Unlock View', () => {
    let el;

    beforeAll(() => {
      el = element(by.css('input[formControlName=inviteCode]'));
    });

    it('invite address field should be visible', () => {
      expect(el.isPresent()).toBeTruthy();
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('should detect an invalid alias', async () => {
      await el.sendKeys('notAValidAlias');
      expect(el.getAttribute('class')).toContain('ng-invalid');
    });

    it('should display an error if the alias field is dirty && invalid', async () => {
      await el.clear();
      const tooltip = element(by.css('div:not([hidden]) div:not([hidden]) .tooltip-error span'));
      expect(tooltip.isPresent()).toBeTruthy();
      expect(tooltip.getAttribute('textContent')).toContain('required');
    });

    it('should detect a valid invite address', async () => {
      await el.sendKeys('demo');
      expect(el.getAttribute('class')).toContain('ng-valid');
    });

    it('should have a link to import page', async () => {
      const el = element(by.css('a[routerLink="../import"]'));
      expect(el.isPresent()).toBeTruthy();
      expect(el.isDisplayed()).toBeTruthy();
    });

  });


  describe('Import wallet', () => {

    describe('Main import view', () => {
      beforeEach(() => {
        browser.get('/');
        const el = element(by.css('a[routerLink="import"]'));
        el.click();
      });

      it('we should be in import page', () => {
        expect(browser.getCurrentUrl()).toContain('import');
      });

      it('should have mnemonic option', async () => {
        const mnemonicButton = element(by.css('.mnemonic-import-button'));
        expect(mnemonicButton.isPresent()).toBeTruthy();
        expect(mnemonicButton.isDisplayed()).toBeTruthy();
      });

      it('should have a file backup option', async () => {

      });
    });

    describe('Mnemonic phrase', () => {

      let mnemonicButton, mnemonicInput, submitButton;

      beforeAll(() => {
        browser.get('/');
        const el = element(by.css('a[routerLink="import"]'));
        el.click();
        mnemonicButton = element(by.css('.mnemonic-import-button'));
      });

      it('should go to mnemonic phrase import view', async () => {
        await mnemonicButton.click();
        expect(EC.urlContains('phrase'));
        mnemonicInput = element(by.css('textarea[formControlName=words]'));
        expect(mnemonicInput.isDisplayed()).toBeTruthy();
      });

      it('should validate mnemonic input', async () => {
        mnemonicInput.sendKeys('turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild');
        expect(mnemonicInput.getAttribute('class')).toContain('ng-valid');
      });

      it('should have a submit button', async () => {
        submitButton = element(by.css('button[type=submit]'));
        expect(submitButton.isEnabled()).toBeTruthy();
      });

      it('should import wallet', async () => {
        await submitButton.click();
        // wait for it to talk to MWS & get wallet info
        browser.driver.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('wallets');
      });

    });

    // describe('File backup', () => {
    //
    // });

  });

});
