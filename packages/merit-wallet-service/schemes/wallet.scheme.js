const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    rootAddress: String,
    unlocked: Boolean,
    parentAddress: String,
    copayerId: String,
    //todo mix in copayer data

    //preferences:
    email: String
});

module.exports = mongoose.model('wallets', schema);