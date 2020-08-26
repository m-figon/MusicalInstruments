"use strict";

app.controller('instrument-controller', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  $scope.detailsLoading = true;
  $scope.instrumentType = $routeParams.type;
  console.log($scope.instrumentType);
  $scope.instrument = null;
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then(function (data) {
    var tmp = data.data;
    console.log(tmp);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = tmp[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if (item.id === parseInt($routeParams.id)) {
          $scope.instrument = item;
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

    console.log($scope.instrument);
    $scope.detailsLoading = false;
  });
}]);