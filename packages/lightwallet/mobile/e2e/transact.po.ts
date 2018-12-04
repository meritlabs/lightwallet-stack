import { browser, protractor, element, by } from 'protractor';
import { EC } from './app.e2e-spec';

export class Transact {
  getRootEl() {
    return element(by.css('view-transact'));
  }

  getTabButtonsEl() {
    return this.getTabsEl().element(by.css('.tabbar'));
  }

  getTabsEl() {
    return this.getRootEl().element(by.css('ion-tabs'));
  }

  getSelectedTab() {
    return this.getTabsEl().element(by.css('ion-tab[aria-hidden=false]'));
  }

  selectTab(index: number) {
    const el = this.getTabButtonsEl().element(by.css(`.tab-button:nth-child(${++index})`));
    browser.wait(EC.visibilityOf(el), 3000, 'Cant click on tab button');
    return el.click();
  }

  getSendView() {
    return this.getRootEl().element(by.css('view-send'));
  }

  getReceiveView() {
    return this.getRootEl().element(by.css('view-receive'));
  }

  getCommunityView() {
    return this.getRootEl().element(by.css('view-network'));
  }
}
