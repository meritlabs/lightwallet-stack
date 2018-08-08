#!/usr/bin/env node

import * as ora from 'ora';

import * as commander from 'commander';
import { MeritSimulator } from './lib/merit-simulator';
import { MnemonicValidator } from '@merit/common/validators/mnemonic.validator';

const spinner = ora();

function checkMnemonic(mnemonic: string) {
  const errors = MnemonicValidator.validateMnemonicImport({ value: mnemonic } as any);

  if (!errors) {
    return;
  }

  if (errors.InvalidSize) {
    throw 'Invalid mnemonic size';
  }

  if (errors.InvalidWords) {
    throw 'Mnemonic has invalid words';
  }
}

commander
  .name('merit-sim')
  .version('0.0.1')
  .option('-v --verbose', 'verbose', false)
  .option('-r --root-wallet <mnemonic>', 'root wallet mnemonic phrase')
  .option('-m --mws <url>', 'MWS endpoint.', 'https://testnet.mws.merit.me/bws/api')
  .option('-n --network <type>', 'Network type', 'testnet');

commander
  .command('create-wallets [count]')
  .option('-i --invite', 'invite the newly created wallets to activate them', true)
  .option('-l --levels', 'number of node levels', 1)
  .option('-sm --send-merit <amount>', 'amount of merit to send to each wallet', 0)
  .option('-si --send-invites <amount>', 'amount of invites to send to each wallet', 0)
  .option('-o --output <path>', 'path to output created wallets information', './merit-sim-wallets.txt')
  .description('Creates wallets')
  .action(async (count, cmd) => {
    count = count || 1;
    const { invite, levels, sendMerit, sendInvites, output } = cmd;
    const { verbose, rootWallet, mws, network } = cmd.parent;

    const sim = new MeritSimulator({ verbose, mwsUrl: mws, network });

    console.log('Root wallet is ', rootWallet);
    console.log('Network is ', network);
    console.log('MWS is ', mws);

    try {
      checkMnemonic(rootWallet);
      spinner.start('Importing root wallet');
      await sim.setRootWallet(rootWallet.toLowerCase().trim());
      spinner.succeed('Root wallet imported');

    } catch (err) {
      spinner.fail(err && err.message ? err.message : err || 'Unknown error!');
    }
  });

commander
  .command('globalsend [count]')
  .option('-i --invite-only', 'generate MeritInvite links instead of MeritMoney', false)
  .option('-bt --block-timeout <timeout>', 'Block timeout', 10800)
  .option('-o --output <path>', 'path to output created GlobalSend information', './merit-sim-globalsends.txt')
  .description('Generate MeritMoney and MeritInvite links')
  .action(async (count, cmd) => {
    count = count || 1;
    const { inviteOnly, output } = cmd;
    const { verbose, rootWallet, mws, network } = cmd.parent;
    const sim = new MeritSimulator({ verbose, mwsUrl: mws, network });

    try {
      spinner.start('Importing root wallet');
      await sim.importWallet(rootWallet.toLowerCase().trim());
      spinner.succeed('Root wallet imported');

    } catch (err) {
      spinner.fail(err && err.message ? err.message : err || 'Unknown error!');
    }
  });

commander
  .parse(process.argv);
