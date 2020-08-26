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
        $scope.registerInit();
        $scope.refreshData();
        alert('user created');
      })
    }
  }
}])