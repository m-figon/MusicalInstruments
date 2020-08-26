

app.controller('instrument-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.detailsLoading = true;
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
      $scope.detailsLoading = false;
    })
  }])