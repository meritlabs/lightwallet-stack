#!/usr/bin/env node

import * as cla from 'command-line-args';
import { CLIController, ICLIOptions } from './lib/cli-controller';
import * as ora from 'ora';

const optionDefinitions: cla.OptionDefinition[] = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'rootWallet', alias: 'r', type: String },
];

const opts: ICLIOptions = cla(optionDefinitions) as ICLIOptions;

(async (opts: ICLIOptions) => {
  const ctrl = new CLIController(opts);
  const spinner = ora();

  try {
    spinner.start('Validating options');
    await ctrl.validateOptions();
    spinner.succeed('Options are valid!');


    spinner.start('Doing something else...');
    setTimeout(() => {
      spinner.succeed('DONE!');

    }, 1000);
    throw 'Something happened yo'
  } catch (err) {
    spinner.fail(err && err.message? err.message : err || 'Unknown error!');
  }
})(opts);
