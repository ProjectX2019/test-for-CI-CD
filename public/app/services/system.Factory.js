app.factory('systemFactory', systemFactory);
mainFactory.$inject = ['$http', '$q', 'authFactory']

function systemFactory ($http, $q, authFactory) {
    var systemFactory = {}

    systemFactory.System_GetGender = System_GetGender
    systemFactory.GetServiceIDByTokenID = GetServiceIDByTokenID
   
    return systemFactory;


    function System_GetGender() {

        token = authFactory.getUserToken()

        if( !token.token ){
            var deferred = $q.defer();
            r = {
                success: false,
                msg: 'No token'
            }
            deferred.resolve(r);
            return deferred.promise;
        }                
        else {
            return $http.post('/system/System_GetGender', token, { headers: { 'Content-Type': 'application/json' }})     
        }                   
    }

    function GetServiceIDByTokenID() {
        token = authFactory.getUserToken()

        if( !token.token ){
            var deferred = $q.defer();
            r = {
                success: false,
                msg: 'No token'
            }
            deferred.resolve(r);
            return deferred.promise;
        }                
        else {        
            return $http.post('/system/GetServiceIDByTokenID', token, { headers: { 'Content-Type': 'application/json' }})     
        }

    }
   
}
