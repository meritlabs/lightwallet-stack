import { DisplayWallet } from '@merit/common/models/display-wallet';

export const isWalletEncrypted = (wallet: DisplayWallet) => wallet.client.isPrivKeyEncrypted();
