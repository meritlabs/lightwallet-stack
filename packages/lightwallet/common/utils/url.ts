import { ENV } from '@app/env';

export function parseQuery(): object {
  const query = location.search.substr(1);

  return query
    .split('&')
    .reduce((res, pair) => {
      const q = pair.split('=');
      return { ...res, [q[0]]: q[1] };
    }, {});
}

export function getQueryParam(key: string): string {
  return parseQuery()[key] || '';
}

export function getWalletUrl() {
  return ENV.network === 'testnet'? 'https://testnet.wallet.merit.me/' : 'https://wallet.merit.me/';
}

export function getShareLink(aliasOrAddress: string) {
  return `${ getWalletUrl() }?invite=${aliasOrAddress}`
}
