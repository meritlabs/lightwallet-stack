import { browser, by, element } from 'protractor';
import { EC, TEST_WALLET_ALIAS } from './app.e2e-spec';

describe('[Desktop] Sending Merit', () => {
  beforeAll(() => {
    const link = element(by.css('[ng-reflect-router-link="/send"]'));
    browser.wait(EC.visibilityOf(link), 5000);
    link.click();
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
    const amountInputEl = element(by.css('[formcontrolname=amountMrt]')),
      selectBoxEl = element(by.css('.ui-input.ui-input--select.ui-input--form.selectbox__selected')),
      selectMethodEl = element(by.css('.select-method')),
      classicSendChoiceEl = selectMethodEl.element(by.css('.method:first-child')),
      globalSendChoiceEl = selectMethodEl.element(by.css('.method:last-child')),
      sendButtonEl = element(by.css('button[type=submit]')),
      addressInputEl = element(by.css('[formcontrolname=address]')),
      receiptEl = element(by.css('.sendMerit__totals')),
      receiptLoadingEl = receiptEl.element(by.css('loading-spinner-small')),
      sendingSpinnerEl = element(by.css('loading-spinner[sending-spinner]')),
      successEl = element(by.css('message-box[success]'));

    const sendAmount = '0.005';

    it('should have an amount input', () => {
      expect(amountInputEl.isDisplayed()).toBeTruthy();
    });

    it('should have an select wallet drop down', () => {
      expect(selectBoxEl.isDisplayed()).toBeTruthy();
    });

    it('should have an sending method choice box', () => {
      expect(selectMethodEl.isDisplayed()).toBeTruthy();
    });

    it('should have an classic send activated by default', () => {
      expect(classicSendChoiceEl.getAttribute('class')).toContain('active');
    });

    it('should have a recipient address input', async () => {
      expect(addressInputEl.isDisplayed()).toBeTruthy();
    });

    it('should activate sending button after alias input', async () => {
      expect(sendButtonEl.isDisplayed()).toBeTruthy();
    });

    it('should have ability switch to Global Send Method', async () => {
      expect(globalSendChoiceEl.isDisplayed()).toBeTruthy();
      globalSendChoiceEl.click();
    });

    it('should activate Global Send Method after choice selection', async () => {
      expect(globalSendChoiceEl.getAttribute('class')).toContain('active');
    });

    it('should have an password input if Global Send Method selected', async () => {
      expect(element(by.css('[formcontrolname=password]')).isDisplayed()).toBeTruthy();
    });

    describe('> Classic Send', () => {
      beforeAll(() => {
        classicSendChoiceEl.click();
        addressInputEl.sendKeys(TEST_WALLET_ALIAS);
        amountInputEl.sendKeys(sendAmount);
        browser.takeScreenshot();
        browser.wait(EC.invisibilityOf(receiptLoadingEl));
        browser.takeScreenshot();
      });

      afterAll(() => {
        browser.takeScreenshot();
        browser.sleep(2000);
      });

      describe('> Receipt', () => {
        it('should display recipient address', () => {
          const el = receiptEl.element(by.css('div:nth-child(2) > div:nth-child(2)'));
          expect(el.getText()).toContain(TEST_WALLET_ALIAS);
        });

        it('should display transaction amount', () => {
          const el = receiptEl.element(by.css('div:nth-child(3) > div:nth-child(2)'));
          expect(el.getText()).toContain(sendAmount + ' MRT');
        });

        it('should display transaction fee', () => {
          const el = receiptEl.element(by.css('div:nth-child(4) > div:nth-child(2)'));
          expect(el.getText()).not.toContain('0 MRT');
        });
      });

      it('submit button should be enabled', () => {
        expect(sendButtonEl.isEnabled()).toBeTruthy();
      });

      it('should send transaction', () => {
        sendButtonEl.click();
        browser.wait(EC.visibilityOf(successEl), 8000, 'Success box did not show up');
        expect(successEl.isDisplayed()).toBeTruthy();
      });
    });

    describe('> Global Send', () => {
      beforeAll(() => {
        globalSendChoiceEl.click();
        amountInputEl.sendKeys(sendAmount);
        browser.takeScreenshot();
        browser.wait(EC.invisibilityOf(receiptLoadingEl));
        browser.takeScreenshot();
      });

      afterAll(() => {
        browser.takeScreenshot();
      });

      describe('> Receipt', () => {
        it('should display GlobalSend instead of recipient name', () => {
          const el = receiptEl.element(by.css('div:nth-child(2) > div:nth-child(2)'));
          expect(el.getText()).toContain('GlobalSend');
        });
      });

      it('submit button should be enabled', () => {
        expect(sendButtonEl.isEnabled()).toBeTruthy();
      });

      it('should send transaction', () => {
        sendButtonEl.click();
        browser.wait(EC.visibilityOf(successEl), 8000, 'Success box did not show up');
        expect(successEl.isDisplayed()).toBeTruthy();
      });

      it('should display GlobalSend link', () => {
        const el = successEl.element(by.css('.easysend-url-container'));
        expect(el.getText()).toContain('http');
        browser.takeScreenshot();
      });

      describe('> Cancel GlobalSend', () => {
        const cancelGlobalSendButtonEl = element(by.css('history-list')).element(by.buttonText('Cancel'));
        const confirmDialogEl = element(by.css('confirm-dialog'));
        const refreshButton = element(by.css('button.refresh-button'));
        const historyLoaderEl = element(by.css('history-list loading-spinner-small'));

        beforeAll(() => {
          const link = element(by.css('[ng-reflect-router-link="/history"]'));
          link.click();
          refreshButton.click();

          browser.wait(EC.visibilityOf(cancelGlobalSendButtonEl));
        });

        it('should prompt the user to confirm cancellation', () => {
          cancelGlobalSendButtonEl.click();
          browser.wait(EC.visibilityOf(confirmDialogEl));
          expect(confirmDialogEl.isPresent()).toBeTruthy();
        });

        it('should cancel GlobalSend', () => {
          const buttonEl = confirmDialogEl.element(by.css('button.primary'));
          expect(buttonEl.isDisplayed()).toBeTruthy('Cancel button not displayed');
          expect(buttonEl.isEnabled()).toBeTruthy('Cancel button not enabled');

          buttonEl.click();
          browser.wait(EC.invisibilityOf(confirmDialogEl));
        });

        it('should hide cancel button', () => {
          refreshButton.click();
          browser.wait(EC.invisibilityOf(cancelGlobalSendButtonEl), 10000);
          expect(cancelGlobalSendButtonEl.isPresent()).toBeFalsy();
        });
      });
    });
  });
});
