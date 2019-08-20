app.controller('profileController', function($scope, $timeout, $state, userFactory, authFactory, geoLocationFactory, systemFactory, $window){

    $scope.profile      = {};    
    $scope.fullAddress  = { value: '', lat: '', lng:'' };
    $scope.system       = {};  
    $scope.file         = {};

    $scope.newPhoneNumber   = { isShownInServiceCard: false, value: '' };
    $scope.newEmail         = { isShownInServiceCard: false, value: '' };    
    $scope.newWebsite       = { isShownInServiceCard: false, value: '' };      

    /*$scope.newGender = {}*/

    $scope.workingHours = {
        sunday:{'isOpened': false},
        monday:{'isOpened': false},
        tuesday:{'isOpened': false},
        wednesday:{'isOpened': false},
        thursday:{'isOpened': false},
        friday:{'isOpened': false},
        saturday:{'isOpened': false}
    };    

    function setOptions() {
        toastr.options.positionClass = "toast-top-right";
        toastr.options.closeButton = true;
        toastr.options.showMethod = 'slideDown';
        toastr.options.hideMethod = 'slideUp';
        toastr.options.newestOnTop = false;
        toastr.options.progressBar = true;
    };
    setOptions();


    function notificationCenter(msg, status) {
        if(status === 'info'){
            toastr.info(msg);
        }
        if(status === 'warning'){
            toastr.warning(msg);
        }
        if(status === 'success'){
            toastr.success(msg);
        }
        if(status === 'error'){
            toastr.error(msg);
        }

        if(status === 'clear'){
            toastr.clear();
        }         
    };

    /*           GET PROFILE
    -------------------------------------*/     
    function getProfile(){
        userFactory.Service_GetProfile()
        .then(function(res){
            if(!res.data.profile){
                var msg = res.data.msg
                $scope.fn_logOut()
            } else {
                var msg = res.data.msg
                $scope.profile = JSON.parse(res.data.profile)       
                console.log($scope.profile)
            }        
            if(msg) {
                console.log(msg)
            }
        })        
    }
    getProfile()
    /*-------------------------------------*/



    /*           GET GENDER
    -------------------------------------*/     
    function getGender(){
        systemFactory.System_GetGender()
        .then(function(res){
            if(res.status === 200){
                $scope.system.gender = JSON.parse(res.data.gender)
            } else {
                console.log('failed to load gender: ' + res.data)
            }
        })
    }   
    getGender()
    /*-------------------------------------*/



    /*           LOGOUOT
    -------------------------------------*/   
    $scope.fn_logOut = function(){
        authFactory.logout()
        .then(function(res){
            console.log(res.data.msg)
            if(res.status == 200){
                $state.go('main', {}, {reload: true})
            } else {
                console.log('Logout error')
            }
        }) 
    }
    /*-------------------------------------*/



    /*           IMAGE
    -------------------------------------*/    
    $scope.uploadFile = function(){ 
        $scope.uploading = true;
        userFactory.Service_FileUpload($scope.file)
        .then(function(res){
            if(res.data.success){
                $scope.uploading = false;            
                msg = res.data.msg;
                notificationCenter(msg, 'success')  
                $scope.file = {};   
                $scope.thumbnail = {};
                
                if(!$scope.profile.serviceImage){
                    $scope.profile.serviceImage = new Array();
                } 
                newImage = JSON.parse(res.data.imageList)
                $scope.profile.serviceImage.push({
                    imageID: newImage.imageID,
                    imageName: newImage.imageName,
                    imageFullPath: newImage.imageFullPath
                })            
            } else {
                $scope.uploading = false;
                msg = res.data.msg;
                $scope.file = {};                
                notificationCenter(msg, 'warning')                  
            }
        })
    }
   
    $scope.photoChanged = function(files) {
        if(files.length > 0 && files[0].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e){
                $timeout(function(){
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                })
            }
        } else {
            $scope.thumbnail = {};
        }     
    }    

    $scope.fn_viewFullImage = function(imageFullPath) {
        $scope.largeImagePath = imageFullPath
        $('#imageView').modal()        
    }

    $scope.fn_deleteImage = function($index, imageID){
        userFactory.Service_ImagelDelete(imageID)
        .then(function(res){
            if(res.data.success) {                
                $scope.profile.serviceImage.splice($index, 1);                                                                                           
            }
            msg = res.data.msg
            notificationCenter(msg, 'warning')    
        })   

    }
    /*-------------------------------------*/


    
    /*           PAGE HEADER           
    -------------------------------------*/    

    $scope.fn_editPageHeader = function(pageHeader){
        console.log('edit page header')
        $scope.editPageHeader = true
        $scope.newPageHeader = angular.copy(pageHeader)
    }

    $scope.fn_savePageHeader = function(pageHeader){
        console.log('update page header')
        if( pageHeader.length > 32 ) {
            msg = 'Page header can not be longer than 32 characters';
            notificationCenter(msg, 'warning')                       
            return           
        } if (pageHeader == '') {
            msg = 'Page header can not be blank'
            notificationCenter(msg, 'warning')             
        } else {
            userFactory.Service_PageHeaderUpdate(pageHeader)
            .then(function(res){
                if(res.status === 200) {                      
                    $scope.profile.pageDetails.pageHeader = res.data.pageHeader
                    msg = res.data.msg                    
                }
                notificationCenter(msg, 'info')                                    
                $scope.editPageHeader = false                           
            }) 
        }           
    }
    /*-------------------------------------*/    



    /*           PAGE DESCRIPTION
    -------------------------------------*/    
    $scope.fn_editPageDescription = function(OldPageDescription){
        console.log('edit page description')
        $scope.editPageDescription = true
        $scope.newPageDescription = angular.copy(OldPageDescription)
    }

    $scope.fn_savePageDescription = function(newPageDescription) {
        console.log('save page description')
        if( newPageDescription.length > 512 ) {
            msg = 'Page description can not be longer than 512 chars'
            notificationCenter(msg, 'warning')          
            return                          
        } if (newPageDescription == '') {
            $scope.editPageDescription = false       
        } else {
            userFactory.Service_PageDescriptionUpdate(newPageDescription)
            .then(function(res){
                if(res.status === 200) {                      
                    $scope.profile.pageDetails.pageDescription = res.data.pageDescription
                    msg = res.data.msg                                          
                }           
                notificationCenter(msg, 'info')                                    
                $scope.editPageDescription = false                 
            })
        }
    }
    /*-------------------------------------*/



    /*           EMAIL           
    -------------------------------------*/
    $scope.fn_serviceEmailAdd = function(){
        $('.modal').modal('show');      
        userFactory.Service_EmailAdd($scope.newEmail)
        .then(function(res){
            if(res.status === 200) {
                if(res.data.success){
                    email = JSON.parse(res.data.emailAddress)
                    if(!$scope.profile.emailAddress){
                        $scope.profile.emailAddress = new Array();
                    } 
                    $scope.profile.emailAddress.push({
                        emailID: email.emailID,
                        emailAddress : email.emailAddress,
                        isShownInServiceCard : email.isShownInServiceCard
                    })                                              
                }   
                $('.modal').modal('hide');                                 
                msg = res.data.msg
                $scope.newEmail.value = ''
                notificationCenter(msg, 'info') 
                $('#newEmail').collapse('hide')             
            }    
        })  
    }

    $scope.fn_serviceEmailDelete = function(email){
        userFactory.Service_EmailDelete(email)
        .then(function(res){
            if(res.data.success) {
                msg = res.data.msg
                var index = $scope.profile.emailAddress.indexOf(email);
                $scope.profile.emailAddress.splice(index, 1);     
                notificationCenter(msg, 'warning')                                        
            }  
        })         
    }

    $scope.fn_serviceEmailUpdate = function(emailID){       
        console.log('update email')
        userFactory.Service_EmailUpdate(emailID)
        .then(function(res){
            if(res.status === 200) {
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
            }
        })
    }
    /*-------------------------------------*/

    

    /*           PHONE           
    -------------------------------------*/

    $scope.fn_phoneAdd = function(){
        $('.modal').modal('show');
        userFactory.Service_PhoneNumberAdd($scope.newPhoneNumber)
        .then(function(res){                
            if(res.status === 200) {
                if(res.data.success){
                    newPhone = JSON.parse(res.data.phoneNumber)
                    if(!$scope.profile.phoneNumber){
                        $scope.profile.phoneNumber = new Array();
                    } 
                    $scope.profile.phoneNumber.push({
                        phoneID: newPhone.phoneID,
                        phoneNumber : newPhone.phoneNumber,
                        isShownInServiceCard : newPhone.isShownInServiceCard
                    })                                              
                }   
                $scope.newPhoneNumber.value = ''
                $('.modal').modal('hide');                       
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
                $('#newPhone').collapse('hide') 
            }                              
        })      
    }
    
    $scope.fn_phoneUpdate = function(phone){        
        userFactory.Service_PhoneNumberUpdate(phone)
        .then(function(res){
            if(res.status === 200) {
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
            }
        })
    }

    $scope.fn_phoneRemove = function(phone){
        userFactory.Service_PhoneNumberDelete(phone)
        .then(function(res){
            if(res.data.success) {
                msg = res.data.msg
                var index = $scope.profile.phoneNumber.indexOf(phone);
                $scope.profile.phoneNumber.splice(index, 1);     
                notificationCenter(msg, 'warning')                                        
            }         
        })
    }
    /*-------------------------------------*/



    /*           LOCATION           
    -------------------------------------*/

    geoLocationFactory.getCurrentLocation()
    .then(function(res){
        coordinates = res.coords
        //console.log(res.coords)

        var center = {
            lat: coordinates.latitude,
            lng: coordinates.longitude
        }
        
    }) 

    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        country: 'long_name'
    };

    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('inputNewAddress'), 
        {types: ['geocode']}
    );    

    google.maps.event.addListener(autocomplete, 'place_changed', function(){
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Please provide full address for input: '" + place.name + "'");
            return;
        } else {
            $scope.fullAddress.lat = place.geometry.location.lat()
            $scope.fullAddress.lng = place.geometry.location.lng()
        }        

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm [addressType]) {
                var val = place.address_components[i][componentForm [addressType]];
                $scope.fullAddress[addressType] = val
            }
        }   
    })
    
    $scope.fn_serviceAddressAdd = function(){        
        $('.modal').modal('show');
        console.log($scope.fullAddress)
        userFactory.Service_AddressAdd($scope.fullAddress)
        .then(function(res){            
            if(res.status === 200) {
                if(res.data.success){
                    newServiceAddress = JSON.parse(res.data.serviceAddress)
                    if(!$scope.profile.serviceAddress){
                        $scope.profile.serviceAddress = new Array();
                    } 
                    $scope.profile.serviceAddress.push({
                        addressID: newServiceAddress.addressID,
                        country: newServiceAddress.country,
                        city: newServiceAddress.city,
                        street: newServiceAddress.street,
                        number: newServiceAddress.number,
                        mapID: newServiceAddress.mapID,
                        workingHours: newServiceAddress.workingHours
                    })                                              
                }   
                $('.modal').modal('hide');                      
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
                $('#newAddress').collapse('hide')      
                $scope.fullAddress.value = '';
            } 
        })         
    }    

    $scope.fn_serviceAddressRemove = function(address){
        userFactory.Service_AddressDelete(address)
        .then(function(res){
            if(res.data.success) {
                msg = res.data.msg
                var index = $scope.profile.serviceAddress.indexOf(address);
                $scope.profile.serviceAddress.splice(index, 1);     
                msg = res.data.msg
                notificationCenter(msg, 'warning')                                        
                $scope.msg = ''          
            }         
        })        
    }
    /*-------------------------------------*/


    /*           WORKING HOURS           
    -------------------------------------*/

    $scope.fn_workingHoursSave = function(workingHours){

        if(!workingHours.isOpen) {
            workingHours.closeAt = null
            workingHours.openAt = null
        }
        userFactory.Service_AddressWorkingHoursSave(workingHours)
        .then(function(res){
            if(res.status === 200) {
                if(res.data.success){
                    for (var i = 0; i < $scope.profile.serviceAddress.length; i++) {
                        if ($scope.profile.serviceAddress[i].workingHours.workingHoursID === res.data.workingHours.workingHoursID) {       
                            $scope.profile.serviceAddress[i].workingHours.closeAt = res.data.workingHours.closeAt
                            $scope.profile.serviceAddress[i].workingHours.openAt = res.data.workingHours.openAt
                            $scope.profile.serviceAddress[i].workingHours.isOpen = res.data.workingHours.isOpen
                            $scope.profile.serviceAddress[i].workingHours.dayOfWeek = res.data.workingHours.dayOfWeek
                        }
                    } 
                }
                msg = res.data.msg             
                notificationCenter(msg, 'info')     
                $scope.workingHours = {}                                   
            }
        })
    }
    /*-------------------------------------*/


    /*           WEBSITES           
    -------------------------------------*/    

    $scope.fn_serviceWebsiteAdd = function(){
        $('.modal').modal('show');
        userFactory.Service_WebsiteAdd($scope.newWebsite)
        .then(function(res){                
            if(res.status === 200) {
                if(res.data.success){
                    newWebsite = JSON.parse(res.data.website)
                    if(!$scope.profile.website){
                        $scope.profile.website = new Array();
                    } 
                    $scope.profile.website.push({
                        websiteID: newWebsite.websiteID,
                        websiteAddress : newWebsite.websiteAddress,
                        isShownInServiceCard : newWebsite.isShownInServiceCard
                    })                                              
                }   
                $('.modal').modal('hide');                       
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
                $('#newWebsite').collapse('hide') 
            }                              
        })      
    }

    $scope.fn_websiteRemove = function(website){
        userFactory.Service_WebsiteDelete(website)
        .then(function(res){
            if(res.data.success) {
                msg = res.data.msg
                var index = $scope.profile.website.indexOf(website);
                $scope.profile.website.splice(index, 1);     
                notificationCenter(msg, 'warning')                                        
            }         
        })
    }    

    $scope.fn_websiteUpdate = function(website){        
        userFactory.Service_WebsiteUpdate(website)
        .then(function(res){
            if(res.status === 200) {
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
            }
        })
    }
    /*-------------------------------------*/    



    /*           User details           
    -------------------------------------*/ 

    $scope.fn_saveUserFirstName = function() {
        userFactory.User_UpdateUserFirstName($scope.profile.userDetails.firstName)
        .then(function(res){
            if(res.status === 200) {
                $scope.profile.userDetails.firstName = res.data.firstName
                $scope.editUserFirstName = false
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
            }
        })
    }

    $scope.fn_saveUserLastName = function() {
        userFactory.User_UpdateLastName($scope.profile.userDetails.lastName)
        .then(function(res){
            if(res.status === 200) {
                $scope.profile.userDetails.lastName = res.data.lastName
                $scope.editUserLastName = false
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
            }
        })
    }    

    $scope.fn_saveUserBirthdate = function() {
        userFactory.User_UpdateBirthdate($scope.profile.userDetails.birthDate)
        .then(function(res){
            if(res.status === 200) {               
                $scope.profile.userDetails.birthDate = res.data.birthDate  
                $scope.editBirthdate = false
                msg = res.data.msg
                notificationCenter(msg, 'info')                                        
            }
        })
    }    
    /*-------------------------------------*/



    /*           Price list           
    -------------------------------------*/ 

    $scope.fn_priceListItemEdit = function(){
        $scope.priceListItemEdit = true
    }

    $scope.fn_priceListItemCancel = function(){
        $scope.priceListItemEdit = false
        $scope.priceListItem = {}
    }    

    $scope.fn_priceListItemSave = function(){
        var newPriceListItem = {
            name: $scope.priceListItem.name,
            price: $scope.priceListItem.price,
            comment: $scope.priceListItem.comment
        }
        userFactory.Service_PriceListItemSave(newPriceListItem)
        .then(function(res){
            if(res.status === 200){
                if(res.data.success){
                    if(!$scope.profile.servicePriceList){
                        $scope.profile.servicePriceList = new Array();
                    }                       
                    newServicePriceList = JSON.parse(res.data.servicePriceList)
                    $scope.profile.servicePriceList.push({
                        priceListItemID: newServicePriceList.priceListItemID,
                        priceListItemName: newServicePriceList.priceListItemName,
                        priceListItemPrice: newServicePriceList.priceListItemPrice,
                        priceListItemComment: newServicePriceList.priceListItemComment
    
                    })                    
                }
                $scope.priceListItemEdit = false
                $scope.priceListItem = {}
            }
        })
    }

    $scope.fn_priceListItemDelete = function(PriceListItem){
        userFactory.Service_PriceListItemDelete(PriceListItem.priceListItemID)
        .then(function(res){
            if(res.status === 200){
                if(res.data.success) {
                    msg = res.data.msg
                    var index = $scope.profile.servicePriceList.indexOf(PriceListItem);
                    $scope.profile.servicePriceList.splice(index, 1);     
                    notificationCenter(msg, 'warning')                                        
                }   
            }      
        })
    }
    /*-------------------------------------*/

    $scope.fn_goToMain = function(){
        $state.go('main', {}, { reload: true })        
    }






})