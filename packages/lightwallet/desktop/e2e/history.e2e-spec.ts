import { browser, by, element } from 'protractor';
import { EC } from './app.e2e-spec';

describe('[Desktop] History', () => {
  beforeAll(() => {
    const link = element(by.css('[ng-reflect-router-link="/history"]'));
    browser.wait(EC.visibilityOf(link), 5000);
    link.click();
    browser.wait(EC.urlContains('history'), 5000);
    browser.wait(EC.invisibilityOf(element(by.css('merit-lw > .app-loader'))), 5000);
    browser.wait(EC.visibilityOf(element(by.css('history-list'))), 5000);
  });

  afterAll(() => {
    browser.driver.takeScreenshot();
  });

  it('should navigate to history page', () => {
    expect(browser.getCurrentUrl()).toContain('/history');
  });

  it('should have a list of history items', () => {
    expect(element(by.css('history-list history-item')).isDisplayed()).toBeTruthy();
  });
});
