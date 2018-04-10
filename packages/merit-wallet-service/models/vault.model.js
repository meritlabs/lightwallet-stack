const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    address: String,
    copayerId: { type: String, index: true },
    walletId: mongoose.Schema.Types.ObjectId,
    whitelist: [{address: String, alias: String}],
    status: String, // pending, renewing,
});

module.exports = mongoose.model('vaults', schema);