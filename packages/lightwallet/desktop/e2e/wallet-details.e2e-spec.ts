import { browser, by, element, protractor } from 'protractor';
import { EC, TEST_WALLET_ALIAS, TEST_WALLET_MNEMONIC, TEST_WALLET_NAME } from './app.e2e-spec';

describe('[Desktop] Wallet details view', () => {
  let header, walletId;

  beforeAll(async () => {
    const link = element(by.css('[ng-reflect-router-link="/dashboard"]'));
    browser.wait(EC.visibilityOf(link), 5000, "Dashboard menu link isn't visible");
    link.click();
    browser.wait(EC.urlContains('dashboard'), 5000, "URL doesn't contain dashboard");
    const el = element(by.css('wallets-list .wallets__group__wallet'));
    browser.wait(EC.visibilityOf(el), 8000, 'Wallet list item is not visible');
    await el.click();
    browser.wait(EC.urlContains('wallets'), 5000, "URL doesn't contain wallets");
    header = element(by.css('.wallet-details__header'));
    browser.wait(EC.visibilityOf(header), 5000);
    walletId = (await browser.getCurrentUrl())
      .replace('/history', '')
      .split('/')
      .pop();
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

  describe('> History tab', () => {
    it('url should have /history', () => {
      expect(EC.urlContains('/history')).toBeTruthy();
    });

    // TODO restore this when implementing new virtual scroll
    // it('should have wallet unlocked transaction', async () => {
    //   expect(await element(by.css('history-item:last-child')).getText()).toContain('Wallet Unlocked');
    // });
  });

  describe('> Preferences tab', () => {
    let header, initialHeaderColor: string, initialToolbarBalance: string;

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

    it("header color should change when we change the wallet's color", () => {
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
      expect(element(by.css('app-toolbar .amount-merit')).getText()).not.toEqual(
        initialToolbarBalance,
        "Toolbar balance didn't change",
      );
    });

    it('should make balance visible', async () => {
      hideBalanceEl.click();
      browser.wait(EC.not(EC.textToBePresentInElement(header, '[Balance hidden]')));
      expect(header.getText()).not.toContain('[Balance hidden]', 'Unable to un-hide balance');
    });
  });

  describe('> Backup tab', () => {
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

    describe('> QR Code backup', () => {
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
        expect(el.getText()).toContain('QR Code backup', "Doesn't have the right title");
      });

      it('should have a QR code image', () => {
        expect(element(by.css('img[src^=data]')).isDisplayed()).toBeTruthy('QR Code image is not visible');
      });

      let backButton;

      it('should have a back button', () => {
        backButton = element(by.css('[routerlink="../"]'));
        expect(backButton.isDisplayed()).toBeTruthy("Back button doesn't exist");
      });

      it('should take us back to root export page when clicking on back button', () => {
        backButton.click();
        browser.wait(EC.not(EC.urlContains('qr-code')));
        expect(browser.getCurrentUrl()).not.toContain('qr-code');
      });
    });

    describe('> Mnemonic phrase backup', () => {
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
        expect(el.getText()).toContain('Mnemonic Phrase', "Doesn't have the right title");
      });

      it('should display mnemonic phrase', () => {
        const el = element(by.css('.mnemonic-container'));
        expect(el.isDisplayed()).toBeTruthy('Mnemonic container not visible');
        expect(el.getText()).toContain(TEST_WALLET_MNEMONIC, "Doesn't show mnemonic");
      });

      let backButton;

      it('should have a back button', () => {
        backButton = element(by.css('[routerlink="../"]'));
        expect(backButton.isDisplayed()).toBeTruthy("Back button doesn't exist");
      });

      it('should take us back to root export page when clicking on back button', () => {
        backButton.click();
        browser.wait(EC.not(EC.urlContains('mnemonic')));
        expect(browser.getCurrentUrl()).not.toContain('mnemonic');
      });
    });

    describe('> Backup file export', () => {
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
        expect(el.getText()).toContain('File backup', "Doesn't have the right title");
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
