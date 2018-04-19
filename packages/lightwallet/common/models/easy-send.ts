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
}

export const getEasySendURL = (es: EasySend): string => {
  let easyUrl: string;
  if (ENV && ENV.easyUrl) {
    easyUrl = ENV.easyUrl;
  } else {
    easyUrl = "https://merit.test-app.link/";
  }
  return easyUrl +
    `?se=${es.secret}` +
    `&sk=${es.senderPubKey}` +
    `&sn=${es.senderName}` +
    `&bt=${es.blockTimeout}` +
    `&pa=${es.parentAddress}`;
};
