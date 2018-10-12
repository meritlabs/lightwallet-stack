import { ENV } from '@app/env';

export function parseQuery(query: string): object {
  query = query.substr(query.indexOf('?') + 1);

  return query
    .split('&')
    .reduce((res, pair) => {
      const q = pair.split('=');
      return { ...res, [q[0]]: q[1] };
    }, {});
}

export function getQueryParam(key: string, query: string = window.location.search): string {
  return parseQuery(query)[key] || '';
}

export function getWalletUrl() {
  return ENV.network === 'testnet'? 'https://testnet.wallet.merit.me/' : 'https://wallet.merit.me/';
}

export function getShareLink(aliasOrAddress: string) {
  return `${ getWalletUrl() }?invite=${aliasOrAddress}`
}
