app.factory('mainFactory', mainFactory);
mainFactory.$inject = ['$http', 'userFactory', '$q']

function mainFactory ($http, $q) {
    var mainFactory = {}

    mainFactory.getServices = getServices
   
    return mainFactory;


    function getServices() {
        return $http.post('/main/getServices', { headers: { 'Content-Type': 'application/json' }})        
    }

   
}
