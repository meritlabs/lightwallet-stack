import { ENV } from '@app/env';

export interface EasySend {
  receiverPubKey: any; // TODO: make a publicKey model
  script: any; // TODO: make a script model
  scriptAddress: string;
  senderName: string;
  senderPubKey: string;
  secret: string;
  parentAddress: string;
  blockTimeout: number;
  scriptReferralOpts: any;
  txid?: string;
  cancelled: boolean;
  inviteOnly: boolean;
}

export const getEasySendURL = (es: EasySend): string => {
  return (
    ENV.easyUrl +
    `?se=${es.secret}` +
    `&sk=${es.senderPubKey}` +
    `&sn=${es.senderName}` +
    `&bt=${es.blockTimeout}` +
    `&pa=${es.parentAddress}`
  );
};
