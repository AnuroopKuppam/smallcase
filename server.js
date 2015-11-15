// server.js

//Base Setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smallcase');

//call the packages
var express = require('express');
var app	    = express();
var bodyParser = require('body-parser');
var Portfolio  = require('./app/models/Portfolio');
var Stock      = require('./app/models/Stock');
var Trades     = require('./app/models/Trades');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// All our routes will have an /api prefix
var api = require('./routes/api');
app.use('/api',api);
app.use(express.static(__dirname+'/app/public'));

// frontend routes =========================================================
// route to handle all angular requests

// Returns the holdings of the user in all his stocks. Creates a listing.
app.get('/holdings', function(req,res) {
	res.sendfile('./app/public/holdings.html');
});

// Shows all the postfolios with the stocks and the corresponding tradings that the user has done.
app.get('/portfolio', function(req,res) {
	res.sendfile('./app/public/portfolio.html');
});

//Shows a listing of stocks along with its returns for a user.
app.get('/returns', function(req,res) {
	res.sendfile('./app/public/returns.html')
});

// All trading related tasks will be here, includes, create trade, remove trade, update trade.
app.get('/addTrade', function(req,res) {
	res.sendfile('./app/public/addTrade.html');
});

app.get('/deleteTrade', function(req,res) {
	res.sendfile('./app/public/deleteTrade.html');
});

app.get('/updateTrade',function(req,res) {
	res.sendfile('./app/public/updateTrade.html');
});

app.get('*', function(req, res) {
    res.sendfile('./app/public/index.html'); // load our public/index.html file
});

app.listen(port);
console.log('the server has started on port' + port);
