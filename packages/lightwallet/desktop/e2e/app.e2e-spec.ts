import { browser, by, element, ProtractorExpectedConditions } from 'protractor';

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

  describe('Unlock view', () => {

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

  describe('Dashboard view', () => {

    beforeAll(() => {
      return browser.get('/dashboards');
    });

    it('should go to dashboards page', async () => {
      expect(EC.urlContains('dashboard')).toBeTruthy();
    });

    it('should have list of wallets', async () => {
      expect(element(by.css('wallets-list')).isDisplayed()).toBeTruthy();
      expect(element(by.css('wallets-list .wallets__group__wallet')).isDisplayed()).toBeTruthy();
    });

  });

  describe('Wallet details view', () => {

    let header, walletId;

    beforeAll(async () => {
      browser.get('/dashboards');
      element(by.css('wallets-list .wallets__group__wallet')).click();
      header = element(by.css('.wallet-details__header'));
      walletId = (await browser.getCurrentUrl()).replace('/history', '').split('/').pop()
    });

    it('should go to wallet details view', async () => {
      expect(EC.urlContains('wallets')).toBeTruthy();
      browser.takeScreenshot();
    });

    it('should have wallet name', async () => {
      expect((await header.getText()).toLowerCase()).toContain('personal wallet');
    });

    it('should have wallet alias', async () => {
      expect((await header.getText()).toLowerCase()).toContain('@');
    });

    it('should have merit balance', async () => {
      expect(await header.getText()).toContain('MRT');
    });

    it('should have invites', async () => {
      expect((await header.getText()).toLowerCase()).toContain('available invites');
    });

    it('should have wallet history tab', () => {
      expect(element(by.css('a[href*="history"]')).isDisplayed()).toBeTruthy();
    });

    it('should have wallet preferences tab', () => {
      expect(element(by.css('a[href*="settings"]')).isDisplayed()).toBeTruthy();
    });

    it('should have export wallet tab', () => {
      expect(element(by.css('a[href*="export"]')).isDisplayed()).toBeTruthy();
    });

    describe('History tab', () => {

      it('url should have /history', () => {
        expect(EC.urlContains('/history')).toBeTruthy();
      });

      it('should have wallet unlocked transaction', async () => {
        expect(await element(by.css('history-item:last-child')).getText()).toContain('Wallet Unlocked');
      });

    });

    describe('Preferences tab', () => {

      let header,
        initialHeaderColor: string,
        initialToolbarBalance: string;

      beforeAll(async () => {
        element(by.css('a[href*="settings"]')).click();
        header = element(by.css('.wallet-details__header'));
        initialHeaderColor = await header.getAttribute('style');
        initialToolbarBalance = await element(by.css('app-toolbar .amount-merit')).getText();
      });

      it('should change url to /preferences', () => {
        expect(EC.urlContains('/preferences')).toBeTruthy();
      });

      it('should have the ability to change the wallet name', () => {
        expect(element(by.css('input[formControlName=name]')).isDisplayed()).toBeTruthy();
      });

      it('should have an option to change color', async () => {
        expect(await element(by.css('app-select')).getText()).toContain('Merit blue');
      });

      it('header color should change when we change the wallet\'s color', () => {
        element(by.css('app-select')).click();
        element(by.css('app-select .selectbox__dropdown button:first-child')).click();
        expect(element(by.css('.wallet-details__header')).getAttribute('style')).not.toEqual(initialHeaderColor);
      });

      let hideBalanceEl;

      it('should have an option to hide balance', async () => {
        const rootEl = element(by.css('.wallet-settings__group__checkbox'));
        expect(await rootEl.getText()).toContain('Hide balance');
        hideBalanceEl = rootEl.element(by.css('[formControlName=balanceHidden]'));
      });

      it('should hide balance', async () => {
        hideBalanceEl.click();
        browser.sleep(500);
        expect(await header.getText()).toContain('[Balance hidden]', 'Unable to hide balance');
      });

      it('should hide balance in app toolbar', () => {
        expect(element(by.css('app-toolbar .amount-merit')).getText()).not.toEqual(initialToolbarBalance, 'Toolbar balance didn\'t change');
      });

      it('should make balance visible', async() => {
        hideBalanceEl.click();
        browser.sleep(500);
        expect(await header.getText()).not.toContain('[Balance hidden]', 'Unable to un-hide balance');
      });

    });

    describe('Backup tab', () => {

      beforeAll(async () => {
        element(by.css('a[href*="export"]')).click();
      });

      it('should change url to /export', () => {
        expect(EC.urlContains('/export')).toBeTruthy();
      });

      it('should have a qr code option', async () => {
        const el = element(by.css('div[routerLink=qr-code]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(await el.getText()).toContain('QR Code');
        expect(EC.textToBePresentInElement(el, 'QR Code')).toBeTruthy();
      });

      it('should have a file backup option', async () => {
        const el = element(by.css('div[routerLink=file]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(await el.getText()).toContain('Backup File');
      });

      it('should have a mnemonic phrase option', async () => {
        const el = element(by.css('div[routerLink=mnemonic]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(await el.getText()).toContain('Mnemonic Phrase');
      });

    });

  });

});
