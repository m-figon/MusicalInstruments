let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/home', {
            template: 'home.html',
            controller: 'app-controller'

        })
        .when('/guitars', {
            template: 'guitars.html',
            controller: 'app-controller'
        })
}])

app.controller('app-controller', ($scope) => {
    $scope.message = "hello";
})