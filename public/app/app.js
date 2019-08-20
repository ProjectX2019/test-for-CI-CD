var app = angular.module( 'ProjectX', ['ui.router', 'moment-picker'] );


app.directive('autofocus', ['$document', function($document) {
    return {
        link: function($scope, $element, attrs) {
            setTimeout(function() {
                $element[0].focus();
            }, 100);
        }
    };
}]);


app.config(function ($stateProvider, $urlRouterProvider, $locationProvider){
    var mainRoute = {
        name: 'main',
        url: '/',
        templateUrl: 'app/components/main/main.html',
        controller: 'mainController',
        resolve: {
            getServices: function($http){
                return $http.post('/main/getServices', { headers: { 'Content-Type': 'application/json' }})        
            }
        },
    }

    var profileRoute = {
        name: 'profile',
        url: '/profile',
        templateUrl: 'app/components/profile/profile.html',
        controller: 'profileController'
    }    

    $stateProvider.state(mainRoute);
    $stateProvider.state(profileRoute);    

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
})
