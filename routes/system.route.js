const express = require('express');
const router = express.Router();
const DBConfig = require('../config/database');
const sql = require('mssql')

router.post('/System_GetGender', function(req, res) {   
    var token = req.body.token;

    var dbConn = new sql.ConnectionPool(DBConfig)
    dbConn.connect()    
        .then(function(){
            var request = new sql.Request(dbConn)

            request
                .input('TOKEN', sql.VarChar(1000), token) 
                    .execute('sys_GetGender')
                        .then(function(data){
                            res.json(data.recordset[0]);
                            //console.log(data.recordset[0])
                            dbConn.close();
                        }).catch(function (err){
                            console.log(err);
                            dbConn.close();
                        })
        }).catch(function (err) {
            console.log(err);
        });
});

module.exports = router;