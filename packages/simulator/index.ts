#!/usr/bin/env node

import * as ora from 'ora';
import * as commander from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { MeritSimulator } from './lib/merit-simulator';
import { MnemonicValidator } from '@merit/common/validators/mnemonic.validator';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

const spinner = ora();
const { version } = require('./package.json');

console.log(chalk.bold.bgWhiteBright.blue('      Merit Simulator CLI v' + version + '      '));

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
  .version(version)
  .option('-v --verbose', 'verbose', false)
  .option('-r --root-wallet <mnemonic>', 'root wallet mnemonic phrase', 'turkey walnut rocket ordinary always fiction noise skull sketch aunt clown wild')
  .option('-m --mws <url>', 'MWS endpoint.', 'https://testnet.mws.merit.me/bws/api')
  .option('-n --network <type>', 'Network type', 'testnet');

commander
  .command('create-wallets [count]')
  .option('-i --invite', 'invite the newly created wallets to activate them', true)
  .option('-l --levels <amount>', 'number of node levels', 1)
  .option('-m --send-merit <amount>', 'amount of merit to send to each wallet', 0)
  .option('-i --send-invites <amount>', 'amount of invites to send to each wallet', 0)
  .option('-o --output <path>', 'path to output created wallets information', './merit-sim-wallets.csv')
  .option('-W --delay-wallet <duration>', 'delay in ms after creating a wallet', 0)
  .option('-L --delay-level <duration>', 'delay in ms after creating a level', 0)
  .description('Creates wallets')
  .action(async (count, cmd) => {
    count = count || 1;
    const { invite, levels, sendMerit, sendInvites, output, delayWallet, delayLevel } = cmd;
    const { verbose, rootWallet, mws, network } = cmd.parent;

    console.log(chalk.bold.magentaBright(`Creating ${ count } wallets in ${ levels } levels.`));

    if (invite) {
      console.log(chalk.bold.magentaBright('New wallets will be activated'));
    }

    if (sendMerit) {
      console.log(chalk.bold.magentaBright(`New wallets will receive ${ sendMerit }MRT`));
    }

    if (sendInvites) {
      console.log(chalk.bold.magentaBright(`New wallets will receive ${ sendInvites }INV`));
    }

    if (delayWallet) {
      console.log(chalk.bold.magentaBright(`There will be ${ delayWallet }ms delay after each wallet creation.`));
    }

    if (delayLevel) {
      console.log(chalk.bold.magentaBright(`There will be ${ delayLevel }ms delay after each wallet creation.`));
    }

    console.log(chalk.bold.magentaBright(`New wallet information will be outputted to: ${ path.resolve(__dirname, output) }`));

    if (verbose) {
      console.log(chalk.bgRed.rgb(255, 255, 255).bold(' ~ Verbose mode enabled ~ '));
    }

    console.log('\n');

    const sim = new MeritSimulator({ verbose, mwsUrl: mws, network });
    let createdWallets = [];

    try {
      checkMnemonic(rootWallet);
      spinner.start('Importing root wallet');
      await sim.setRootWallet(rootWallet);
      spinner.succeed('Root wallet imported');

      const walletsPerLevel = Math.ceil(count / levels);

      spinner.start('Creating wallets');

      let rootWalletClient: MeritWalletClient = sim.getRootWallet(),
        parentWallet: MeritWalletClient = rootWalletClient,
        lastCreatedWallet: MeritWalletClient;

      for (let l = 0; l < levels; l++) {
        for (let w = 0; w < walletsPerLevel; w++) {
          spinner.start(`Create wallets [Level: ${ l + 1 }/${ levels }] [Wallet: ${ w + 1}/${ walletsPerLevel }]`);
          lastCreatedWallet = await sim.createWallet(parentWallet);
          createdWallets.push(lastCreatedWallet);

          if (invite) {
            await sim.inviteAddress(lastCreatedWallet.getRootAddress().toString());
          }

          sim.addNode(lastCreatedWallet);
          await new Promise(resolve => setTimeout(resolve, delayWallet));
        }
        parentWallet = lastCreatedWallet;
        await new Promise(resolve => setTimeout(resolve, delayLevel));
      }

      const nWallets = createdWallets.length;

      spinner.succeed('Created wallets');

      if (sendMerit) {
        for (let i = 0; i < nWallets; i++) {
          const { rootAddress } = createdWallets[i];
          spinner.start(`Sending ${ sendMerit }MRT to wallet ${ i + 1 }/${ nWallets }`);
          await sim.sendMerit(rootAddress.toString(), sendMerit);
        }
        spinner.succeed(`Sent ${ sendMerit }MRT to all wallets`);
      }

      if (sendInvites) {
        for (let i = 0; i < nWallets; i++) {
          const { rootAddress } = createdWallets[i];
          spinner.start(`Sending ${ sendInvites }INV to wallet ${ i + 1 }/${ nWallets }`);
          await sim.sendMerit(rootAddress.toString(), sendMerit);
        }
        spinner.succeed(`Sent ${ sendInvites }INV to all wallets`);
      }

    } catch (err) {
      spinner.fail(err && err.message ? err.message : err || 'Unknown error!');
    } finally {
      spinner.start('Saving wallets to file');
      let text = '';
      createdWallets.forEach((wallet: MeritWalletClient) => {
        text += wallet.rootAddress.toString() + ',' + wallet.rootAlias + ',' + wallet.getMnemonic() + '\n';
      });
      fs.writeFileSync(path.resolve(__dirname, output), text, 'utf-8');
      spinner.succeed('Wallets saved to file');
    }
  });

commander
  .command('globalsend [count]')
  .option('-t --timeout <timeout>', 'Block timeout', 10800)
  .option('-o --output <path>', 'path to output created GlobalSend information', './merit-sim-globalsends.txt')
  .option('-M --merit <amount>', 'amount of merit to send. If set to 0 then the transaction will be MeritInvite', 0)
  .option('-I --invites <amount>', 'amount of invites to send', 1)
  .description('Generate MeritMoney and MeritInvite links')
  .action(async (count, cmd) => {
    count = count || 1;
    const { invites, merit, timeout, output } = cmd;
    const { verbose, rootWallet, mws, network } = cmd.parent;

    console.log(mws, network);

    const sim = new MeritSimulator({ verbose, mwsUrl: mws, network });
    const links = [];

    try {
      checkMnemonic(rootWallet);
      spinner.start('Importing root wallet');
      await sim.setRootWallet(rootWallet);
      spinner.succeed('Root wallet imported');

      for (let i = 0; i < count; i++) {
        spinner.start(`Creating ${ i + 1 }/${ count } GlobalSend links`);
        links.push(await sim.getGlobalSendLink(merit, invites, timeout));
      }

      spinner.succeed(`Created ${ count } GlobalSend links`);
    } catch (err) {
      spinner.fail(err && err.message ? err.message : err || 'Unknown error!');
      console.trace('ERR')
    } finally {
      spinner.start('Saving wallets to file');
      fs.writeFileSync(path.resolve(__dirname, output), links.join('\n'), 'utf-8');
      spinner.succeed('GlobalSend links saved to file');
    }
  });

commander
  .parse(process.argv);
