let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/home', {
            template: 'home.html',
            controller: 'app-controller'

        })
        .when('/instruments', {
            template: 'instruments.html',
            controller: 'app-controller'
        })
}])

app.controller('app-controller', ['$scope','$http',($scope,$http) => {
    $scope.message = "hello";
    $scope.instruments = [];
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data)=>{
        $scope.instruments=data;
        console.log($scope.instruments.data);
    })
}])