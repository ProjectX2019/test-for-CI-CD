app.factory('geoLocationFactory', geoLocationFactory);
geoLocationFactory.$inject = ['$q', '$window', '$timeout']

function geoLocationFactory ($q, $window, $timeout) {
    var geoLocationFactory = {}

    geoLocationFactory.getCurrentLocation = getCurrentLocation
    
    return geoLocationFactory;

    function getCurrentLocation() {
        var deferred;
        var promiseTimeout = $timeout(function() {
            deferred.reject(1); // return 1 if browser waited for user input for more than timeout delay
        }, 3000);
        
        deferred = $q.defer();
        
        if(!$window.navigator.geolocation) { // check if geoLocation is not supported by browser
            $timeout.cancel(promiseTimeout);
            deferred.reject(false); // return false if geoLocation is not supported
        }
        else { // geoLocation is supported
            $window.navigator.geolocation.getCurrentPosition(function(position) {
                $timeout.cancel(promiseTimeout);
                return deferred.resolve(position);
            }, function(error) {
                $timeout.cancel(promiseTimeout);
                return deferred.reject(error.code || 1);
            });
        }

        return deferred.promise;
    }
}


// app.factory('mapsInit', mapsInitFactory)
// function mapsInitFactory($window, $q) {
//     //Google's url for async maps initialization accepting callback function
//     var asyncUrl = "https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&key=AIzaSyB1uM_C0vjyWcUrDj2Jq9JLXSU79FdsIlc&callback=", mapsDefer = $q.defer();
        
//     //Callback function - resolving promise after maps successfully loaded
//     $window.googleMapsInitialized = mapsDefer.resolve; // removed ()
    
//     //Async loader
//     var asyncLoad = function(asyncUrl, callbackName) {
//         var script = document.createElement('script');
//         //script.type = 'text/javascript';
//         script.src = asyncUrl + callbackName;
//         document.body.appendChild(script);
//     };
    
//     //Start loading google maps
//     asyncLoad(asyncUrl, 'googleMapsInitialized');
    
//     //Usage: Initializer.mapsInitialized.then(callback)
//     return {
//         mapsInitialized : mapsDefer.promise
//     };
// }