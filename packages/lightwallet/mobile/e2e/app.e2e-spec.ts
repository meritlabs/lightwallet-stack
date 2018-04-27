import { browser } from 'protractor';

describe('[Mobile] Onboarding', () => {

  beforeAll(() => {
    browser.get('/');
    browser.driver.manage().window().maximize();
  });

  it('should open the app', () => {

  });

});
