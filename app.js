let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/home', {
            template: 'index.html',
            controller: 'app-controller'

        })
        .when('/instruments/guitars', {
            template: 'views/instruments.html',
            controller: 'app-controller'
        })
        .otherwise({
          redirectTo: '/home'
        })
}])

app.controller('app-controller', ['$scope','$http',($scope,$http) => {
    $scope.message = "hello";
}])

app.controller('instrument-controller', ['$scope','$http',($scope,$http) => {
    $scope.instruments = [];
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data)=>{
        $scope.instruments=data;
        console.log($scope.instruments.data);
    })
}])
