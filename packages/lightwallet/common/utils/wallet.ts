import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export const isWalletEncrypted = (wallet: MeritWalletClient) => wallet.isPrivKeyEncrypted();
