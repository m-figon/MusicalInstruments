app.controller('login-controller', ['$scope', '$http', ($scope, $http) => {
  $scope.loginInit = () => {
    $scope.account = "Account Name";
    $scope.password = "Password";
    $scope.type = "text";
    $scope.loginP = false;
  }
  $scope.loginInit();
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