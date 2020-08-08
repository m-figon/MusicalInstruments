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
    $scope.instruments = [];
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
        $scope.instruments = data;
        console.log($scope.instruments.data);
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
