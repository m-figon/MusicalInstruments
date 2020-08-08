let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/home', {
            templateUrl: "views/home.html"
        })
        .when('/instruments/:type', {
            templateUrl: 'views/instruments.html'
            })
        .otherwise({
          redirectTo: '/home'
        })
}])

app.controller('app-controller', ['$scope','$http',($scope,$http) => {
    $scope.message = "hello";
}])

app.controller('instrument-controller', ['$scope','$routeParams','$http',($scope,$routeParams,$http) => {
    $scope.instrumentType = $routeParams.type;
    console.log($scope.instrumentType);
    $scope.instruments = [];
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data)=>{
        $scope.instruments=data;
        console.log($scope.instruments.data);
    })
}])
