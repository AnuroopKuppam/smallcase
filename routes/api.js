// routes/api.js

//Base Setup
var mongoose = require('mongoose');

//call the packages
var express = require('express');
var bodyParser = require('body-parser');
var Portfolio  = require('../app/models/Portfolio');
var Stock      = require('../app/models/Stock');
var Trades     = require('../app/models/Trades');

//Declare Routes for our API.
var router = express.Router();

////////////////////Routes for Portfolio//////////////////
// Get all Portfolios
router.route('/portfolio')
	.get(function(req,res) {
		Portfolio.find(function(err,portfolio) {
			if(err) res.send(err);
		})
		.lean()
		.populate({path: 'stocks'})
		.exec(function(err,stocks) {
			if(err) res.send(err);
			var opts = {path: 'stocks.trades',
						model: 'Trades'	};
			Portfolio.populate(stocks,opts, function(err,trades) {
				if(err) res.send(err);
				res.json(trades);
			});
			console.log({message: 'Populated in /portfolio'});
		});
	});

// Create a Portfolio
router.route('/portfolio/create')
	.post(function(req,res) {
		var portfolio = new Portfolio();
		portfolio.name = req.body.name;

		portfolio.save(function(err) {
			if(err) res.send(err);
			res.json({message: 'Portfolio Created!'});
		});	
	});

// Get a particular Portfolio
router.route('/portfolio/get_portfolio')
	.post(function(req, res) {
		Portfolio.findById(req.body.portfolio_id, function(err, portfolio) {
			if(err) res.send(err);
			res.json(portfolio);
		});
	});

// Get the stocks associated with a portfolio
router.route('/portfolio/stocks')
	.post(function(req,res) {
		Portfolio.findById(req.body.portfolio_id, function(err, portfolio) {
			if(err) res.send(err);
			res.json(portfolio.stocks);
		})
	});

// To add stock to a portfolio
router.route('/portfolio/:portfolio_id/stocks/:stock_id')
	.post(function(req,res) {
		Stock.findById(req.params.stock_id,function(err, stock) {
			if(err) res.send(err);
			Portfolio.findById(req.params.portfolio_id, function(err,portfolio) {
				if(err) res.send(err);
				portfolio.stocks.push(stock);
				portfolio.save(function(err,portfolio) {
				if(err) res.send(err);
				else res.json(portfolio);
				});
			});
		});
	});


/////////Routes for Stocks/////////////////////////
router.route('/stocks')
	.post(function(req,res) {
		var stock = new Stock();
		stock.name = req.body.name;

		stock.save(function(err) {
			if(err) res.send(err);
			//res.json({message: 'Stocks Created!'});
		});
	})

	.get(function(req,res) {
		Stock.find(function(err, stock) {
			if(err) res.send(err);
			res.json(stock);
		})
		.lean()
		.populate({path : 'trades'})
		.exec( function(err,trades) {
			if(err) res.send(err);
			var opts = {path: 'trades',
						model: 'Trades'	};
			Stock.populate(trades,opts, function(err,trades) {
				if(err) res.send(err);
				//console.log(trades);
				res.json(trades);
			});
		});
	});

// Create a Trade and add to the corresponding stock
router.route('/stocks/:stock_id/:type/:quantity/:cost')
	.post(function(req, res) {
		Stock.findById(req.params.stock_id, function(err, stock) {
			if(err) res.send(err);
			if(req.params.type == "BUY") {
				var trade = new Trades();
				trade.name = "BUY";
				trade.quantity = req.params.quantity;
				trade.cost = req.params.cost;
				trade.date = new Date();
				trade.stocks = stock._id;
				trade.save(function(err, trade) {
					if(err) res.send(err);
					stock.trades.push(trade);
					stock.save(function(err,stock) {
					if(err) res.send(err);
					else res.json(stock);
					});
				});
			}
			else if(req.params.type == "SELL") {
				var trade = new Trades();
				trade.name = "SELL";
				trade.quantity = req.params.quantity;
				trade.cost = req.params.cost;
				trade.date = new Date();
				trade.stocks = stock._id;
				trade.save(function(err, trade) {
					if(err) res.send(err);
					stock.trades.push(trade);
					stock.save(function(err,stock) {
					if(err) res.send(err);
					else res.json(stock);
					});
				});
			}
		});
	});

//Delete a Trade
router.route('/deleteTrade/:trade_id')
	.post(function (req,res) {
		Trades.findById(req.params.trade_id, function(err, trade) {
			if(err) res.send(err);
		})
	.remove()
	.exec(function(err,trade) {
			if(err) res.send(err);
			else console.log("Trade Deleted");
		});
	});

//Update a Trade
router.route('/updateTrade/:trade_id/:trade_type/:trade_quantity/:trade_cost')
	.post(function (req,res) {
		Trades.findById(req.params.trade_id,function(err,trade) {
			if(err) res.send(err);
			trade.type = req.params.trade_type;
			trade.quantity = req.params.trade_quantity;
			trade.cost = req.params.trade_cost;
			trade.save(function(err,trade) {
				if(err) res.send(err);
				else {
					res.json(trade);
					console.log("Trade with id:"+trade._id+" successfully updated.");
				}
			});
		});
	});
module.exports = router;
