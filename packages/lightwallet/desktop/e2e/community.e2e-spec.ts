import { browser, by, element } from 'protractor';
import { EC, TEST_WALLET_NAME } from './app.e2e-spec';

describe('[Desktop] Community', () => {
  beforeAll(() => {
    const link = element(by.css('[ng-reflect-router-link="/community"]'));
    browser.wait(EC.visibilityOf(link), 5000);
    browser.wait(EC.elementToBeClickable(link), 5000, 'Link not clickable');
    link.click();
    link.click();
    browser.wait(EC.urlContains('community'), 5000);
    browser.driver.takeScreenshot();
  });

  it('should navigate to community page', () => {
    expect(browser.getCurrentUrl()).toContain('/community');
  });

  describe('> Profile stats component', () => {
    const profileStatsEl = element(by.css('profile-stats'));

    it('should show profile stats component', () => {
      expect(profileStatsEl.isPresent()).toBeTruthy();
    });

    it('first item should be community size', () => {
      const el = profileStatsEl.element(by.css('.stats__item:nth-child(1)'));
      expect(el.getText()).toContain('Community');
      expect(el.getText()).toContain('People');
    });

    it('second item should be growth rewards', () => {
      const el = profileStatsEl.element(by.css('.stats__item:nth-child(2)'));
      expect(el.getText()).toContain('Growth');
      expect(el.getText()).toContain('MRT');
    });

    it('third item should be mining rewards', () => {
      const el = profileStatsEl.element(by.css('.stats__item:nth-child(3)'));
      expect(el.getText()).toContain('Mining');
      expect(el.getText()).toContain('MRT');
    });
  });

  describe('> Invites & Requests', () => {
    const el = element(by.css('app-invites-widget'));

    it('should have app-invites-widget component', () => {
      expect(el.isPresent()).toBeTruthy();
    });

    it('should have Invite Waitlist button', () => {
      expect(el.getText()).toContain('Invite Waitlist');
    });

    it('should have Invites button', () => {
      expect(el.getText()).toContain('Invites');
    });
  });

  describe('> Wallet cards', () => {
    const el = element(by.css('.network__personal-wallet__panel'));
    it('should have a wallet info card', () => {
      expect(el.isDisplayed()).toBeTruthy();
    });

    it('should have wallet name', () => {
      expect(el.getText()).toContain(TEST_WALLET_NAME);
    });

    const inviteCodeEl = el.element(by.css('.invite-code'));
    const copyEl = inviteCodeEl.element(by.css('.click_to_copy'));

    it('should show invite code', () => {
      expect(inviteCodeEl.isPresent()).toBeTruthy();
    });

    it('"Copy to clipboard" shouldn\'t be visible', () => {
      expect(copyEl.isDisplayed()).toBeFalsy();
    });

    it('should show "Copy to clipboard" when user hovers over invite code', async () => {
      browser
        .actions()
        .mouseMove(inviteCodeEl)
        .perform();

      expect(copyEl.isDisplayed()).toBeTruthy();
    });
  });
});
