app.directive('propertyMap', propertyMap)

function propertyMap(mapsInit) {
  return {
      restrict: 'E',
      scope: {
          mapId: '@id', // map ID
          lat: '@',     // latitude
          long: '@'     // longitude
      },
      link: function(scope) {
          // Simple check
          console.log(scope.mapId, scope.lat, scope.long);
          // Check if latitude and longitude are specified
          if ( angular.isDefined(scope.lat) && angular.isDefined(scope.long) ) {
              
              // Initialize the map
              var initialize = function() {
                  
                  var location = new google.maps.LatLng(scope.lat, scope.long);
                  
                  var mapOptions = {
                      zoom: 12,
                      center: location
                  };
                  
                  var map = new google.maps.Map(document.getElementById(scope.mapId), mapOptions);
                  
                  new google.maps.Marker({
                      position: location,
                      map: map
                  });
              };
              // Loads google map script
              mapsInit.mapsInitialized.then(function () {
                  // Promised resolved
                  initialize();
              }, function () {
                  // Promise rejected
              });
          }
      }
  };

}