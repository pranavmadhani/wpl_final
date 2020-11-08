var express = require("express");
var connection = require('./../config');
var path = require('path');
//This module will be called on click on buy now icon based on plan that will be selected by user
module.exports.addProductToCart = function (req, res, next) {
    let plan = req.body.pln[1];
    let email = req.session.user;
    let val = {
        "email": req.session.user,
        "plan": req.body.pln[1],
        "count": 1
    }

if(email == undefined)next();
    
    connection.query('SELECT * FROM PRODUCTS WHERE plan= ?', [plan], function (error, dataresults, fields) {
        //  console.log(dataresults)
        if (dataresults.length > 0) {
            // check if cart value is already presentation
            connection.query('select * from cart where plan =? and email =?', [plan, email], function (error, results, fields) {
                if (results.length == 0) {
                    connection.query('insert into cart set ?', val, function (error, results, fields) {
                       
                    });
                } else {
                    connection.query("update cart set count = count+1 where email = ? ", email, function (error, results, fields) {

                    });
                }
            });
        } 
    });
   
    next();
}


