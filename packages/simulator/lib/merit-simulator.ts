import { MeritWalletClient } from '../../lightwallet/common/merit-wallet-client';
import chalk from 'chalk';
import * as ora from 'ora';
import * as shortid from 'shortid';
import { couldBeAlias, isAlias } from '@merit/common/utils/addresses';
import { DerivationPath } from '@merit/common/utils/derivation-path';
import { ENV } from '@app/env';
import { Address, HDPrivateKey, PrivateKey, Script } from 'bitcore-lib';
import { EasySend, getEasySendURL } from '@merit/common/models/easy-send';


// Parent Alias: webdemo
// Parent Address: mRSLCXZrU76xkSGZVPY3pQC4i9ExASu2aP
// const NETWORK: string = 'testnet';

export interface IMeritSimulatorOptions {
  verbose: boolean;
  mwsUrl: string;
  network: string;
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

  getNodesIndex() {
    return this.nodesIndex;
  }

  getNodesTree() {
    return this.nodes;
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
      network: this.opts.network,
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

  async createWallet(parentWallet?: MeritWalletClient): Promise<MeritWalletClient> {
    parentWallet = parentWallet || this.getRootWallet();

    let walletClient: MeritWalletClient = this.getClient();

    walletClient.seedFromRandomWithMnemonic({
      network: this.opts.network,
      passphrase: '',
      account: 0,
    });

    let walletAlias: string = this.randomAlias();
    await walletClient.createWallet('@' + walletAlias, 'me', 1, 1, {
      network: this.opts.network,
      singleAddress: true,
      walletPrivKey: null,
      parentAddress: parentWallet.rootAddress.toString(),
      alias: walletAlias,
    });

    walletClient.rootAlias = walletAlias;

    return walletClient;
  }

  async getGlobalSendLink(mrtAmount: number, inviteAmount: number, timeout: number): Promise<string> {
    const rootWallet = this.getRootWallet();

    const easySend = this.createEasySendScriptHash(rootWallet, timeout);
    easySend.inviteOnly = mrtAmount <= 0;
    const referral = easySend.scriptReferralOpts;
    await rootWallet.sendReferral(referral);
    await this.inviteAddress(referral.address, null, inviteAmount);

    if (mrtAmount > 0) {
      await this.sendMerit(referral.address, mrtAmount, null);
    }

    return getEasySendURL(easySend);
  }

  private createEasySendScriptHash(wallet: MeritWalletClient, timeout: number, password?: string): EasySend {
    const rootKey = HDPrivateKey.fromString(wallet.credentials.xPrivKey);
    const signPrivKey = rootKey.privateKey;
    const pubkey = signPrivKey.publicKey;

    const easySend = this.bulidScript(wallet, password, timeout);
    const easySendAddress = Address(easySend.script.getAddressInfo()).toString();

    const scriptReferralOpts = {
      parentAddress: wallet.getRootAddress().toString(),
      pubkey: pubkey.toString(), // sign pubkey used to verify signature
      signPrivKey,
      address: easySendAddress,
      addressType: Address.PayToScriptHashType, // script address
      network: this.opts.network
    };

    // easy send address is a mix of script_id pubkey_id
    easySend.parentAddress = wallet.getRootAddress().toString();
    easySend.scriptAddress = easySendAddress;
    easySend.scriptReferralOpts = scriptReferralOpts;

    easySend.script.isOutput = true;

    return easySend;
  }

  private bulidScript(wallet: MeritWalletClient, passphrase: string, timeout: number): EasySend {
    passphrase = passphrase || '';
    const pubKey = wallet.getRootAddressPubkey();
    const rcvPair = PrivateKey.forNewEasySend(passphrase, this.opts.network);
    const pubKeys = [
      rcvPair.key.publicKey.toBuffer(),
      pubKey.toBuffer()
    ];
    const script = Script.buildEasySendOut(pubKeys, timeout, this.opts.network);

    return {
      receiverPubKey: rcvPair.key.publicKey,
      script: script.toMixedScriptHashOut(pubKey),
      senderName: wallet.rootAlias || wallet.rootAddress.toString(),
      senderPubKey: pubKey.toString(),
      secret: rcvPair.secret.toString('hex'),
      blockTimeout: timeout,
      parentAddress: '',
      scriptAddress: '',
      scriptReferralOpts: {},
      cancelled: false,
      inviteOnly: false
    };
  }

  inviteAddress(address: string)
  inviteAddress(address: string, parentAddress: string, amount?: number)
  inviteAddress(address: string, parentNode: INode, amount?: number)
  async inviteAddress(address: string, parent?: string | INode, amount?: number) {
    amount = amount || 1;
    return this.sendTx(address, amount, true, parent);
  }

  sendMerit(address: string, amount: number)
  sendMerit(address: string, amount: number, parentAddress: string)
  sendMerit(address: string, amount: number, parentNode: INode)
  async sendMerit(address: string, amount: number, parent?: string | INode) {
    return this.sendTx(address, amount, false, parent);
  }

  private async sendTx(toAddress: string, amount: number, invite: boolean, parent: string | INode) {
    let parentClient: MeritWalletClient;

    if (!invite) {
      amount = amount * 1e8;
    }

    if (!parent) {
      parentClient = this.getRootWallet();
    } else if (typeof parent === 'string') {
      parentClient = this.nodesIndex[parent].client;
    } else {
      parentClient = parent.client;
    }

    let txp = await parentClient.createTxProposal({
      invite,
      outputs: [
        {
          amount,
          toAddress,
          message: '',
          script: null
        }
      ]
    });

    txp = await parentClient.publishTxProposal({ txp });
    txp = await parentClient.signTxProposal(txp);
    await parentClient.broadcastTxProposal(txp);
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
