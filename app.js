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
      })
    })

  }
  $scope.loginFunc = (value) => {
    $scope.logedAc = value;
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
      let users = data.data;
      console.log(users);
      for (let item of users) {
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
      })
    })
  }
}])


app.controller('login-controller', ['$scope', '$http', ($scope, $http) => {
  $scope.users = [];
  $scope.account = "Account Name";
  $scope.password = "Password";
  $scope.type = "text";
  $scope.loginP = false;
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
    $scope.users = data.data;
    console.log($scope.users);
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
        $scope.loginP = false;
        $scope.loginFunc($scope.account);
        console.log($scope.logedAc);
        correctFlag = true;
        $scope.account = "Account Name";
        $scope.password = "Password";
        $scope.type = "text";
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

app.controller('ordering-controller', ['$scope', '$http','moment', ($scope, $http,moment) => {
  $scope.part = "1";
  $scope.email = "Email Address";
  $scope.city = "City Name";
  $scope.street = "Street Name";
  $scope.phone = "Phone Number";
  $scope.emailP = false;
  $scope.cityP = false;
  $scope.streetP = false;
  $scope.phoneP = false;
  $scope.changingPart = (value) => {
    $scope.part = value;
  }
  $scope.finishOrder = () => {
    let correctFlag = true;
    if (!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) ===
      null)) {
      $scope.emailP = false;
    } else {
      correctFlag = false;
      $scope.emailP = true;
    }
    if (!($scope.city.match(/^[a-zA-Z0-9\.\-_]{4,15}$/) === null)) {
      $scope.cityP = false;
    } else {
      correctFlag = false;
      $scope.cityP = true;
    }
    if (!($scope.street.match(/^[a-zA-Z0-9\.\-_]{4,15}$/) === null)) {
      $scope.streetP = false;
    } else {
      correctFlag = false;
      $scope.streetP = true;
    }
    if (!($scope.phone.match(/^[0-9]{9}$/) === null)) {
      $scope.phoneP = false;
    } else {
      correctFlag = false;
      $scope.phoneP = true;
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
        let tmpPrice=0;
        for(let item of $scope.cart){
          tmpPrice+=parseFloat(item.price);
        }
        orders.push({ date: tmpMoment, email: $scope.email, price: tmpPrice, city: $scope.city, street: $scope.street, phone: $scope.phone, content: $scope.cart });
        $http.put('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users/' + logedUser.id, {
          account: logedUser.account,
          email: logedUser.email,
          password: logedUser.password,
          cart: [],
          orders: orders,
          id: logedUser.id
        })
      })
      alert($scope.logedAc + 'order finished');
    }
  }
  $scope.focusFunc = (e) => {
    if (e.target.value === "Email Address" || e.target.value === "City Name" || e.target.value === "Street Name" || e.target.value === "Phone Number") {
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
  $scope.signUp = () => {
    let correctFlag = true;
    if (!($scope.account.match(/^[a-zA-Z0-9\.\-_]{4,10}$/) === null)) {
      $scope.accountP = false;
    } else {
      correctFlag = false;
      $scope.accountP = true;
    }
    if (!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) ===
      null)) {
      $scope.emailP = false;
    } else {
      correctFlag = false;
      $scope.emailP = true;
    }
    if (!($scope.password1.match(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/
    ) === null)) {
      $scope.password1P = false;
    } else {
      correctFlag = false;
      $scope.password1P = true;
    }
    if ($scope.password1 === $scope.password2 &&
      !(
        $scope.password1.match(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/
        ) === null
      )) {
      $scope.password2P = false;
    } else {
      correctFlag = false;
      $scope.password2P = true;
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
        $scope.account = "Account Name";
        $scope.email = "Email Address";
        $scope.password1 = "Password";
        $scope.password2 = "Confirm Password";
        $scope.type1 = "text";
        $scope.type2 = "text";
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
    if ($scope.filter === 'none') {
      console.log('none');
      $scope.order = "";
    } else if ($scope.filter === 'a-z') {
      console.log('a-z');
      $scope.order = "name";
    } else if ($scope.filter === 'z-a') {
      console.log('z-a');
      $scope.order = "-name";
    } else if ($scope.filter === 'inc') {
      console.log('inc');
      $scope.order = "price";
    } else if ($scope.filter === 'dec') {
      console.log('dec');
      $scope.order = "-price";
    }
  };
  $scope.typeFunc = () => {
    if ($scope.type === 'none') {
      console.log('none');
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
    console.log($scope.instruments);
    console.log($scope.types);
    $scope.tmpInstruments = $scope.instruments.slice();
  })
}])

app.controller('instrument-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
  $scope.instrumentType = $routeParams.type;
  console.log($scope.instrumentType);
  $scope.instrument = null;
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
    let tmp = data.data;
    console.log(tmp);
    for (let item of tmp) {
      if (item.id === parseInt($routeParams.id)) {
        $scope.instrument = item;
      }
    }
    console.log($scope.instrument);
  })
}])
