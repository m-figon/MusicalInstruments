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