//AppController referenced from portfolio,holdings,returns.html

var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from  main controller");

    var portfolio = function() {
    	$http.get('http://localhost:8080/api/portfolio').then(function(res) {
    		$scope.temp = res.data;  //get the json information for portfolios
    		$scope.portfolio = [];
    		var stocks = [];
    		var trades = [];
    		var holdings = 0;
    		var buys = 0;
    		var sells = 0;
    		var avg = 0;

    		for(var i=0;i<$scope.temp.length;i++) {
    			var temp = $scope.temp[i];
    			if(temp.stocks !== null) {
    				for(var j=0;j<temp.stocks.length;j++) {
    					for(var k=0;k<temp.stocks[j].trades.length;k++) {
    						var trade = temp.stocks[j].trades[k];
    						trades.push({"name":trade.name, "cost":trade.cost,"quantity":trade.quantity, "date" : trade.date});
    					   //Compile the trades for this stock into an array.
                        }
    					for(var k=0;k<trades.length;k++) {
    						if(trades[k].name === "BUY"){
    							buys += Number(trades[k].quantity);
    							avg += Number(trades[k].quantity) * Number(trades[k].cost); 
    						}
    						else sells -= Number(trades[k].quantity);
    					}
    					holdings = buys+sells;
    					avg = avg/buys;

    					//For calculating returns
    					var initial_price = trades[0].cost;
    					var final_price = 100;
    					var cummulative_return = holdings*(final_price-initial_price);

                        //Push this stock information into the stocks array.
    					stocks.push({"name" : temp.stocks[j].name, "trades":trades, "holdings":holdings, "avg":avg, "cummulative_return" : cummulative_return});

    					//Setting everything back
    					trades = [];
    					holdings = buys = sells = avg = 0;

    				}
                    //Push all information into the scope portfolio array for us to use in .html files.
    				$scope.portfolio.push({"name" : temp.name,"stocks" : stocks});
    			}
    			stocks = [];
    		}
    	});
    };
    portfolio();
}]);
