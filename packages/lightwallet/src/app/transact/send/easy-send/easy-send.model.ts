export type EasySend = {
  receiverPubKey: any; // TODO: make a publicKey model
  script: any; // TODO: make a script model
  scriptAddress: string;
  senderName: string;
  senderPubKey: string;
  secret: string;
  parentAddress: string;
  blockTimeout: number;
  scriptReferralOpts: any;
  recipientReferralOpts: any;
  txid?: string;
}

export let easySendURL = (es: EasySend): string => {
  return `https://merit.app.link/` +
            `?se=${es.secret}` +
            `&sk=${es.senderPubKey}` +
            `&sn=${es.senderName}` +
            `&bt=${es.blockTimeout}` +
            `&pa=${es.parentAddress}`;
}
