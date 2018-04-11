const ENV = require('./environment.js')[process.env.NODE_ENV];

const app = require('express-async-await')(
    require('express')()
);

/** limitations */
const POST_LIMIT = 1024 * 100 /* Max POST 100 kb */ ;

/** db */
const mongoose = require('mongoose');
mongoose.connect(ENV.dbHost, {});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/** blockchain client */
const MeritRPC = require('meritd-rpc');
const bcClient = new MeritRPC({
    protocol:  'http',
    host: ENV.rpchost || '127.0.0.1',
    port: ENV.rpcport,
    user: ENV.rpcuser,
    pass: ENV.rpcpassword,
    rejectUnauthorized: ENV.rpcstrict == undefined ? true : ENV.rpcstrict
});

/** services */
TxService = require('./services/tx.service');
app.txService = new TxService(bcClient);

/** loading controllers into and app */
require('express-load')('controllers').into(app);

/** headers */
app.use(require('compression')());
app.use(require('body-parser').json({ limit: POST_LIMIT }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'x-signature,x-identity,x-session,x-client-version,x-wallet-id,X-Requested-With,Content-Type,Authorization');
    next();
});
app.use(require('cors')());

/** authentication */
app.use((req, res, next) => {
   const url = req._parsedUrl.pathname;

   const nonAuthRoutes = [
       //todo add regexps for:
       // validate address/alias
       // validate easyscript
       '/test'
   ];

   if (nonAuthRoutes.some(r => (new RegExp(r, 'i')).test(url))) return next();

   req.copayerId  = req.header('x-identity');
   req.signatture = req.header('x-signature');
   req.session    = req.header('x-session');
   req.walletId   = req.header('x-wallet-id');

   // todo add actual auth
   if (!req.copayerId) return res.status(403).end();

   console.log(req.copayerId, 'Request copayer id');

   next();
});

/**
 * routes
 */

app.get('/test', app.controllers.walletController.test); //tmp route just for testing

/* vaults */
app.get('/vaults', app.controllers.vaultController.getVaults);
app.get('/vault/:vaultId', app.controllers.vaultController.getVault);
app.post('/vaults/create', app.controllers.vaultController.createVault);
app.post('/vaults/update', app.controllers.vaultController.updateVault);

/* wallets */
app.get('/wallet/status', app.controllers.walletController.getStatus);
app.get('/wallet/unlock_requests', app.controllers.walletController.getUnlockRequests);
app.get('/wallet/history', app.controllers.walletController.getHistory);
app.get('/wallet/preferences', app.controllers.walletController.getPreferences);
app.post('/wallet/create', app.controllers.walletController.createWallet);
app.post('/wallet/import', app.controllers.walletController.importWallet);
app.post('/wallet/set_preferences', app.controllers.walletController.setPreferences);

/* transactions */
app.post('/transactions/broadcast', app.controllers.transactionController.broadcast);

/* referrals */
app.get('/referrals/', app.controllers.referralController.getReferral);
app.post('/referrals/send', app.controllers.referralController.sendReferral);

/* rates */
app.get('/rates', app.controllers.rateController.getRates);

/* fees */
app.get('/fees', app.controllers.feeController.getFeeLevels);

/* community */
//todo consider if we should use separate endpoints or just getCommunityInfo method
app.get('/community/anv', app.controllers.communityController.getAnv);
app.get('/community/rewards', app.controllers.communityController.getRewards);
app.get('/community/size', app.controllers.communityController.getCommunitySize);
app.get('/community', app.controllers.communityController.getCommunityInfo);

/* address */
app.get('/address', app.controllers.addressController.getAddressInfo);

module.exports = app;