import { MeritSimulator } from './merit-simulator';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { couldBeAlias } from '@merit/common/utils/addresses';

const sleep = (duration: number) => new Promise<void>(resolve => setTimeout(() => resolve(), duration));

describe('Merit Simulator', () => {

  const ROOT_ADDRESS = 'mNAxzEYp7HcQCdMqstzftS548SSYx5PvWd';
  const ROOT_ALIAS = 'ibby-demo-mac';
  const ROOT_MNEMONIC = 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild';

  let meritSimulator: MeritSimulator;
  let wallet: MeritWalletClient;

  beforeAll(() => {
    meritSimulator = new MeritSimulator({
      mwsUrl: 'https://testnet.mws.merit.me/bws/api',
      verbose: true,
      network: 'testnet'
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
    it('should create a wallet', async () => {
      wallet = await meritSimulator.createWallet();

      expect(wallet).toBeDefined();
      expect(wallet instanceof MeritWalletClient).toBeTruthy();
    }, 6e4);
  });

  describe('Invite wallet', () => {
    let initialInviteBalance: number;
    let rootWallet;

    beforeAll(() => {
      rootWallet = meritSimulator.getRootWallet()
    });

    it('should get invites balance', async () => {
      await rootWallet.getStatus();
      initialInviteBalance = rootWallet.invitesBalance.availableAmount;
      expect(typeof initialInviteBalance === 'number').toBeTruthy();
      expect(initialInviteBalance > 0).toBeTruthy();
    }, 3e4);

    it('should invite the new wallet', async () => {
      await meritSimulator.inviteAddress(wallet.rootAddress.toString());
      expect(true).toBeTruthy()
    }, 1e5);

    it('root wallet invite balance should have changed', async () => {
      await sleep(1e4);
      await rootWallet.getStatus();
      expect(rootWallet.invitesBalance.availableAmount).not.toEqual(initialInviteBalance);
    }, 3e4);
  });

  describe('Random alias', () => {
    it('should generate a valid random alias', () => {
      expect(couldBeAlias(meritSimulator.randomAlias())).toBeTruthy();
    });
  });

});
