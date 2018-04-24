import { browser, by, element } from 'protractor';

describe('[Desktop] History', () => {

  beforeAll(() => {
    browser.get('/history');
  });

  it('should navigate to history page', () => {
    expect(browser.getCurrentUrl()).toContain('/history');
  });

  it('should have a list of history items', () => {
    expect(element(by.css('history-list history-item')).isDisplayed()).toBeTruthy();
  });

  afterAll(() => {
    browser.driver.takeScreenshot();
  });

});
