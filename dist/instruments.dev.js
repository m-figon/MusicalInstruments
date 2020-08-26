"use strict";

app.controller('instruments-controller', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  $scope.instrumentType = $routeParams.type;
  $scope.instrumentsLoading = true;
  console.log($scope.instrumentType);
  $scope.filter = "none";
  $scope.search = "Search...";
  $scope.order = "";
  $scope.type = "none";
  $scope.types = [];
  $scope.tmpInstruments;

  $scope.focusFunc = function () {
    if ($scope.search === 'Search...') {
      $scope.search = "";
    }
  };

  $scope.blurFunc = function () {
    if ($scope.search === '') {
      $scope.search = "Search...";
    }
  };

  $scope.selectFunc = function () {
    switch ($scope.filter) {
      case 'none':
        $scope.order = "";
        break;

      case 'a-z':
        $scope.order = "name";
        break;

      case 'z-a':
        $scope.order = "-name";
        break;

      case 'inc':
        $scope.order = "price";
        break;

      case 'dec':
        $scope.order = "-price";
        break;
    }
  };

  $scope.typeFunc = function () {
    if ($scope.type === 'none') {
      $scope.instruments = $scope.tmpInstruments.slice();
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = $scope.types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var elem = _step.value;
        console.log(elem);

        if ($scope.type === elem) {
          console.log(elem);
          $scope.instruments = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = $scope.tmpInstruments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var item = _step2.value;

              if (item.type === elem) {
                $scope.instruments.push(item);
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
  };

  $scope.instruments = [];
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then(function (data) {
    var tmp = data.data;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = tmp[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var item = _step3.value;

        if (item.instrument === $scope.instrumentType) {
          $scope.instruments.push(item);
          var flag = true;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = $scope.types[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var elem = _step4.value;

              if (item.type === elem) {
                flag = false;
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

          if (flag) {
            $scope.types.push(item.type);
          }
        }
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

    $scope.tmpInstruments = $scope.instruments.slice();
    $scope.instrumentsLoading = false;
  });
}]);