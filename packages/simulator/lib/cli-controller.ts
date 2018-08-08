import * as chalk from 'chalk';
import * as ora from 'ora';

export interface ICLIOptions {
  verbose: boolean;
  rootWallet: string;
}

export class CLIController {
  constructor(protected opts: ICLIOptions) {}

  async validateOptions() {

  }
}
