var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');
var cryptr = new Cryptr('myTotalySecretKey');

 
module.exports.register=function(req,res){
    var today = new Date();
   
  var encryptedString = cryptr.encrypt(req.body.password);

 
    var users={
        "name":req.body.name,
        "email":req.body.email,
        "password":encryptedString,
        "created_at":today,
        "role":"user"
        
    }
    if(req.body.length <1) return "error";
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'+ error,
           
        })
      }else{
        
        res.redirect("http://localhost:8081/registration-success");
        // res.json({

        //     status:true,
        //     data:results,
        //     message:'user registered sucessfully',
           
            
        // })
      }
    });
}

