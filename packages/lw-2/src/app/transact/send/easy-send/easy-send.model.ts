export type EasySend = {
  receiverPubKey: any; // TODO: make a publicKey model
  script: any; // TODO: make a script model
  senderName: string;
  senderPubKey: string;
  secret: string;
  unlockCode: string;
  blockTimeout: number;
}

export let easySendURL = (es: EasySend): string => {
  return `https://send.merit.me/` +
            `?se=${es.secret}` +
            `&sk=${es.senderPubKey}` +
            `&sn=${es.senderName}` +
            `&bt=${es.blockTimeout}` +
            `&uc=${es.unlockCode}`;
}