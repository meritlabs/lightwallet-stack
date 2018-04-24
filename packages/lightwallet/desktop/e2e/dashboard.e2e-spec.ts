import { browser, by, element } from 'protractor';

describe('[Desktop] Dashboard view', () => {

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
