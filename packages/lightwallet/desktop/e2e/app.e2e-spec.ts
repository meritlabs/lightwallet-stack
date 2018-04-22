import { $, browser, by, element } from 'protractor';

describe('Desktop Lightwallet App', () => {

  beforeAll(() => {
    browser.get('/');
    // browser.driver.fullscreen();
  });

  it('title should be Merit Lightwallet', () => {
    expect(browser.getTitle()).toEqual('Merit Lightwallet');
  });

  it('should take user to onboarding view', () => {
    expect(browser.getCurrentUrl()).toContain('onboarding');
  });

  it('shouldn\'t let the user go to dashboard', async () => {
    await browser.get('/dashboard');
    expect(browser.getCurrentUrl()).toContain('onboarding');
  });

  it('should skip tutorial', async () => {
    const el = element(by.css('.skipTutorial'));
    expect(await el.isPresent()).toBeTruthy();
    await el.click();
    expect(browser.getCurrentUrl()).toContain('onboarding/unlock');
  });

  it('should validate invite address', async () => {
    const el = element(by.css('input[formControlName=inviteCode]'));
    expect(el.isPresent()).toEqual(true);

    await el.sendKeys('notAValidAlias');
    expect(el.getAttribute('class')).toContain('ng-invalid');

    await el.clear();
    const tooltip = element(by.css('div:not([hidden]) div:not([hidden]) .tooltip-error span'));
    expect(tooltip.isPresent()).toBeTruthy();
    expect(tooltip.getAttribute('textContent')).toContain('required');

    await el.sendKeys('demo');
    expect(el.getAttribute('class')).toContain('ng-valid');
  });

  it('should import wallet', async () => {
    const el = element(by.css('a[routerLink="../import"]'));
    expect(el.isPresent()).toBeTruthy();

    await el.click();
    expect(browser.getCurrentUrl()).toContain('import');

    const phraseImportButton = element(by.css('div[ng-reflect-router-link="phrase"]'));
    expect(phraseImportButton.isPresent()).toBeTruthy();

    await phraseImportButton.click();

    const mnemonicInput = element(by.css('textarea[formControlName=words]'));
    expect(mnemonicInput.isPresent()).toBeTruthy();
    mnemonicInput.sendKeys('turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild');
    expect(mnemonicInput.getAttribute('class')).toContain('ng-valid');

    const submitButton = element(by.css('button[type=submit]'));
    expect(submitButton.isEnabled()).toBeTruthy();

    await submitButton.click();

    // wait for it to talk to MWS & get wallet info
    browser.driver.sleep(1000);

    expect(browser.getCurrentUrl()).toContain('wallets');
  });

});
