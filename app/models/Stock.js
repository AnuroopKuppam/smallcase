// app/models/bear.js

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var StockSchema = new Schema({
	name: String,
	trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trades' }]
})

module.exports = mongoose.model('Stock',StockSchema);
