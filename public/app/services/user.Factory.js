app.factory('userFactory', userFactory);
userFactory.$inject = ['$http', '$q', 'authFactory']

function userFactory ($http, $q, authFactory) {

    var userFactory = {}

    userFactory.Service_GetProfile =                Service_GetProfile
    userFactory.Service_PageHeaderUpdate =          Service_PageHeaderUpdate
    userFactory.getServiceCategory =                getServiceCategory
    userFactory.Service_EmailAdd =                  Service_EmailAdd
    userFactory.Service_EmailDelete =               Service_EmailDelete
    userFactory.Service_EmailUpdate =               Service_EmailUpdate
    userFactory.Service_PhoneNumberAdd =            Service_PhoneNumberAdd
    userFactory.Service_PhoneNumberUpdate =         Service_PhoneNumberUpdate
    userFactory.Service_PhoneNumberDelete =         Service_PhoneNumberDelete
    userFactory.Service_AddressAdd =                Service_AddressAdd
    userFactory.Service_AddressDelete =             Service_AddressDelete
    userFactory.Service_AddressWorkingHoursSave =   Service_AddressWorkingHoursSave
    userFactory.Service_WebsiteAdd =                Service_WebsiteAdd
    userFactory.Service_WebsiteDelete =             Service_WebsiteDelete
    userFactory.Service_WebsiteUpdate =             Service_WebsiteUpdate
    userFactory.Service_PageDescriptionUpdate =     Service_PageDescriptionUpdate
    userFactory.User_UpdateUserFirstName =          User_UpdateUserFirstName
    userFactory.User_UpdateLastName =               User_UpdateLastName
    userFactory.User_UpdateBirthdate =              User_UpdateBirthdate
    userFactory.Service_FileUpload =                Service_FileUpload
    userFactory.Service_ImagelDelete =              Service_ImagelDelete
    userFactory.Service_PriceListItemSave =         Service_PriceListItemSave
    userFactory.Service_PriceListItemDelete =       Service_PriceListItemDelete


    return userFactory;
    
    function Service_GetProfile(){
        var token = authFactory.getUserToken()

        if( !token.token ){
            var deferred = $q.defer();
            r = {
                success: false
            }
            deferred.resolve(r);
            return deferred.promise;
        }                
        else {
            return $http.post('/profile/Service_GetProfile', token, { headers: { 'Content-Type': 'application/json' }})
        } 
    } 
    
    function Service_PageHeaderUpdate(newPageDetails){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            newPageDetails: newPageDetails
        }
        return $http.post('/profile/Service_PageHeaderUpdate', data, { headers: { 'Content-Type': 'application/json' }})
    }

    function Service_PageDescriptionUpdate(newPageDescription){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            newPageDescription: newPageDescription
        }
        return $http.post('/profile/Service_PageDescriptionUpdate', data, { headers: { 'Content-Type': 'application/json' }})
    }

    function Service_EmailAdd(newEmail){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            newEmail: newEmail.value,
            isShownInServiceCard: newEmail.isShownInServiceCard            
        }
        return $http.post('/profile/Service_EmailAdd', data, { headers: { 'Content-Type': 'application/json' }})
    }    

    function Service_EmailDelete(email){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            emailID: email.emailID
        }
        return $http.post('/profile/Service_EmailDelete', data, { headers: { 'Content-Type': 'application/json' }})
    }  

    function Service_EmailUpdate(emailID){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            emailID: emailID
        }       
        return $http.post('/profile/Service_EmailUpdate', data, { headers: { 'Content-Type': 'application/json' }})
    }     

    function Service_PhoneNumberAdd(newPhoneNumber){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            newPhoneNumber: newPhoneNumber.value,
            isShownInServiceCard: newPhoneNumber.isShownInServiceCard
        }
        return $http.post('/profile/Service_PhoneNumberAdd', data, { headers: { 'Content-Type': 'application/json' }})
    }    

    function Service_PhoneNumberUpdate(phone){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            phoneID: phone.phoneID,
            isShownInServiceCard: phone.isShownInServiceCard
        }
        return $http.post('/profile/Service_PhoneNumberUpdate', data, { headers: { 'Content-Type': 'application/json' }})
    }  

    function Service_PhoneNumberDelete(phone){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            phoneID: phone.phoneID,
        }
        return $http.post('/profile/Service_PhoneNumberDelete', data, { headers: { 'Content-Type': 'application/json' }})
    }  

    function getServiceCategory () {
        return $http.post('/main/getServiceCategory', { headers: { 'Content-Type': 'application/json' }})
    }

    function Service_AddressAdd (address) {
        var token = authFactory.getUserToken()
        data = {
            token: token,
            address: address,
        }
        return $http.post('/profile/Service_AddressAdd', data, { headers: { 'Content-Type': 'application/json' }})        
     
    }

    function Service_AddressDelete(address){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            addressID: address.addressID,
        }
        return $http.post('/profile/Service_AddressDelete', data, { headers: { 'Content-Type': 'application/json' }})
    }      

    function Service_AddressWorkingHoursSave(workingHours){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            workingHoursID: workingHours.workingHoursID,
            workingHours: workingHours,
        }
        return $http.post('/profile/Service_AddressWorkingHoursSave', data, { headers: { 'Content-Type': 'application/json' }})
    }     

    function Service_WebsiteAdd(newWebsite){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            newWebsite: newWebsite.value,
            isShownInServiceCard: newWebsite.isShownInServiceCard
        }
        return $http.post('/profile/Service_WebsiteAdd', data, { headers: { 'Content-Type': 'application/json' }})
    }

    function Service_WebsiteDelete(webiste){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            websiteID: webiste.websiteID,
        }
        return $http.post('/profile/Service_WebsiteDelete', data, { headers: { 'Content-Type': 'application/json' }})
    }      

    function Service_WebsiteUpdate(website){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            websiteID: website.websiteID,
            isShownInServiceCard: website.isShownInServiceCard
        }
        return $http.post('/profile/Service_WebsiteUpdate', data, { headers: { 'Content-Type': 'application/json' }})
    }






    function Service_PriceListItemSave(priceListItem){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            priceListItem: priceListItem,
        }
        return $http.post('/profile/Service_PriceListItemSave', data, { headers: { 'Content-Type': 'application/json' }})
    }     

    function Service_PriceListItemDelete(priceListItemID){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            priceListItemID: priceListItemID,
        }
        return $http.post('/profile/Service_PriceListItemDelete', data, { headers: { 'Content-Type': 'application/json' }})        
    }








    function User_UpdateUserFirstName(userFirstName){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            firstName: userFirstName
        }
        return $http.post('/profile/User_UpdateUserFirstName', data, { headers: { 'Content-Type': 'application/json' }})        
    }

    function User_UpdateLastName(userLastName){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            lastName: userLastName
        }
        return $http.post('/profile/User_UpdateLastName', data, { headers: { 'Content-Type': 'application/json' }})        
    }

    function User_UpdateBirthdate(userBirthDate){
        var token = authFactory.getUserToken()
        data = {
            token: token,
            userBirthDate: userBirthDate
        }
        return $http.post('/profile/User_UpdateBirthdate', data, { headers: { 'Content-Type': 'application/json' }})        
    }    

    function Service_FileUpload(file){
        var token = authFactory.getUserToken()
        var u_s = authFactory.getUserServiceID()
        
        var fd = new FormData()
        fd.append('file', file.upload)
        fd.append('token', JSON.stringify(token))
        fd.append('u_s', JSON.stringify(u_s))

        return $http.post('/profile/upload', fd, { headers: { 'Content-Type': undefined, 'path': u_s.u_s }} )
    }
    
    function Service_ImagelDelete(imageID) {
        var token = authFactory.getUserToken()
        data = {
            token: token,
            imageID: imageID
        }
        return $http.post('/profile/Service_ImagelDelete', data, { headers: { 'Content-Type': 'application/json' }})            
    }
    
}

