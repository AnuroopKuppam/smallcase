// app/models/bear.js

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PortfolioSchema = new Schema({
	name: String,
	stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }]
})

module.exports = mongoose.model('Portfolio',PortfolioSchema);
