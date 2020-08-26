app.controller('instruments-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.instrumentType = $routeParams.type;
    $scope.instrumentsLoading = true;
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
      $scope.instrumentsLoading = false;
    })
  }])