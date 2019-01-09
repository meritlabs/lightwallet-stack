import { Transact } from './transact.po';
import { browser, by, ElementFinder } from 'protractor';
import { EC } from './app.e2e-spec';

describe('[Mobile] Community', () => {
  let transact: Transact, communityViewEl: ElementFinder, headerEl: ElementFinder;

  beforeAll(async () => {
    transact = new Transact();
    communityViewEl = transact.getCommunityView();
    await transact.selectTab(4);
    browser.wait(EC.visibilityOf(communityViewEl));
    headerEl = communityViewEl.element(by.css('ion-header'));
  });

  it('should have community size', () => {
    expect(headerEl.getText()).toContain('Community');
    expect(headerEl.getText()).toContain('People');
  });

  it('should have Mining rewards', () => {
    expect(headerEl.getText()).toContain('Mining');
  });

  it('should have Growth rewards', () => {
    expect(headerEl.getText()).toContain('Growth');
  });

  describe('> Invites', () => {
    let el;

    beforeAll(() => {
      el = communityViewEl.element(by.css('button[navpush=SendInviteView]'));
    });

    it('should have a button to go to invites view', () => {
      expect(el.isDisplayed()).toBeTruthy();
    });
  });

  describe('> Invite requests', () => {
    let el;

    beforeAll(() => {
      el = communityViewEl.element(by.css('button[navpush=UnlockRequestsView]'));
    });

    it('should have a button to go to invite requests view', () => {
      expect(el.isDisplayed()).toBeTruthy();
    });
  });
});
