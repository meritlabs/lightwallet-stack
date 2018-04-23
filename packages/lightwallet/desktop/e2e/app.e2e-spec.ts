import { browser, by, element, ProtractorExpectedConditions, protractor } from 'protractor';

const TEST_WALLET_MNEMONIC = 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild';
const TEST_WALLET_ALIAS = '@ibby-demo-mac';
const TEST_WALLET_NAME = 'Personal wallet';

async function isBrowser(browser: string) {
  return (await protractor.browser.getCapabilities()).get('browserName').toLowerCase() == browser.toLowerCase();
}

describe('Desktop Lightwallet App', () => {

  let EC: ProtractorExpectedConditions;

  beforeAll(() => {
    browser.get('/');
    EC = new ProtractorExpectedConditions(browser);
    browser.driver.manage().window().maximize();
  });

  it('title should be Merit Lightwallet', () => {
    expect(browser.getTitle()).toEqual('Merit Lightwallet');
  });

  it('should take user to onboarding view', () => {
    browser.wait(EC.urlContains('onboarding'));
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

      beforeAll(() => {
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
        mnemonicInput.sendKeys(TEST_WALLET_MNEMONIC);
        expect(mnemonicInput.getAttribute('class')).toContain('ng-valid');
      });

      it('should have a submit button', async () => {
        submitButton = element(by.css('button[type=submit]'));
        expect(submitButton.isEnabled()).toBeTruthy();
      });

      it('should import wallet', async () => {
        await submitButton.click();
        // wait for it to talk to MWS & get wallet info
        browser.wait(EC.urlContains('wallets'));
        expect(browser.getCurrentUrl()).toContain('wallets');
      });

    });

    // describe('File backup', () => {
    //
    // });

  });

  describe('Dashboard view', () => {

    beforeAll(() => {
      return browser.get('/dashboard');
    });

    it('should go to dashboard page', async () => {
      expect(browser.getCurrentUrl()).toContain('dashboard');
    });

    it('should have list of wallets', async () => {
      expect(element(by.css('wallets-list')).isDisplayed()).toBeTruthy();
      expect(element(by.css('wallets-list .wallets__group__wallet')).isDisplayed()).toBeTruthy();
    });

  });

  describe('Wallet details view', () => {

    let header, walletId;

    beforeAll(async () => {
      browser.get('/dashboard');
      element(by.css('wallets-list .wallets__group__wallet')).click();
      header = element(by.css('.wallet-details__header'));
      walletId = (await browser.getCurrentUrl()).replace('/history', '').split('/').pop()
    });

    it('should go to wallet details view', async () => {
      expect(EC.urlContains('wallets')).toBeTruthy();
      browser.takeScreenshot();
    });

    it('should have wallet name', async () => {
      expect(header.getText()).toContain(TEST_WALLET_NAME);
    });

    it('should have wallet alias', async () => {
      expect(header.getText()).toContain(TEST_WALLET_ALIAS);
    });

    it('should have merit balance', async () => {
      expect(header.getText()).toContain('MRT');
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
        element(by.css('app-select .selectbox > button')).click();
        element(by.css('app-select .selectbox__dropdown button:first-child')).click();
        expect(element(by.css('.wallet-details__header')).getAttribute('style')).not.toEqual(initialHeaderColor);
      });

      let hideBalanceEl;

      it('should have an option to hide balance', async () => {
        const rootEl = element(by.css('.wallet-settings__group__checkbox'));
        expect(rootEl.getText()).toContain('Hide balance');
        hideBalanceEl = element(by.css('[formControlName=balanceHidden]'));
        expect(hideBalanceEl.isPresent()).toBeTruthy();
      });

      it('should hide balance', async () => {
        await element(by.css('[formControlName=balanceHidden]')).click();
        browser.wait(EC.textToBePresentInElement(header, '[Balance hidden]'));
        expect(header.getText()).toContain('[Balance hidden]', 'Unable to hide balance');
      });

      it('should hide balance in app toolbar', () => {
        expect(element(by.css('app-toolbar .amount-merit')).getText()).not.toEqual(initialToolbarBalance, 'Toolbar balance didn\'t change');
      });

      it('should make balance visible', async() => {
        hideBalanceEl.click();
        browser.wait(EC.not(EC.textToBePresentInElement(header, '[Balance hidden]')));
        expect(header.getText()).not.toContain('[Balance hidden]', 'Unable to un-hide balance');
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
        expect(el.getText()).toContain('QR Code');
      });

      it('should have a file backup option', async () => {
        const el = element(by.css('div[routerLink=file]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.getText()).toContain('Backup File');
      });

      it('should have a mnemonic phrase option', async () => {
        const el = element(by.css('div[routerLink=mnemonic]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.getText()).toContain('Mnemonic Phrase');
      });

      describe('QR Code backup', () => {

        beforeAll(() => {
          element(by.css('div[routerLink=qr-code]')).click();
          browser.wait(EC.urlContains('qr-code'));
        });

        it('should take us to qr-code export page', () => {
          expect(browser.getCurrentUrl()).toContain('qr-code');
        });

        it('should have QR Code Backup title', () => {
          const el = element(by.css('.page-title h3'));
          expect(el.isDisplayed()).toBeTruthy('Title is not visible');
          expect(el.getText()).toContain('QR Code backup', 'Doesn\'t have the right title');
        });

        it('should have a QR code image', () => {
          expect(element(by.css('img[src^=data]')).isDisplayed()).toBeTruthy('QR Code image is not visible');
        });

        let backButton;

        it('should have a back button', () => {
          backButton = element(by.css('[routerlink="../"]'));
          expect(backButton.isDisplayed()).toBeTruthy('Back button doesn\'t exist');
        });

        it('should take us back to root export page when clicking on back button', () => {
          backButton.click();
          browser.wait(EC.not(EC.urlContains('qr-code')));
          expect(browser.getCurrentUrl()).not.toContain('qr-code');
        });

      });

      describe('Mnemonic phrase backup', () => {

        beforeAll(() => {
          element(by.css('div[routerLink=mnemonic]')).click();
          browser.wait(EC.urlContains('mnemonic'));
        });

        it('should take us to mnemonic export page', () => {
           expect(browser.getCurrentUrl()).toContain('mnemonic');
        });

        it('should have a Mnemonic Phrase title', () => {
          const el = element(by.css('.page-title h3'));
          expect(el.isDisplayed()).toBeTruthy('Title is not visible');
          expect(el.getText()).toContain('Mnemonic Phrase', 'Doesn\'t have the right title');
        });

        it('should display mnemonic phrase', () => {
          const el = element(by.css('.mnemonic-container'));
          expect(el.isDisplayed()).toBeTruthy('Mnemonic container not visible');
          expect(el.getText()).toContain(TEST_WALLET_MNEMONIC, 'Doesn\'t show mnemonic');
        });

        let backButton;

        it('should have a back button', () => {
          backButton = element(by.css('[routerlink="../"]'));
          expect(backButton.isDisplayed()).toBeTruthy('Back button doesn\'t exist');
        });

        it('should take us back to root export page when clicking on back button', () => {
          backButton.click();
          browser.wait(EC.not(EC.urlContains('mnemonic')));
          expect(browser.getCurrentUrl()).not.toContain('mnemonic');
        });

      });

      describe('Backup file export', () => {

        beforeAll(() => {
          element(by.css('div[routerLink=file]')).click();
          browser.wait(EC.urlContains('file'));
        });

        it('should take us to the backup file export page', () => {
          expect(browser.getCurrentUrl()).toContain('file');
        });

        it('should have a File backup title', () => {
          const el = element(by.css('.page-title h3'));
          expect(el.isDisplayed()).toBeTruthy('Title is not visible');
          expect(el.getText()).toContain('File backup', 'Doesn\'t have the right title');
        });

        let passwordEl, repeatPasswordEl, submitButtonEl;

        it('should have password input', () => {
          passwordEl = element(by.css('input[formControlName=password]'));
          expect(passwordEl.isDisplayed()).toBeTruthy();
        });

        it('should have a repeat password input', () => {
          repeatPasswordEl = element(by.css('input[formControlName=repeatPassword]'));
          expect(repeatPasswordEl.isDisplayed()).toBeTruthy();
        });

        it('should have a submit button', () => {
          submitButtonEl = element(by.css('button[type=submit]'));
          expect(submitButtonEl.isDisplayed()).toBeTruthy();
        });

        it('submit button should be disabled by default', () => {
          expect(submitButtonEl.isEnabled()).toBeFalsy('Download file button is not disabled when password is not valid');
        });

        it('should validate password input', async () => {
          passwordEl.sendKeys('a');
          expect(passwordEl.getAttribute('class')).toContain('ng-valid', 'Does not recognize password as valid');
          passwordEl.sendKeys(protractor.Key.BACK_SPACE);
          passwordEl.clear();
          expect(passwordEl.getAttribute('class')).toContain('ng-invalid', 'Does not mark blank password as invalid');
        });

        it('should validate repeat password field', () => {
          passwordEl.clear().sendKeys('a');
          repeatPasswordEl.sendKeys('aa');
          expect(repeatPasswordEl.getAttribute('class')).toContain('ng-invalid', 'Did not detect a mismatching password');
          repeatPasswordEl.clear().sendKeys('a');
          expect(repeatPasswordEl.getAttribute('class')).toContain('ng-valid', 'Did not detect a matching password');
        });

        it('download file button should be enabled', () => {
          expect(submitButtonEl.isEnabled()).toBeTruthy();
        });

      });

    });

  });

});
