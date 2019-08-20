app.factory('authFactory', authFactory);
authFactory.$inject = ['$http', '$q']

function authFactory ($http, $q) {
    var authFactory = {}

    authFactory.register = register
    authFactory.login = login
    authFactory.logout = logout
    authFactory.setUserToken = setUserToken
    authFactory.getUserToken = getUserToken
    authFactory.IsLoggedIn = IsLoggedIn
    authFactory.clearSession = clearSession
    authFactory.getUserServiceID = getUserServiceID

    return authFactory;

    function register(newUser){
        return $http.post('/profile/register', newUser, { headers: { 'Content-Type': 'application/json' }});
    }

    function login(user){
        return $http.post('/profile/login', user, { headers: { 'Content-Type': 'application/json' }});
    }    

    function clearSession(){
        localStorage.clear()        
    }

    function logout(){
        token = getUserToken()
        clearSession()
        return $http.post('/profile/logout', token, { headers: { 'Content-Type': 'application/json' }});
        
    }    

    function setUserToken(data){
        localStorage.setItem('token', data.token)
        localStorage.setItem('u_s', data.u_s)
    }

    function getUserToken(){
        return {
            token: localStorage.getItem('token')
        }
    }

    function getUserServiceID(){
        return {
            u_s: localStorage.getItem('u_s')
        }
    }    

    function IsLoggedIn(){
        token = getUserToken()
        return $http.post('/profile/IsLoggedIn', token, { headers: { 'Content-Type': 'application/json' }});
    }

}
