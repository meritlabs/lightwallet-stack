import { MeritWalletClient } from '../../lightwallet/common/merit-wallet-client';
import chalk from 'chalk';
import * as ora from 'ora';
import * as shortid from 'shortid';
import { couldBeAlias, isAlias } from '@merit/common/utils/addresses';
import { DerivationPath } from '@merit/common/utils/derivation-path';

// Parent Alias: webdemo
// Parent Address: mRSLCXZrU76xkSGZVPY3pQC4i9ExASu2aP
const NETWORK: string = 'testnet';

export interface IMeritSimulatorOptions {
  verbose: boolean;
  mwsUrl: string;
}

export interface INode {
  parentAddress: string;
  address: string;
  alias: string;
  mnemonic: string;
  client: MeritWalletClient;
  children: INode[];
}

export class MeritSimulator {
  private rootWallet: MeritWalletClient;
  private nodes: INode[] = [];
  private nodesIndex: {[address: string]: INode} = {};

  constructor(private opts: IMeritSimulatorOptions) {}

  async setRootWallet(mnemonic: string): Promise<MeritWalletClient> {
    return this.rootWallet = await this.importWallet(mnemonic);
  }

  getRootWallet(): MeritWalletClient {
    return this.rootWallet;
  }

  addNode(client: MeritWalletClient) {
    const node: INode = {
      address: client.getRootAddress(),
      alias: client.rootAlias,
      mnemonic: client.getMnemonic(),
      children: [],
      parentAddress: client.parentAddress,
      client,
    };

    this.nodesIndex[node.address] = node;
  }

  getNodeRoute(parentAddress: string): string[] {
    const route = [];
    let reachedRoot = false,
      address = parentAddress;

    while(!reachedRoot) {
      route.splice(0, 0, address);

      if (!(reachedRoot = !!this.nodes.find(node => node.address === parentAddress))) {
        address = this.nodesIndex[address].parentAddress;
      }
    }

    return route
  }

  async importWallet(mnemonic: string): Promise<MeritWalletClient> {
    const client = this.getClient();
    const opts: any = {
      network: NETWORK,
    };

    await client.importFromMnemonic(mnemonic, opts);
    return client;
  }

  getClient(): MeritWalletClient {
    return MeritWalletClient.getInstance({
      baseUrl: this.opts.mwsUrl,
      verbose: this.opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
  }

  inviteAddress(address: string)
  inviteAddress(address: string, parentAddress: string)
  inviteAddress(address: string, parentNode: INode)
  async inviteAddress(address: string, parent?: string | INode) {
    let parentClient: MeritWalletClient;

    if (!parent) {
      parentClient = this.getRootWallet();
    } else if (typeof parent === 'string') {
      parentClient = this.nodesIndex[parent].client;
    } else {
      parentClient = parent.client;
    }

    let txp = await parentClient.createTxProposal({
      invite: true,
      outputs: [
        {
          amount: 1,
          toAddress: address,
          message: '',
          script: null
        }
      ]
    });

    console.log('publishing ... ');
    txp = await parentClient.publishTxProposal({ txp });
    console.log('signing ...');
    txp = await parentClient.signTxProposal(txp);
    console.log('broadcasting...');
    await parentClient.broadcastTxProposal(txp);
  }

  async createWallet(): Promise<MeritWalletClient> {
    let walletClient: MeritWalletClient = this.getClient();

    walletClient.seedFromRandomWithMnemonic({
      network: NETWORK,
      passphrase: '',
      account: 0,
    });

    let walletAlias: string = this.randomAlias();
    await walletClient.createWallet('@' + walletAlias, 'me', 1, 1, {
      network: NETWORK,
      singleAddress: true,
      walletPrivKey: null,
      parentAddress: 'mRSLCXZrU76xkSGZVPY3pQC4i9ExASu2aP',
      alias: walletAlias,
    });
    console.log(chalk.magentaBright('New wallet created with alias: ' + walletAlias));

    return walletClient;
  }

  randomAlias() {
    let alias: string;
    do {
      alias = 'test' + shortid.generate();
      if (couldBeAlias(alias))
        return alias;
    } while (true);
  }
}
