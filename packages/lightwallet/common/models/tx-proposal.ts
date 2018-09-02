import { IUTXO } from '@merit/common/reducers/transactions.reducer';
import { orderBy, partition } from 'lodash';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getAddressInfo, isAddress } from '@merit/common/utils/addresses';
import { MeritContact } from '@merit/common/models/merit-contact';
import { EasySend } from '@merit/common/models/easy-send';
import { Utils } from '@merit/common/merit-wallet-client/lib/common';
import { Transaction, HDPrivateKey, HDPublicKey, crypto, Script } from 'bitcore-lib';
import { mrtToMicro } from '@merit/common/utils/format';

const UTXO_SELECTION_MAX_SINGLE_UTXO_FACTOR = 2;
const UTXO_SELECTION_MAX_FEE_VS_TX_AMOUNT_FACTOR = 0.05;
const UTXO_SELECTION_MIN_TX_AMOUNT_VS_UTXO_FACTOR = 0.1;
const UTXO_SELECTION_MAX_FEE_VS_SINGLE_UTXO_FEE_FACTOR = 5;
const MIN_OUTPUT_AMOUNT = 5000;
const MAX_TX_SIZE_IN_KB = 6000;
const TX_INPUT_SIZE = 147;
const TX_OUTPUT_SIZE = 34;
const TX_OVERHEAD = 10;
const FEE_PER_KB = 20000;
const FEE_PER_INPUT = TX_INPUT_SIZE * FEE_PER_KB / 1000;
const FEE_PER_OUTPUT = TX_OUTPUT_SIZE * FEE_PER_KB / 1000;
const DUST_AMOUNT = 546;

export interface ITxProposalOptions {
  /**
   * The address this transaction is being sent from
   */
  fromAddress: string;

  /**
   * The address this transaction is being sent to
   */
  toAddress: string;

  /**
   * The amount of Merit or Invites to send
   */
  amount: number;

  /**
   * Whether this transaction is sending invites. Defaults to false.
   */
  isInvite: boolean;

  /**
   * List of UTXOs
   */
  utxos: IUTXO[];

  feeIncluded: boolean;

  wallet: DisplayWallet;

  isGlobalSend?: boolean;

  toScript?: string;
}

export interface ITxProposalOutput {
  address: string;
  amount: number;
  isChange?: boolean;
  script?: string;
}

export class TxProposal implements ITxProposalOptions {
  fromAddress: string;
  toAddress: string;
  toScript: string;
  amount: number;
  isInvite: boolean;
  inputs: IUTXO[] = [];
  outputs: ITxProposalOutput[] = [];
  utxos: IUTXO[] = [];
  feeIncluded: boolean;
  error: string;
  wallet: DisplayWallet;
  isGlobalSend: boolean;
  contact: MeritContact;

  private hasChange: boolean;

  static create(opts: Partial<ITxProposalOptions>) {
    const txp = new TxProposal();

    for (let key in opts) {
      txp[key] = opts[key];
    }

    if (txp.isGlobalSend && !txp.toAddress) {
      // Temporarily use the sender address as receiver,
      // so we don't have to create a GlobalSend Script Hash yet
      txp.toAddress = txp.fromAddress;
    }

    txp.amount = Math.max(txp.amount, 0);

    if (txp.wallet) {
      txp.amount = Math.min(txp.amount, opts.wallet.balance.amountMrt);
      if (txp.amount == opts.wallet.balance.amountMrt) {
        txp.feeIncluded = true;
      }
    }

    if (opts.utxos && opts.fromAddress && opts.amount) {
      txp.selectInputs();
    }

    if (txp.inputs.length && opts.toAddress) {
      txp.setOutputs();
    }

    return txp;
  }

  async build() {
    const t = new Transaction();

    if (this.isInvite) {
      t.makeInvite();
    }

    // Attach the sender's address + pub key to inputs
    const script = Script.fromAddress(this.wallet.address).toHex();
    const address = this.wallet.address;
    const inputs = this.inputs.map((utxo: IUTXO) => ({
      outputIndex: utxo.outputIndex,
      txid: utxo.txid,
      micros: utxo.amount,
      script,
      address,
      path: 'm/0/0'
    }));

    console.log('Inputs are ', inputs);

    console.log('T is ', t);

    // Add inputs to transaction
    t.from(inputs);

    let toAddress = this.toAddress;

    if (!isAddress(toAddress)) {
      // convert alias to address
      const addressInfo = await getAddressInfo(toAddress);
      toAddress = addressInfo.address;
    }

    console.log('This amount is ', this.amount);

    if (this.toScript) {
      t.addOutput(new Transaction.Output({
        script: this.toScript,
        micros: this.amount,
      }));
    } else {
      // Specify main output
      t.to(toAddress, this.amount);
    }

    // Add fee
    t.fee(this.getTxFee());

    // Specify change address
    t.change(this.fromAddress);

    console.log('T is ', t);

    return t;
  }

  selectInputs() {
    let utxos = [...this.utxos];

    if (this.isInvite) {
      utxos = utxos.filter(utxo => utxo.isInvite);
    }

    const bigInputThreshold = this.amount * 2 + TX_OVERHEAD + TX_INPUT_SIZE;
    const partitions = partition(utxos, utxo => utxo.amount > bigInputThreshold);

    const bigInputs = orderBy(partitions[0], 'amount', 'asc');
    const smallInputs = orderBy(partitions[1], 'amount', 'desc');

    let totalInputAmount: number = 0;
    let netTotal: number = 0;
    let inputs: IUTXO[] = [];
    let fee: number = 0;

    for (let i = 0; i < smallInputs.length; i++) {
      const input = smallInputs[i];
      let netInputAmount = input.amount - (this.feeIncluded || this.isInvite? 0 : FEE_PER_INPUT);
      inputs.push(input);
      totalInputAmount += input.amount;
      netTotal += netInputAmount;

      const txpSize = inputs.length * TX_INPUT_SIZE;

      if (!this.isInvite) {
        fee = Math.round(this.getBaseTxFee() + inputs.length * FEE_PER_INPUT);
      }

      const feeVsAmountRatio = this.isInvite? 0 : fee / this.amount;
      const amountVsInputRatio = netInputAmount / this.amount;

      if (txpSize / 1000 > MAX_TX_SIZE_IN_KB) {
        throw 'Max transaction size exceeded.';
      }

      if (bigInputs.length) {
        if (amountVsInputRatio < UTXO_SELECTION_MIN_TX_AMOUNT_VS_UTXO_FACTOR) {
          // Break because UTXO is too small to be compared to tx amount
          break;
        }

        if (feeVsAmountRatio > UTXO_SELECTION_MAX_FEE_VS_TX_AMOUNT_FACTOR) {
          const feeVsSingleInputFeeRatio = fee / (this.getBaseTxFee() + FEE_PER_INPUT);
          if (feeVsSingleInputFeeRatio > UTXO_SELECTION_MAX_FEE_VS_SINGLE_UTXO_FEE_FACTOR) {
            break;
          }
        }
      }

      if (netTotal >= this.amount) {
        const changeAmount = Math.round(totalInputAmount - this.amount - (this.feeIncluded? 0 : fee));
        const dustThreshold = Math.max(MIN_OUTPUT_AMOUNT, DUST_AMOUNT);

        if (!this.isInvite && changeAmount > 0 && changeAmount <= dustThreshold) {
          // Remove dust by incrementing fee
          fee += changeAmount;
        }

        break;
      }
    }

    if (netTotal < this.amount) {
      inputs = [];

      if (bigInputs.length) {
        inputs = [inputs[0]];
      }
    }

    if (!inputs.length) {
      debugger;
      throw 'Insufficient funds for fee';
    }

    return this.inputs = inputs;
  }

  setOutputs() {
    const totalInputAmount = this.inputs.reduce((sum, i) => sum + i.amount, 0);
    const fee = this.isInvite? 0 : this.getTxFee() + FEE_PER_OUTPUT;
    const outputs: ITxProposalOutput[] = [{
      address: this.toAddress,
      amount: this.feeIncluded? this.amount - fee : this.amount,
      script: this.toScript,
    }];

    const changeAmount = totalInputAmount - this.amount - fee;

    this.hasChange = changeAmount > 0 && (changeAmount - FEE_PER_OUTPUT) >= DUST_AMOUNT;

    if (this.hasChange) {
      outputs.push({
        address: this.fromAddress,
        amount: changeAmount - FEE_PER_OUTPUT,
        isChange: true,
      });
    }

    return this.outputs = outputs;
  }

  /**
   * Returns the inputs size in bytes
   */
  getInputsSize() {
    return this.inputs.length * TX_INPUT_SIZE;
  }

  /**
   * Returns the outputs size in bytes
   */
  getOutputsSize() {
    return this.outputs.length * TX_OUTPUT_SIZE;
  }

  /**
   * Returns transaction size in kilobytes
   */
  getTxSize() {
    return this.getTxSizeBytes() / 1000;
  }

  getBaseTxFee() {
    return TX_OVERHEAD / 1000 * FEE_PER_KB;
  }

  /**
   * Returns transaction size in bytes
   */
  getTxSizeBytes() {
    return Math.round(TX_OVERHEAD + this.getInputsSize() + this.getOutputsSize());
  }

  /**
   * Returns the current estimated transaction fee
   */
  getTxFee() {
    return Math.round(FEE_PER_KB * this.getTxSize() + (this.isGlobalSend? 20000 : 0));
  }

  async getSignedRawTx(): Promise<string> {
    const tx: Transaction = await this.build();

    // Sign tx
    const derviedXPrivKey = this.wallet.client.credentials.getDerivedXPrivKey('');
    const xPrivKey = new HDPrivateKey(derviedXPrivKey);
    const priv = xPrivKey.deriveChild('m/0/0').privateKey;
    const signatures = tx.getSignatures(priv).map(s => s.signature.toDER().toString('hex'));

    // Attach signatures to inputs
    const xPubKey = derviedXPrivKey.hdPublicKey;
    tx.inputs.forEach((input, i) => {
      const sig = crypto.Signature.fromString(signatures[i]);
      const pub = xPubKey.deriveChild('m/0/0').publicKey;
      const script = {
        inputIndex: i,
        signature: sig,
        sigtype: crypto.Signature.SIGHASH_ALL,
        publicKey: pub,
      };
      input.addSignature(tx, script);
    });

    return tx.uncheckedSerialize();
  }
}
