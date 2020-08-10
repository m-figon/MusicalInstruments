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
    $scope.login = false;
    $scope.loginFunc = (value) =>{
      $scope.login = value;
      console.log($scope.login);
    }
}])

app.controller('login-controller', ['$scope', '$http', ($scope, $http) => {
  $scope.users =[];
  $scope.account="Account Name";
  $scope.password="Password";
  $scope.type="text";
  $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/users').then((data) => {
      $scope.users = data.data;
      console.log($scope.users);
    })
  $scope.focusFunc = (e,condition) =>{
    if(e.target.value==="Account Name" || e.target.value==="Password"){
      e.target.value="";
      if(condition){
        $scope.type="password";
      }
    }
  }
  $scope.blurFunc = (e,condition,value) =>{
    if(e.target.value===""){
      e.target.value=value;
      if(condition){
        $scope.type="text";
      }
    }
  }
  $scope.signIn = () =>{
    let correctFlag = false;
    for(let item of $scope.users){
      if(item.account===$scope.account && item.password===$scope.password){
        alert('correct user data');
        correctFlag=true;
        $scope.account="Account Name";
        $scope.password="Password";
        $scope.type="text";
      }
    }
    if(!correctFlag){
        alert('wrong user data');
    }
  }
}])

app.controller('instruments-controller', ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.instrumentType = $routeParams.type;
    console.log($scope.instrumentType);
    $scope.filter = "none";
    $scope.search = "Search...";
    $scope.order = "";
    $scope.type = "none";
    $scope.types = [];
    $scope.tmpInstruments;
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
        $scope.order="";
      }else if($scope.filter==='a-z'){
        console.log('a-z');
        $scope.order="name";
      }else if($scope.filter==='z-a'){
        console.log('z-a');
        $scope.order="-name";
      }else if($scope.filter==='inc'){
        console.log('inc');
        $scope.order="price";
      }else if($scope.filter==='dec'){
        console.log('dec');
        $scope.order="-price";
      }
    };
    $scope.typeFunc = () =>{
      if($scope.type==='none'){
        console.log('none');
        $scope.instruments=$scope.tmpInstruments.slice();
      }
      for(let elem of $scope.types){
        console.log(elem);
        if($scope.type===elem){
          console.log(elem);
          $scope.instruments=[];
          for(let item of $scope.tmpInstruments){
            if(item.type===elem){
              $scope.instruments.push(item);
            }
          }
        }
      }
    };
    $scope.instruments = [];
    $http.get('https://rocky-citadel-32862.herokuapp.com/MusicalInstruments/instruments').then((data) => {
      let tmp = data.data;
      for(let item of tmp){
        if(item.instrument===$scope.instrumentType){
          $scope.instruments.push(item);
          let flag=true;
                for(let elem of $scope.types){
                  if(item.type===elem){
                    flag=false;
                  }
                }
                if(flag){
                  $scope.types.push(item.type);
                }
        }
      }
        console.log($scope.instruments);
        console.log($scope.types);
        $scope.tmpInstruments=$scope.instruments.slice();
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
