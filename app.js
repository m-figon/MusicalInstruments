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
        .otherwise({
            redirectTo: '/home'
        })
}])

app.controller('app-controller', ['$scope', '$http', ($scope, $http) => {
    $scope.message = "hello";
}])



app.controller('instruments-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.instrumentType = $routeParams.type;
    console.log($scope.instrumentType);
    $scope.filter = "none";
    $scope.search = "Search...";
    $scope.focusFunc = () =>{
      if($scope.search==='Search...'){
        $scope.search="";
      }
    };
    $scope.blurFunc = () =>{
      if($scope.search===''){
        $scope.search="Search...";
      }
    };
    $scope.selectFunc = () =>{
      if($scope.filter==='none'){
        console.log('none');
      }else if($scope.filter==='a-z'){
        console.log('a-z');
      }else if($scope.filter==='z-a'){
        console.log('z-a');
      }else if($scope.filter==='inc'){
        console.log('inc');
      }else if($scope.filter==='dec'){
        console.log('dec');
      }
    };
    $scope.instruments = [];
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
      let tmp = data.data;
      for(let item of tmp){
        if(item.instrument===$scope.instrumentType){
          $scope.instruments.push(item);
        }
      }
        console.log($scope.instruments);
    })
}])

app.controller('instrument-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.instrumentType = $routeParams.type;
    console.log($scope.instrumentType);
    $scope.instrument = null;
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
        let tmp = data.data;
        console.log(tmp);
        for(let item of tmp){
            if(item.id===parseInt($routeParams.id)){
                $scope.instrument=item;
            }
        }
        console.log($scope.instrument);
    })
}])
