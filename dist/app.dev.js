"use strict";

var app = angular.module('app', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: "views/home.html"
  }).when('/instruments/:type', {
    templateUrl: 'views/instruments.html'
  }).when('/instruments/:type/:id', {
    templateUrl: 'views/details.html'
  }).when('/cart', {
    templateUrl: "views/cart.html"
  }).when('/ordering', {
    templateUrl: "views/ordering.html"
  }).when('/orders', {
    templateUrl: "views/orders.html"
  }).otherwise({
    redirectTo: '/home'
  });
}]);
app.controller('app-controller', ['$scope', '$http', function ($scope, $http) {
  console.log($scope.cart);
  $scope.login = false;
  $scope.register = false;
  $scope.logedAc = "";
  $scope.cartSum = null;
  $scope.cart = null;
  $scope.orders = null;
  $scope.logedUser = null;
  $scope.loading = true;
  $scope.users = [];
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then(function (data) {
    $scope.users = data.data;
    console.log($scope.users);
  });
  $scope.$on('$viewContentLoaded', function () {
    $scope.loading = false;
  });

  $scope.loginShow = function (value) {
    $scope.login = value;
  };

  $scope.registerShow = function (value) {
    $scope.register = value;
  };

  $scope.deleteItem = function (value) {
    $scope.cart.splice(value, 1);
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then(function (data) {
      $scope.users = data.data;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $scope.users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item.account === $scope.logedAc) {
            $scope.logedUser = item;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      $http.put('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users/' + $scope.logedUser.id, {
        account: $scope.logedUser.account,
        email: $scope.logedUser.email,
        password: $scope.logedUser.password,
        cart: $scope.cart,
        orders: $scope.logedUser.orders,
        id: $scope.logedUser.id
      }).then(function () {
        $scope.refreshData();
      });
    });
  };

  $scope.refreshData = function () {
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then(function (data) {
      $scope.users = data.data;
      var cart;
      console.log($scope.users);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = $scope.users[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (item.account === $scope.logedAc) {
            $scope.logedUser = item;
            $scope.cart = item.cart;
            $scope.orders = item.orders;
            $scope.cartSum = 0;
            console.log($scope.cart);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = $scope.cart[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var elem = _step3.value;
                $scope.cartSum += parseFloat(elem.price);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    });
  };

  $scope.loginFunc = function (value) {
    $scope.logedAc = value;
    $scope.refreshData();
  };

  $scope.addToCart = function (value, e) {
    console.log(value);
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then(function (data) {
      $scope.users = data.data;
      var cart;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = $scope.users[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var item = _step4.value;

          if (item.account === $scope.logedAc) {
            $scope.logedUser = item;
            $scope.cart = item.cart;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      cart = $scope.logedUser.cart.slice();
      cart.push(value);
      $http.put('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users/' + $scope.logedUser.id, {
        account: $scope.logedUser.account,
        email: $scope.logedUser.email,
        password: $scope.logedUser.password,
        cart: cart,
        orders: $scope.logedUser.orders,
        id: $scope.logedUser.id
      }).then(function () {
        $scope.refreshData();

        if (e) {
          e.target.style.animation = "rotate 3s";
        }
      });
    });
  };
}]);
app.constant("moment", moment);