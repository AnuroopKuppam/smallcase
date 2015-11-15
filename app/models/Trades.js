// app/models/bear.js

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TradeSchema = new Schema({
	name: String,
	quantity : Number,
	cost	: Number,
	date	: Date,
	stocks: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }
})

module.exports = mongoose.model('Trades',TradeSchema);
