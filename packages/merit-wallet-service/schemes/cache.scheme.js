const mongoose = require('mongoose');

/* super simple key-value storage */
const schema = new mongoose.Schema({
   key: {type: String, index: true, unique: true},
   value: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('caches', schema);