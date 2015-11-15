//Used for making changes to trades includes, adding, removing and updating trades.

var trade_ctrl = angular.module('trade_ctrl', []);

trade_ctrl.controller('Trade_Ctrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from  Trade_controller");

    //Simple routine for displaying stocks.
    var showStocks = function() {
    	$http.get('http://localhost:8080/api/stocks').then(function(res) {
            var temp = res.data;
            var names = [];
            var trades = [];

            $scope.stocks = [];
            $scope.add = {
                type: "BUY",
                quantity: "10",
                cost: "500"
            };

            for(var i=0;i<temp.length;i++) {
                for(var j=0;j<temp[i].trades.length;j++) {
                    trades.push({"id":temp[i].trades[j]._id, "type":temp[i].trades[j].type, "cost":temp[i].trades[j].cost, "quantity": temp[i].trades[j].quantity});
                }
                $scope.stocks.push({"id":temp[i]._id, "name" : temp[i].name, "trades":trades});
                trades = [];
            }
        });
    };
    showStocks();

    //Add a trade by calling a backend route, see api.js
    $scope.addTrade = function(id) {
        console.log("Inside addTrade");
        var str = 'http://localhost:8080/api/stocks/'+id+'/'+$scope.add.type+'/'+$scope.add.quantity+'/'+$scope.add.cost;
        console.log(str);
        $http.post(str).then (function(res) {
            console.log("inside http post request")
            var temp = res.data;
            console.log(temp);
        });
        $scope.add.type = $scope.add.quantity = $scope.add.cost = "";
    }

    // Deletes a trade by calling a backend route, see api.js
    // We need the trade id to delete the trade, this is obtained after the user clicks 
    // delete for a particular trade.
    $scope.deleteTrade = function(id) {
        var str = 'http://localhost:8080/api/deleteTrade/'+id;
        $http.post(str).then (function(res) {
            console.log("Inside deleteTrade");
        });
    }

    // Works similar to above.
    $scope.updateTrade = function(id) {
        var str = 'http://localhost:8080/api/updateTrade/'+id+'/'+$scope.add.type+'/'+$scope.add.quantity+'/'+$scope.add.cost;
        $http.post(str).then (function(res) {
            console.log("Inside UpdateTrade");
        });
    }
}]);
