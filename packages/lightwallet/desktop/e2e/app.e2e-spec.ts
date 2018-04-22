import { browser, by, element } from 'protractor';

describe('Desktop Lightwallet App', () => {

  beforeAll(() => {
    browser.get('/');
    browser.driver.sleep(5000);
  });

  it('title should be Merit Lightwallet', () => {
    expect(browser.getTitle()).toEqual('Merit Lightwallet');
  });

});
