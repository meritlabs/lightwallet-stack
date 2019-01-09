import { browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';

export const TEST_WALLET_MNEMONIC = 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild';
export const TEST_WALLET_ALIAS = '@ibby-demo-mac';
export const TEST_WALLET_NAME = 'Personal wallet';
export const EC: ProtractorExpectedConditions = new ProtractorExpectedConditions(browser);

export async function isBrowser(browser: string) {
  return (await protractor.browser.getCapabilities()).get('browserName').toLowerCase() == browser.toLowerCase();
}

describe('[Desktop] Onboarding', () => {
  beforeAll(() => {
    // maximize window
    browser.driver
      .manage()
      .window()
      .maximize();

    browser.get('/');

    // Disable welcome screen animation
    browser.executeScript(`localStorage.setItem('showWelcomeAnimation', false);`);
  });

  it('title should be Merit Lightwallet', () => {
    expect(browser.getTitle()).toEqual('Merit Lightwallet');
  });

  it('should take user to onboarding view', () => {
    browser.wait(EC.urlContains('onboarding'));
    expect(browser.getCurrentUrl()).toContain('onboarding');
  });

  it("shouldn't let the user go to dashboard", async () => {
    await browser.get('/dashboard');
    expect(browser.getCurrentUrl()).toContain('onboarding');
  });

  describe('Welcome screen', () => {
    let choicesRootElement, choiceElements;
    beforeAll(() => {
      choicesRootElement = element(by.css('.welcome_choices'));
      choiceElements = choicesRootElement.all(by.css('.welcome_choice'));
    });

    it('should have 4 choiceElements', async () => {
      expect((await choiceElements).length).toBe(4);
    });

    it('should have a link to onboard users coming from QT wallet', () => {
      const el = choicesRootElement.element(by.css('[routerlink=tour-desktop]'));
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('should have a link to import page', () => {
      const el = choicesRootElement.element(by.css('[routerlink=import]'));
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('should have a link to onboard users who got an invite', () => {
      const el = choicesRootElement.element(by.css('[routerlink=unlock]'));
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('should have a link to onboard beginner users', () => {
      const el = choicesRootElement.element(by.css('[routerlink=tour-beginners]'));
      expect(el.isDisplayed()).toBeTruthy();
    });
  });

  describe('> QT Wallet unboarding', () => {
    beforeEach(() => {
      browser.get('/onboarding');
      const el = element(by.css('[routerlink=tour-desktop]'));
      el.click();
    });

    it('should take user to QT wallet tour', () => {
      expect(browser.getCurrentUrl()).toContain('tour-desktop');
    });

    describe('> Back button', () => {
      let el;

      beforeEach(() => {
        el = element(by.css('[routerlink="../"]'));
      });

      it('should have a link to go back', () => {
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.isEnabled()).toBeTruthy();
      });

      it('should go back', async () => {
        el.click();
        browser.wait(EC.not(EC.urlContains('tour-desktop')));
        expect(browser.getCurrentUrl()).not.toContain('tour-desktop');
      });
    });

    describe('> Create wallet button', () => {
      let el;

      beforeEach(() => {
        el = element(by.css('[routerlink=unlock]'));
      });

      it('should have a link to create a wallet', () => {
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.isEnabled()).toBeTruthy();
      });

      it('should take the user to the unlock page', () => {
        el.click();
        browser.wait(EC.not(EC.urlContains('tour-desktop')));
        expect(browser.getCurrentUrl()).not.toContain('tour-desktop');
        expect(browser.getCurrentUrl()).toContain('unlock');
      });
    });

    describe('> Import wallet button', () => {
      let el;

      beforeEach(() => {
        el = element(by.css('[routerlink="../import"]'));
      });

      it('should have a link to import a wallet', () => {
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.isEnabled()).toBeTruthy();
      });

      it('should take the user to the import page', () => {
        el.click();
        browser.wait(EC.not(EC.urlContains('tour-desktop')));
        expect(browser.getCurrentUrl()).not.toContain('tour-desktop');
        expect(browser.getCurrentUrl()).toContain('import');
      });
    });
  });

  describe('> Unlock view', () => {
    let el;

    beforeAll(() => {
      browser.get('/onboarding');
      element(by.css('[routerlink=unlock]')).click();
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

    it('should have a link to go back to onboarding', async () => {
      const el = element(by.css('[routerLink="../"]'));
      expect(el.isPresent()).toBeTruthy();
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('back link should go back to onboarding', () => {
      const el = element(by.css('[routerLink="../"]'));
      el.click();
      browser.wait(EC.not(EC.urlContains('unlock')));
      expect(browser.getCurrentUrl()).not.toContain('unlock');
    });
  });

  describe('> Import wallet', () => {
    describe('> Main import view', () => {
      beforeAll(() => {
        browser.get('/');
        const el = element(by.css('[routerLink="import"]'));
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

      it('should have a file backup option', async () => {});
    });

    describe('> Mnemonic phrase', () => {
      let mnemonicButton, mnemonicInput, submitButton;

      beforeAll(() => {
        browser.get('/');
        const el = element(by.css('[routerLink="import"]'));
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
});
