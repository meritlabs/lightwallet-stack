import { MeritSimulator } from './merit-simulator';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { couldBeAlias } from '@merit/common/utils/addresses';

describe('Merit Simulator', () => {

  const ROOT_ADDRESS = 'mNAxzEYp7HcQCdMqstzftS548SSYx5PvWd';
  const ROOT_ALIAS = 'ibby-demo-mac';
  const ROOT_MNEMONIC = 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild';

  let meritSimulator: MeritSimulator;

  beforeAll(() => {
    meritSimulator = new MeritSimulator({
      mwsUrl: 'https://testnet.mws.merit.me/bws/api',
      verbose: true,
    });
  });

  describe('Set root wallet', () => {
    let rootWallet: MeritWalletClient;

    it('should import root wallet', async () => {
      rootWallet = await meritSimulator.setRootWallet(ROOT_MNEMONIC);

      expect(rootWallet).toBeDefined();
      expect(rootWallet instanceof MeritWalletClient).toBeTruthy();
    });

    it('should have "' + ROOT_ADDRESS + '" as an address', () => {
      expect(rootWallet.rootAddress.toString()).toEqual(ROOT_ADDRESS);
    });

    it('should have "@' + ROOT_ALIAS + '" as an alias', () => {
      expect(rootWallet.rootAlias).toEqual(ROOT_ALIAS);
    });
  });


  describe('Create wallet', () => {
    let wallet: MeritWalletClient;

    it('should create a wallet', async () => {
      wallet = await meritSimulator.createWallet();

      expect(wallet).toBeDefined();
      expect(wallet instanceof MeritWalletClient).toBeTruthy();
    });

    it('parent address should be ' + ROOT_ADDRESS, () => {
      expect(wallet.parentAddress).toEqual(ROOT_ADDRESS);
      wallet.
    });
  });

  describe('Random alias', () => {
    it('should generate a valid random alias', () => {
      expect(couldBeAlias(meritSimulator.randomAlias())).toBeTruthy();
    });
  });

});
