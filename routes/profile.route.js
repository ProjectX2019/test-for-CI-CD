const express           = require('express');
const router            = express.Router();
const DBConfig          = require('../config/database');
const sql               = require('mssql')
const multer            = require('multer')
const fs                = require('fs');
const uploadDir         = './public/uploads/'

var uploadFile = function(serviceFolder) {
    var storage = multer.diskStorage({ 
        destination: function (req, file, cb) {
            fullFilePath = uploadDir + '/' + serviceFolder + '/'
            if (!fs.existsSync(fullFilePath)){
                fs.mkdirSync(fullFilePath);
            }

            cb(null, fullFilePath);
        },
        filename: function (req, file, cb) {
            if ( !file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/) ) {
                var err = new Error();
                err.code = 'filetype'
                return cb(err)
            } else {
                cb(null, Date.now() + '_' + file.originalname)
            }        
        }
    });
    var upload  = multer({ 
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 10
        }
    }).single('file');

    return upload 

}    

router.post('/upload', function(req, res) {   
    serviceFolder = req.headers.path

    var fileUpload = uploadFile(serviceFolder);
    fileUpload(req, res, function(err) {     
        
        var token = JSON.parse(req.body.token)
        var u_s = JSON.parse(req.body.u_s)
        var imageName = req.file.filename
        var rootPath = './uploads'

        if(err){
            if (err.code === 'LIMIT_FILE_SIZE'){
                res.json({ success: false, msg: 'File size is too large. Max limit is 10MB' })
            } else if (err.code === 'filetype'){
                res.json({ success: false, msg: 'File type is invalid. Must be JPG|JPEG|PNG' })                
            } else {
                res.json({ success: false, msg: 'File was not able to upload ' + err })                                
            }
        } else {
            if (!req.file){
                res.json({ success: false, msg: 'No file was selected' })                  
            } else {            
                var dbConn = new sql.ConnectionPool(DBConfig)        
                dbConn.connect()
                    .then(function(){
                        var request = new sql.Request(dbConn)
                        request
                            .input('TOKEN', sql.VarChar(1000), token.token)
                            .input('RootPath', sql.VarChar(2048), rootPath)
                            .input('ServiceFolder', sql.VarChar(2048), '/' + u_s.u_s)
                            .input('ImageName', sql.VarChar(2048), imageName)
                                .execute('usp_Service_ImageUpload')
                                .then(function(data){
                                    res.json(data.recordset[0]);
                                    dbConn.close();
                                }).catch(function (err){
                                    console.log(err);
                                    dbConn.close();
                                })
                    }).catch(function (err) {
                        console.log(err);
                    }); 
            }
        }
    })        
})    





router.post('/register', function(req, res) {
    var userEmail = req.body.email
    var userPassword = req.body.password        

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()    
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('UserEmail', sql.VarChar(1024), userEmail)
                .input('UserPassword', sql.VarChar(1024), userPassword)
                    .execute('sys_Register')
                    .then(function(data){
                        res.json(data.recordset[0]);
                        dbConn.close();
                    }).catch(function (err){                        
                        console.log(err);
                        dbConn.close();
                    })
        }).catch(function (err) {
            console.log(err);
        });
});


router.post('/login', function(req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('UserEmail', sql.VarChar(1024), userEmail)
                .input('UserPassword', sql.VarChar(1024), userPassword)
                    .execute('sys_Login')
                    .then(function(data){
                        res.json(data.recordset[0]);
                        dbConn.close();
                    }).catch(function (err){
                        console.log(err);
                        dbConn.close();
                    })
        }).catch(function (err) {
            console.log(err);
        });       
});


router.post('/logout', function(req, res) {
    var token = req.body.token;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)
                    .execute('sys_Logout')
                    .then(function(data){
                        res.json(data.recordset[0]);
                        dbConn.close();
                    }).catch(function (err){
                        console.log(err);
                        dbConn.close();
                    })
        }).catch(function (err) {
            console.log(err);
        });       
});


router.post('/Service_GetProfile', function(req, res) {
    var token = req.body.token;
    
    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                    .execute('usp_Service_GetProfile')                
                        .then(function(data){
                            profile = data.recordset[0]
                            res.json(profile)     
                            console.log(profile)                                                                                  
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });    
});


router.post('/IsLoggedIn', function(req, res) {
    var token = req.body.token;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                    .execute('sys_IsLoggedIn')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });    
});


router.post('/Service_PageHeaderUpdate', function(req, res) {
    var token = req.body.token.token;
    var newPageDetails = req.body.newPageDetails;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PageHeader', sql.NVarChar(256), newPageDetails)    
                    .execute('usp_Service_PageHeaderUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_PageDescriptionUpdate', function(req, res) {
    var token = req.body.token.token;
    var newPageDescription = req.body.newPageDescription;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PageDescription', sql.NVarChar(4000), newPageDescription)    
                    .execute('usp_Service_PageDescriptionUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_EmailAdd', function(req, res) {
    var token = req.body.token.token;
    var newEmail = req.body.newEmail;
    var isShownInServiceCard = req.body.isShownInServiceCard

    console.log(req.body)

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('EmailAddress', sql.NVarChar(256), newEmail)    
                .input('IsShownInServiceCard', sql.Char(5), isShownInServiceCard)    
                    .execute('usp_Service_EmailAdd')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_EmailDelete', function(req, res) {
    var token = req.body.token.token;
    var emailID = req.body.emailID;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('EmailID', sql.BigInt, emailID)    
                    .execute('usp_Service_EmailDelete')                
                        .then(function(data){
                            console.log(data.recordset[0])
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_EmailUpdate', function(req, res) {
    var token = req.body.token.token;
    var emailID = req.body.emailID;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('EmailID', sql.BigInt, emailID)    
                    .execute('usp_Service_EmailUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_PhoneNumberAdd', function(req, res) {
    var token = req.body.token.token;
    var phoneNumber = req.body.newPhoneNumber
    var isShownInServiceCard = req.body.isShownInServiceCard

    console.log(req.body)

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PhoneNumber', sql.VarChar(256), phoneNumber)    
                .input('IsShownInServiceCard', sql.Char(5), isShownInServiceCard)    
                    .execute('usp_Service_PhoneNumberAdd')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_PhoneNumberUpdate', function(req, res) {
    var token = req.body.token.token;
    var phoneID = req.body.phoneID
    var isShownInServiceCard = req.body.isShownInServiceCard

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PhoneID', sql.BigInt, phoneID)    
                .input('IsShownInServiceCard', sql.Bit, isShownInServiceCard)    
                    .execute('usp_Service_PhoneNumberUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_PhoneNumberDelete', function(req, res) {
    var token = req.body.token.token;
    var phoneID = req.body.phoneID

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PhoneID', sql.BigInt, phoneID)    
                    .execute('usp_Service_PhoneNumberDelete')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_AddressAdd', function(req, res) {
    var address = req.body.address
    var token = req.body.token.token;

    var country = address.country
    var city = address.locality
    var street = address.route
    var number = address.street_number
    var lat = address.lat
    var lng = address.lng

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('Country', sql.VarChar(256), country)    
                .input('City', sql.VarChar(256), city)    
                .input('Street', sql.VarChar(256), street)    
                .input('Number', sql.Int, number)   
                .input('Latitude', sql.Decimal(18,10), lat)   
                .input('Longitude', sql.Decimal(18,10), lng)    
                    .execute('usp_Service_AddressAdd')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_AddressDelete', function(req, res) {
    var token = req.body.token.token;
    var addressID = req.body.addressID

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('AddressID', sql.BigInt, addressID)    
                    .execute('usp_Service_AddressDelete')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});










router.post('/Service_AddressWorkingHoursSave', function(req, res) {
    var token = req.body.token.token;
    var workingHoursID = req.body.workingHoursID;
    var openAt = req.body.workingHours.openAt;
    var closeAt = req.body.workingHours.closeAt;
    var dayOfweek = req.body.workingHours.dayOfWeek;
    var isOpen = req.body.workingHours.isOpen;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token) 
                .input('WorkingHoursID', sql.BigInt, workingHoursID)    
                .input('OpenAt', sql.VarChar(6), openAt)     
                .input('CloseAt', sql.VarChar(6), closeAt)     
                .input('DayOfWeek', sql.VarChar(16), dayOfweek)     
                .input('IsOpen', sql.Bit, isOpen)     
                    .execute('usp_Service_AddressWorkingHoursSave')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});













router.post('/Service_WebsiteAdd', function(req, res) {
    var token = req.body.token.token;
    var websiteAddress = req.body.newWebsite
    var isShownInServiceCard = req.body.isShownInServiceCard

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('WebsiteAddress', sql.VarChar(256), websiteAddress)    
                .input('IsShownInServiceCard', sql.Char(5), isShownInServiceCard)    
                    .execute('usp_Service_WebsiteAdd')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_WebsiteDelete', function(req, res) {
    var token = req.body.token.token;
    var websiteID = req.body.websiteID;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('WebsiteID', sql.BigInt, websiteID)    
                    .execute('usp_Service_WebsiteDelete')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/Service_WebsiteUpdate', function(req, res) {
    var token = req.body.token.token;
    var websiteID = req.body.websiteID;
    var isShownInServiceCard = req.body.isShownInServiceCard

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('WebsiteID', sql.BigInt, websiteID)   
                .input('IsShownInServiceCard', sql.Bit, isShownInServiceCard)     
                    .execute('usp_Service_WebsiteUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                            
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });
});


router.post('/User_UpdateUserFirstName', function(req, res) {
    var token = req.body.token.token;
    var userFirstName = req.body.firstName;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('FirstName', sql.VarChar(256), userFirstName)   
                    .execute('usp_User_FirstNameUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                    
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });        
});


router.post('/User_UpdateLastName', function(req, res) {
    var token = req.body.token.token;
    var userLastName = req.body.lastName;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('LastName', sql.VarChar(256), userLastName)   
                    .execute('usp_User_LastNameUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                        
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });        
});

router.post('/User_UpdateBirthdate', function(req, res) {
    var token = req.body.token.token;
    var userBirthDate = req.body.userBirthDate;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('BirthDate', sql.Date, userBirthDate)   
                    .execute('usp_User_BirthdateUpdate')                
                        .then(function(data){
                            res.json(data.recordset[0]);                        
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });        
});

router.post('/Service_ImagelDelete', function(req, res) {
    var token = req.body.token.token;
    var imageID = req.body.imageID;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('ImageID', sql.BigInt, imageID)   
                    .execute('usp_Service_ImageDelete')                
                        .then(function(data){
                            res.json(data.recordset[0]);                        
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });        
});

router.post('/Service_PriceListItemSave', function(req, res) {
    var token = req.body.token.token;
    var priceListItemName = req.body.priceListItem.name;
    var priceListItemPrice = req.body.priceListItem.price;
    var priceListItemComment = req.body.priceListItem.comment;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PriceListItemName', sql.VarChar(255), priceListItemName)   
                .input('PriceListItemPrice', sql.Float, priceListItemPrice)   
                .input('PriceListItemComment', sql.VarChar(1024), priceListItemComment)   
                    .execute('usp_Service_PriceListAdd')                
                        .then(function(data){
                            res.json(data.recordset[0]);                        
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });        
});

router.post('/Service_PriceListItemDelete', function(req, res) {
    var token = req.body.token.token;
    var priceListItemID = req.body.priceListItemID;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token)    
                .input('PriceListItemID', sql.BigInt, priceListItemID)   
                    .execute('usp_Service_PriceListItemDelete')                
                        .then(function(data){
                            res.json(data.recordset[0]);                        
                            dbConn.close();
                        }).catch(function (err){
                            res.json(err)
                            console.log(err)
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(' error ' + err);
        });        
});



function GetServiceIDByToken(token, callback) {   
    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()    
        .then(function(){
            var request = new sql.Request(dbConn)
            request
                .input('TOKEN', sql.VarChar(1000), token) 
                .input('FromServer', sql.Bit, 1) 
                    .execute('sys_GetServiceIDByToken')
                        .then(function(data){
                            const serviceID = data.recordset[0].serviceID;
                            return callback(serviceID)
                        }).catch(function (err){
                            console.log(err);
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(err);
        });
};






module.exports = router;

