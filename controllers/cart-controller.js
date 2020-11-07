

var express=require("express");
var connection = require('./../config');

//This module will be called on click on buy now icon based on plan that will be selected by user


module.exports.addProductToCart=function(req,res){

    var product={

      email: req.session.email,
      plan:res.body
        
       
    }
    console.log(product);

    connection.query('INSERT INTO carts SET ?',product, function (error, results, fields) {
        if (error) {
          res.json({
              status:false,
              message:'there are some error with query'+ error,
             
          })
        }else{
          
          res.redirect("http://localhost:8081/sample");
        
        }
      });



}