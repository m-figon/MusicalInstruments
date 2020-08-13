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
  $scope.addToCart = (value) => {
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
      })
    })
  }
}])


app.controller('login-controller', ['$scope', '$http', ($scope, $http) => {
  $scope.users = [];
  $scope.loading = true;
  $scope.loginInit = () => {
    $scope.account = "Account Name";
    $scope.password = "Password";
    $scope.type = "text";
    $scope.loginP = false;
  }
  $scope.loginInit();
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
    $scope.users = data.data;
    console.log($scope.users);
    $scope.loading = false;
  })
  $scope.focusFunc = (e, condition) => {
    if (e.target.value === "Account Name" || e.target.value === "Password") {
      e.target.value = "";
      if (condition) {
        $scope.type = "password";
      }
    }
  }
  $scope.blurFunc = (e, condition, value) => {
    if (e.target.value === "") {
      e.target.value = value;
      if (condition) {
        $scope.type = "text";
      }
    }
  }
  $scope.signIn = () => {
    let correctFlag = false;
    for (let item of $scope.users) {
      if (item.account === $scope.account && item.password === $scope.password) {
        $scope.loginFunc($scope.account);
        console.log($scope.logedAc);
        correctFlag = true;
        $scope.loginInit();
        $scope.loginShow(false);
        alert('correct user data');
      }
    }
    if (!correctFlag) {
      $scope.loginP = true;
      alert('wrong user data');
    }
  }
}])

app.constant("moment", moment);

app.controller('ordering-controller', ['$scope', '$http', 'moment', ($scope, $http, moment) => {
  $scope.part = "1";
  $scope.email = "Email Address";
  $scope.city = "City Name";
  $scope.street = "Street Name";
  $scope.phone = "Phone Number";
  $scope.homeNumber = "Home Number";
  $scope.postalCode = "Postal Code";
  $scope.emailP = false;
  $scope.cityP = false;
  $scope.streetP = false;
  $scope.phoneP = false;
  $scope.homeNumberP = false;
  $scope.postalCodeP = false;

  $scope.changingPart = (value) => {
    $scope.part = value;
  }

  $scope.ifFunc = (condition, p) => {
    if (condition) {
      eval(p + " = false");
      return true;
    } else {
      eval(p + " = true");
      return false;
    }
  }
  $scope.finishOrder = () => {
    let correctFlag = true;
    let matchingValues = [!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) ===
      null), !($scope.city.match(/^[a-zA-Z0-9\.\-_]{4,15}$/) === null), !($scope.postalCode.match(/^[0-9/-]{6}$/) === null), !($scope.street.match(/^[a-zA-Z0-9\.\-_]{4,15}$/) === null), !($scope.homeNumber.match(/^[0-9\/]{1,5}$/) === null), !($scope.phone.match(/^[0-9]{9}$/) === null)];
    let pValues = ['$scope.emailP', '$scope.cityP', '$scope.postalCodeP', '$scope.streetP', '$scope.homeNumberP', '$scope.phoneP'];
    for (let i = 0; i < matchingValues.length; i++) {
      correctFlag = $scope.ifFunc(matchingValues[i], pValues[i]);
    }
    if (correctFlag) {
      let logedUser;
      $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
        let users = data.data;
        let orders;
        console.log(users);
        for (let item of users) {
          if (item.account === $scope.logedAc) {
            logedUser = item;
          }
        }
        orders = logedUser.orders.slice();
        let tmpMoment = moment().format('L');
        let tmpPrice = 0;
        for (let item of $scope.cart) {
          tmpPrice += parseFloat(item.price);
        }
        orders.push({ date: tmpMoment, email: $scope.email, price: tmpPrice, city: $scope.city, postalCode: $scope.postalCode, street: $scope.street, homeNumber: $scope.homeNumber, phone: $scope.phone, content: $scope.cart });
        $http.put('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users/' + logedUser.id, {
          account: logedUser.account,
          email: logedUser.email,
          password: logedUser.password,
          cart: [],
          orders: orders,
          id: logedUser.id
        }).then(() => {
          $scope.refreshData();
          alert($scope.logedAc + 'order finished');
        })
      })
    }
  }
  $scope.focusFunc = (e) => {
    if (e.target.value === "Email Address" || e.target.value === "City Name" || e.target.value === "Street Name" || e.target.value === "Phone Number" || e.target.value === "Home Number" || e.target.value === "Postal Code") {
      e.target.value = "";
    }
  }
  $scope.blurFunc = (e, value) => {
    if (e.target.value === "") {
      e.target.value = value;
    }
  }
}])

app.controller('register-controller', ['$scope', '$http', ($scope, $http) => {
  $scope.registerInit = () => {
    $scope.account = "Account Name";
    $scope.email = "Email Address";
    $scope.password1 = "Password";
    $scope.password2 = "Confirm Password";
    $scope.type1 = "text";
    $scope.type2 = "text";
    $scope.accountP = false;
    $scope.emailP = false;
    $scope.password1P = false;
    $scope.password2P = false;
  }
  $scope.registerInit();
  $scope.focusFunc = (e, condition) => {
    if (e.target.value === "Account Name" || e.target.value === "Password" || e.target.value === "Email Address" || e.target.value === "Confirm Password") {
      e.target.value = "";
      if (condition === 1) {
        $scope.type1 = "password";
      } else if (condition === 2) {
        $scope.type2 = "password";
      }
    }
  }
  $scope.blurFunc = (e, condition, value) => {
    if (e.target.value === "") {
      e.target.value = value;
      if (condition === 1) {
        $scope.type1 = "text";
      } else if (condition === 2) {
        $scope.type2 = "text";
      }
    }
  }
  $scope.ifFunc = (condition, p) => {
    if (condition) {
      eval(p + " = false");
      return true;
    } else {
      eval(p + " = true");
      return false;
    }
  }
  $scope.signUp = () => {
    let correctFlag = true;
    let matchingValues = [!($scope.account.match(/^[a-zA-Z0-9\.\-_]{4,10}$/) === null), !($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) ===
      null), !($scope.password1.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/
      ) === null), $scope.password1 === $scope.password2 &&
    !(
      $scope.password1.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/
      ) === null
    )];
    let pValues = ['$scope.accountP', '$scope.emailP', '$scope.password1P', '$scope.password2P'];
    for (let i = 0; i < matchingValues.length; i++) {
      correctFlag = $scope.ifFunc(matchingValues[i], pValues[i]);
    }
    if (correctFlag) {
      $http.post('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users', {
        account: $scope.account,
        email: $scope.email,
        password: $scope.password1,
        cart: [],
        orders: []
      }).then(() => {
        alert('user created');
        $scope.registerInit();
      })
    }
  }
}])

app.controller('instruments-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
  $scope.instrumentType = $routeParams.type;
  console.log($scope.instrumentType);
  $scope.filter = "none";
  $scope.search = "Search...";
  $scope.order = "";
  $scope.type = "none";
  $scope.types = [];
  $scope.loading = true;
  $scope.tmpInstruments;
  $scope.focusFunc = () => {
    if ($scope.search === 'Search...') {
      $scope.search = "";
    }
  };
  $scope.blurFunc = () => {
    if ($scope.search === '') {
      $scope.search = "Search...";
    }
  };
  $scope.selectFunc = () => {
    switch ($scope.filter) {
      case 'none': $scope.order = ""; break;
      case 'a-z': $scope.order = "name"; break;
      case 'z-a': $scope.order = "-name"; break;
      case 'inc': $scope.order = "price"; break;
      case 'dec': $scope.order = "-price"; break;
    }
  };
  $scope.typeFunc = () => {
    if ($scope.type === 'none') {
      $scope.instruments = $scope.tmpInstruments.slice();
    }
    for (let elem of $scope.types) {
      console.log(elem);
      if ($scope.type === elem) {
        console.log(elem);
        $scope.instruments = [];
        for (let item of $scope.tmpInstruments) {
          if (item.type === elem) {
            $scope.instruments.push(item);
          }
        }
      }
    }
  };
  $scope.instruments = [];
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
    let tmp = data.data;
    for (let item of tmp) {
      if (item.instrument === $scope.instrumentType) {
        $scope.instruments.push(item);
        let flag = true;
        for (let elem of $scope.types) {
          if (item.type === elem) {
            flag = false;
          }
        }
        if (flag) {
          $scope.types.push(item.type);
        }
      }
    }
    $scope.tmpInstruments = $scope.instruments.slice();
    $scope.loading = false;
  })
}])

app.controller('instrument-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
  $scope.instrumentType = $routeParams.type;
  console.log($scope.instrumentType);
  $scope.instrument = null;
  $scope.loading = true;
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
    let tmp = data.data;
    console.log(tmp);
    for (let item of tmp) {
      if (item.id === parseInt($routeParams.id)) {
        $scope.instrument = item;
      }
    }
    console.log($scope.instrument);
    $scope.loading = false;
  })
}])
