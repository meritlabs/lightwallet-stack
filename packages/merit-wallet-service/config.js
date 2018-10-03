var sgTransport = require('nodemailer-sendgrid-transport');

var config = {
  basePath: '/bws/api',
  disableLogs: false,
  port: 3232,
  ignoreRateLimiter: true,

  // Uncomment to make MWS a forking server
  // cluster: true,

  // Uncomment to set the number or process (will use the nr of availalbe CPUs by default)
  // clusterInstances: 4,

  // https: true,
  // privateKeyFile: 'private.pem',
  // certificateFile: 'cert.pem',
  ////// The following is only for certs which are not
  ////// trusted by nodejs 'https' by default
  ////// CAs like Verisign do not require this
  // CAinter1: '', // ex. 'COMODORSADomainValidationSecureServerCA.crt'
  // CAinter2: '', // ex. 'COMODORSAAddTrustCA.crt'
  // CAroot: '', // ex. 'AddTrustExternalCARoot.crt'

  storageOpts: {
    mongoDb: {
      uri: 'mongodb://localhost:27017/bws',
    },
  },
  lockOpts: {
    //  To use locker-server, uncomment this:
    lockerServer: {
      host: 'localhost',
      port: 3231,
    },
  },
  messageBrokerOpts: {
    //  To use message broker server, uncomment this:
    messageBrokerServer: {
      url: 'http://localhost:3380',
    },
  },
  blockchainExplorerOpts: {
    // livenet: {
    //   provider: 'insight',
    //   url: 'http://127.0.0.1:3131', //Does not exist for now.
    // },
    testnet: {
      provider: 'insight',
      url: 'http://localhost:3001',

      // url: 'http://localhost:3001',
      // Multiple servers (in priority order)
      // url: ['http://a.b.c', 'https://test-insight.bitpay.com:443'],
    },
  },
  pushNotificationsOpts: {
    templatePath: './packages/merit-wallet-service/lib/templates', // this must be relative to merit-node runner
    defaultLanguage: 'en',
    defaultUnit: 'mrt',
    subjectPrefix: '',
    pushServerUrl: 'https://fcm.googleapis.com/fcm',
    authorizationKey: process.env.FCM_AUTH_KEY,
  },
  // fiatRateServiceOpts: {
  //   defaultProvider: 'BitPay',
  //   fetchInterval: 60, // in minutes
  // },
  // To use email notifications uncomment this:
  // emailOpts: {
  //  host: 'localhost',
  //  port: 25,
  //  ignoreTLS: true,
  //  subjectPrefix: '[Wallet Service]',
  //  from: 'wallet-service@bitcore.io',
  //  templatePath: './lib/templates',
  //  defaultLanguage: 'en',
  //  defaultUnit: 'mrt',
  //  publicTxUrlTemplate: {
  //    livenet: 'https://insight.bitpay.com/tx/{{txid}}',
  //    testnet: 'https://test-insight.bitpay.com/tx/{{txid}}',
  //  },
  //},
  mailer: sgTransport({ auth: {
    api_key: '',
  }}),
  emailOpts: {
    subjectPrefix: '[Merit]',
    from: 'support@merit.me',
    defaultLanguage: 'en',
    defaultUnit: 'mrt',
    publicTxUrlTemplate: {
      livenet: 'https://insight.bitpay.com/tx/{{txid}}',
      testnet: 'https://test-insight.bitpay.com/tx/{{txid}}',
    }
  },
  meritMessagingUrl: process.env.MERIT_MESSAGING_URL || 'http://localhost:8300',
  smsOpts: {
    enabled: process.env.SMS_ENABLED
  }
};
module.exports = config;
