import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export const isWalletEncrypted = (wallet: MeritWalletClient) => wallet.isPrivKeyEncrypted();
export const sendableInvites = (wallet: MeritWalletClient) => { return wallet.invitesBalance.availableAmount - 1};