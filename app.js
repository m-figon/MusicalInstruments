let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
  $routeProvider
    .when('/home', {
      templateUrl: "views/home.html"
    })
    .when('/instruments/:type', {
      templateUrl: 'views/instruments.html'
    })
    .when('/instruments/:type/:id', {
      templateUrl: 'views/details.html'
    })
    .when('/cart', {
      templateUrl: "views/cart.html"
    })
    .when('/ordering', {
      templateUrl: "views/ordering.html"
    })
    .when('/orders', {
      templateUrl: "views/orders.html"
    })
    .otherwise({
      redirectTo: '/home'
    })
}])

app.controller('app-controller', ['$scope', '$http', ($scope, $http) => {
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
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
    $scope.users = data.data;
    console.log($scope.users);
  })
  $scope.$on('$viewContentLoaded', function () {
    $scope.loading = false;
  });
  $scope.loginShow = (value) => {
    $scope.login = value;
  }
  $scope.registerShow = (value) => {
    $scope.register = value;
  }
  $scope.deleteItem = (value) => {
    $scope.cart.splice(value, 1);
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
      $scope.users = data.data;
      for (let item of $scope.users) {
        if (item.account === $scope.logedAc) {
          $scope.logedUser = item;
        }
      }
      $http.put('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users/' + $scope.logedUser.id, {
        account: $scope.logedUser.account,
        email: $scope.logedUser.email,
        password: $scope.logedUser.password,
        cart: $scope.cart,
        orders: $scope.logedUser.orders,
        id: $scope.logedUser.id
      }).then(() => {
        $scope.refreshData();
      })
    })

  }
  $scope.refreshData = () => {
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
      $scope.users = data.data;
      let cart;
      console.log($scope.users);
      for (let item of $scope.users) {
        if (item.account === $scope.logedAc) {
          $scope.logedUser = item;
          $scope.cart = item.cart;
          $scope.orders = item.orders;
          $scope.cartSum = 0;
          console.log($scope.cart);
          for (let elem of $scope.cart) {
            $scope.cartSum += parseFloat(elem.price);
          }
        }
      }
    })
  }
  $scope.loginFunc = (value) => {
    $scope.logedAc = value;
    $scope.refreshData();
  }
  $scope.addToCart = (value, e) => {
    console.log(value);
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
      $scope.users = data.data;
      let cart;
      for (let item of $scope.users) {
        if (item.account === $scope.logedAc) {
          $scope.logedUser = item;
          $scope.cart = item.cart;
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
      }).then(() => {
        $scope.refreshData();
        if (e) {
          e.target.style.animation = "rotate 3s";
        }
      })
    })
  }
}])

app.constant("moment", moment);

