import { BigNumber } from 'bignumber.js';
import { crypto, HDPrivateKey } from 'merit-lib';
import { createHash, pbkdf2Sync } from 'crypto';
import EnglishWordlist from './wordlists/english';

/**
 * New Mnemonic implementation in TypeScript.
 * TODO: Implement the ability to generate mnemonics in multiple languages
 */

export function generateMnemonicFromSeed(seed?: Buffer, dictionary: string[] = EnglishWordlist) {
  return entropyToMnemonic(seed, dictionary);
}

export function generateMnemonic(entropy: number = 128, dictionary: string[] = EnglishWordlist) {
  let entropyBuffer = crypto.Random.getRandomBuffer(entropy / 8);
  return entropyToMnemonic(entropyBuffer, dictionary);
}

export function mnemonicToSeed(mnemonic: string, passphrase: string = '') {
  return pbkdf2Sync(mnemonic.normalize('NFKD'), 'mnemonic' + passphrase, 2048, 64, 'sha512');
}

export function validateMnemonic(mnemonic: string) {
  return isValidSize(mnemonic) && hasValidWords(mnemonic) && hasValidEntropy(mnemonic);
}

export function validateImportMnemonic(mnemonic: string) {
  return isValidSize(mnemonic) && hasValidWords(mnemonic);
}

export function isValidSize(mnemonic: string) {
  return mnemonic.split(' ').length >= 12;
}

export function hasValidWords(mnemonic: string, wordlist: string[] = EnglishWordlist) {
  return !mnemonic.split(' ')
    .some((word: string) => wordlist.indexOf(word) === -1);
}

export function hasValidEntropy(mnemonic: string, wordlist: string[] = EnglishWordlist) {
  const words = mnemonic.split(' ');

  let bin = '';
  let i = 0, ind;

  for (i; i < words.length; i++) {
    ind = wordlist.indexOf(words[i]);
    if (ind < 0) return false;
    bin = bin + ('00000000000' + ind.toString(2)).slice(-11);
  }

  const cs = bin.length / 33,
    hash_bits = bin.slice(-cs),
    nonhash_bits = bin.slice(0, bin.length - cs),
    buf = new Buffer(nonhash_bits.length / 8);

  for (i = 0; i < nonhash_bits.length / 8; i++) {
    buf.writeUInt8(parseInt(bin.slice(i * 8, (i + 1) * 8), 2), i);
  }

  const expected_hash_bits = entropyChecksum(buf);
  return expected_hash_bits === hash_bits;
}

export function mnemonicToHDPrivateKey(mnemonic, passphrase, network) {
  const seed = mnemonicToSeed(mnemonic, passphrase);
  return HDPrivateKey.fromSeed(seed, network);
}

function entropyChecksum(entropy: Buffer): string {
  const hash = createHash('sha256').update(entropy).digest(),
    bits = entropy.length * 8,
    cs = bits / 32;

  let hashbits = new BigNumber(hash.toString('hex'), 16).toString(2);

  // zero pad the hash bits
  while (hashbits.length % 256 !== 0) {
    hashbits = '0' + hashbits;
  }

  return hashbits.slice(0, cs);
}

function entropyToMnemonic(entropy: Buffer, wordlist: string[]): string {
  let bin = '',
    i = 0;

  for (i; i < entropy.length; i++) {
    bin = bin + ('00000000' + entropy[i].toString(2)).slice(-8);
  }

  bin = bin + entropyChecksum(entropy);

  if (bin.length % 11 !== 0) {
    throw new Error('Invalid entropy');
  }

  const mnemonic = [];
  let wi;

  for (i = 0; i < bin.length / 11; i++) {
    wi = parseInt(bin.slice(i * 11, (i + 1) * 11), 2);
    mnemonic.push(wordlist[wi]);
  }

  return mnemonic.join(' ');

  // this is needed for japanese...
  // if (wordlist === Mnemonic.Words.JAPANESE) {
  //   return mnemonic.join('\u3000');
  // }
}
