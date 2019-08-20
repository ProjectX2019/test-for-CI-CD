app.controller( 'mainController', function($scope, $state, $timeout, authFactory, mainFactory, geoLocationFactory, getServices, $window ) {    
  
    $scope.services = JSON.parse(getServices.data.services)
    console.log($scope.services)

    $scope.registerMessage = ''    
    $scope.loginMessage = ''    
    $scope.IsLoggedIn = false

    $scope.fn_autofocus = function(){
        $('.modal').on('shown.bs.modal', function() {
            $(this).find('[autofocus]').focus();
        });          
    }

    $scope.fn_autofocus()        


    authFactory.IsLoggedIn()            
    .then(function(res){
        if(res.data.success){
            $scope.IsLoggedIn = true
        } else {
            console.log('not logged in - ' + res.data.msg)
        }
    })     


    $scope.fn_goToProfile = function(){
        $state.go('profile', {}, { reload: true });                                                             
    }


    $scope.fn_toggleLogin = function(x){
        if (!x){
            $scope.toggleLogin = false
            $('#login-tab').tab('show')
        } else {
            $scope.toggleLogin = true
            $('#register-tab').tab('show')
        }
    }


    $scope.fn_clearRegisterForm = function(){
        $scope.newUser = {};
        $scope.registerMessage='';
    }


    $scope.fn_clearLoginForm = function(){
        $scope.user = {};
        $scope.loginMessage='';
    }        


    $scope.fn_register = function(newUser){
        if($scope.newUser.confirmPassword != $scope.newUser.password){
            $scope.registerMessage = 'Passwords must match'
        } else {        
            authFactory.register(newUser)
            .then(function(res){
                if (!res.data.success){
                    $scope.registerMessage = res.data.msg
                } else {                    
                    authFactory.setUserToken(res.data)
                    $scope.registerMessage = res.data.msg             
                    $timeout(function() {
                        $scope.fn_clearRegisterForm()         
                        $('#entryFormModal').modal('toggle')  
                        $state.go('profile', {}, {reload: true});                                                             
                    }, 2000);                             
                                                            
                }
            })
        }                 
    }     

    $scope.fn_login = function(user){
        authFactory.login(user)
        .then(function(res){
            if (res.data.success){
                authFactory.setUserToken(res.data)                   
                $scope.loginMessage = res.data.msg                        
                $timeout(function() {
                    $scope.fn_clearLoginForm()     
                    $('#entryFormModal').modal('toggle')                          
                    $state.go('profile', {} , {reload: true});                                                                 
                }, 2000);                                                                 
            } else {      
                $scope.loginMessage = res.data.msg
                $timeout(function() {
                    $scope.fn_clearLoginForm()            
                    }, 5000);                                                       
            }
        })
    }


    geoLocationFactory.getCurrentLocation()
    .then(function(res){
        coordinates = res.coords
        //console.log(res.coords)

        var center = {
            lat: coordinates.latitude,
            lng: coordinates.longitude
        }
        
        var latlng = new google.maps.LatLng(center.lat, center.lng);
    }) 





    $scope.initialize = function(){
        for( var i = 0; i < $scope.services.length; i++ ){
            if (  typeof $scope.services[i].serviceAddress != "undefined" ) {

                var map_id = 'map_' + $scope.services[i].serviceID

                $scope.map = new google.maps.Map(document.getElementById(map_id), {
                    zoom: 8,
                    center: {lat: 31.0461, lng: 34.8516}
                });                

                var s = []
                s.push($scope.services[i].serviceAddress)

                for( var j = 0; j < s.length; j++ ){

                    var a = s[j] 

                    for( l=0; l < a.length ; l ++) {
                        if ( a[l].lat && a[l].lng ){
                            var myLatLng = {
                                lat: a[l].lat, 
                                lng: a[l].lng
                            };        
                           
                            var marker = new google.maps.Marker({
                                position: myLatLng,
                                map: $scope.map,
                                title: 'Hello World!'
                            }); 
                        }                
                    }
                }
            } 
        }                   
    }

    google.maps.event.addDomListener(window, 'load', $scope.initialize)
    
    
    // $window.location.reload();
})

