import { browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';

export const TEST_WALLET_MNEMONIC = 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild';
export const TEST_WALLET_ALIAS = '@ibby-demo-mac';
export const TEST_WALLET_NAME = 'Personal wallet';
export const EC: ProtractorExpectedConditions = new ProtractorExpectedConditions(browser);

describe('[Mobile] Onboarding', () => {
  beforeAll(() => {
    browser.get('/');
    browser.driver
      .manage()
      .window()
      .maximize();

    // Clickblock prevents us from making certain click actions, so let's get rid of it
    browser.executeScript(`document.querySelector('.click-block').remove()`);
  });

  it('title should be "Merit Wallet"', () => {
    expect(browser.getTitle()).toBe('Merit Wallet');
  });

  describe('> Main screen', () => {
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
      browser.sleep(200);
      browser.wait(EC.elementToBeClickable(backButton));
      backButton.click();
      browser.wait(EC.invisibilityOf(importView));
    });
  });

  describe('> Tour', () => {
    let nextButtonEl;

    it('get started button should go to tour page', async () => {
      const buttonEl = element(by.css('button[navpush=TourView]'));
      expect((await buttonEl.getText()).toLowerCase()).toContain('get started');
      expect(buttonEl.isDisplayed()).toBeTruthy();
      expect(buttonEl.isEnabled()).toBeTruthy();
      buttonEl.click();
      browser.wait(EC.visibilityOf(element(by.css('view-tour'))));
      browser.sleep(250);
    });

    it('should have a link to the import page', async () => {
      const buttonEl = element(by.css('view-tour ion-header button[navpush=ImportView]'));
      expect((await buttonEl.getText()).toLowerCase()).toContain('restore');
      expect(buttonEl.isDisplayed()).toBeTruthy();
      expect(buttonEl.isEnabled()).toBeTruthy();
    });

    it('should have a next button', async () => {
      nextButtonEl = element(by.css('.next-button button'));
      expect((await nextButtonEl.getText()).toLowerCase()).toContain('next');
      expect(nextButtonEl.isDisplayed()).toBeTruthy();
      expect(nextButtonEl.isEnabled()).toBeTruthy();
    });

    it('next button should switch to next slide', () => {
      const slides = element.all(by.css('ion-slides ion-slide'));
      expect(slides.get(0).getAttribute('class')).toContain('active');
      expect(slides.get(1).getAttribute('class')).not.toContain('active');
      expect(slides.get(2).getAttribute('class')).not.toContain('active');

      nextButtonEl.click();
      browser.sleep(1000);

      expect(slides.get(0).getAttribute('class')).not.toContain('active');
      expect(slides.get(1).getAttribute('class')).toContain('active');
      expect(slides.get(2).getAttribute('class')).not.toContain('active');

      nextButtonEl.click();
      browser.sleep(1000);
      expect(slides.get(0).getAttribute('class')).not.toContain('active');
      expect(slides.get(1).getAttribute('class')).not.toContain('active');
      expect(slides.get(2).getAttribute('class')).toContain('active');
    });

    it('next button should turn into done', () => {
      browser.wait(EC.textToBePresentInElement(nextButtonEl, 'DONE'));
      expect(nextButtonEl.getText()).toContain('DONE');
    });

    it('done button should take us to unlock view', () => {
      nextButtonEl.click();

      browser.wait(EC.urlContains('unlock'));
      expect(browser.getCurrentUrl()).toContain('unlock');
    });
  });

  describe('> Unlock view', () => {
    let rootEl;
    let inviteInputEl, nextButtonEl, backButtonEl, errorEl;

    beforeAll(() => {
      rootEl = element(by.css('view-unlock'));
    });

    it('should have an invite input', () => {
      inviteInputEl = rootEl.element(by.css('ion-input[placeholder="Invite Code"] input'));
      expect(inviteInputEl.isDisplayed()).toBeTruthy();
    });

    it('should have a next button', () => {
      nextButtonEl = rootEl.element(by.css('.bottom-buttons > button[ion-button]'));
      expect(nextButtonEl.isDisplayed()).toBeTruthy();
    });

    it('next button should be disabled', () => {
      expect(nextButtonEl.isEnabled()).toBeFalsy();
    });

    it('should have a back button', () => {
      backButtonEl = rootEl.element(by.css('ion-navbar button.back-button'));
      expect(backButtonEl.isDisplayed()).toBeTruthy();
      expect(backButtonEl.isEnabled()).toBeTruthy();
    });

    it('should detect an invalid invite code', () => {
      inviteInputEl.sendKeys('a');
      errorEl = rootEl.element(by.css('.bottom-buttons .error-message'));
      browser.wait(EC.visibilityOf(errorEl));
      expect(errorEl.isDisplayed()).toBeTruthy('Error is not visible');
      expect(nextButtonEl.isEnabled()).toBeFalsy('Next button is not disabled');
    });

    it('should detect a valid invite code', () => {
      it('should detect an invalid invite code', () => {
        inviteInputEl.sendKeys(protractor.Key.BACK_SPACE);
        inviteInputEl.sendKeys('demo');
        browser.wait(EC.invisibilityOf(errorEl));
        expect(errorEl.isDisplayed()).toBeFalsy('Error is not hidden');
        expect(nextButtonEl.isEnabled()).toBeTruthy('Next button is not enabled');
      });
    });

    it('back button should take us back to the tour page', () => {
      backButtonEl.click();
      browser.wait(EC.invisibilityOf(element(by.css('view-unlock'))));
      browser.wait(EC.not(EC.urlContains('unlock')));
      expect(browser.getCurrentUrl()).not.toContain('unlock');
      expect(browser.getCurrentUrl()).toContain('tour');
    });
  });

  describe('> Import view', () => {
    beforeAll(() => {
      const restoreButtonEl = element(by.css('view-tour ion-header button[navpush=ImportView]'));
      restoreButtonEl.click();
      browser.wait(EC.urlContains('import'));
    });

    describe('> File import', () => {
      it('should have a file import tab', () => {
        const el = element(by.css('ion-segment-button[value=file]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.isEnabled()).toBeTruthy();
        expect(el.getText()).toBe('FILE');
        el.click();
      });

      it('should show the file tab when clicking on segment button', () => {
        expect(element(by.css('view-import .file')).isDisplayed()).toBeTruthy();
      });
    });

    describe('> Phrase import', () => {
      let rootEl, mnemonicEl, importButtonEl;

      beforeAll(() => {
        rootEl = element(by.css('view-import .phrase'));
      });

      it('should have a phrase import tab', () => {
        const el = element(by.css('ion-segment-button[value=phrase]'));
        expect(el.isDisplayed()).toBeTruthy();
        expect(el.isEnabled()).toBeTruthy();
        expect(el.getText()).toBe('PHRASE');
        el.click();
      });

      it('should show phrase import tab when clicking on segment button', () => {
        expect(rootEl.isDisplayed()).toBeTruthy();
      });

      it('should have an import button', () => {
        importButtonEl = rootEl.element(by.css('button.action-button'));
        expect(importButtonEl.isDisplayed()).toBeTruthy();
      });

      it('should have a mnemonic textarea', () => {
        mnemonicEl = rootEl.element(by.css('.mnemonic-input textarea'));
        expect(mnemonicEl.isDisplayed()).toBeTruthy();
      });

      it('should detect invalid mnemonic', () => {
        mnemonicEl.sendKeys('a');
        expect(importButtonEl.isEnabled()).toBeFalsy();
      });

      it('should detect valid mnemonic', () => {
        mnemonicEl.sendKeys(protractor.Key.BACK_SPACE);
        mnemonicEl.sendKeys(TEST_WALLET_MNEMONIC);
        expect(importButtonEl.isEnabled()).toBeTruthy();
      });

      it('should import wallet', () => {
        importButtonEl.click();
        browser.wait(EC.urlContains('transact'));
        expect(browser.getCurrentUrl()).toContain('transact');
        expect(rootEl.isPresent()).toBeFalsy();
      });
    });
  });
});
