var express = require("express");
var connection = require('./../config');
//This module will be called on click on buy now icon based on plan that will be selected by user
module.exports.addProductToCart = function (req, res, next) {
    let plan = req.body.pln[1];
    let email = req.session.user;
    let val = {
        "email": req.session.user,
        "plan": req.body.pln[1],
        "count":1
    }
    connection.query('SELECT * FROM PRODUCTS WHERE plan= ?', [plan], function (error, dataresults, fields) {
        //  console.log(dataresults)
        if (dataresults.length > 0) {
            // check if cart value is already presentation
            connection.query('select * from cart where plan =? and email =?', [plan,email], function (error, results, fields) {
                if (results.length == 0){
                    connection.query('insert into cart set ?', val, function (error, results, fields) {
                        if (error) {
                            res.json({
                                status: false,
                                message: error,
                            })
                        } else {
                            console.log("setting plan values")
                            let plan = [];
                            for (let i = 0; i < dataresults.length; i++) {
                                plan.push(dataresults[i]);
                            }
                            // console.log(dataresults)
                            //saving values of plan description and price in session
                            req.session.selectedPlan = plan[0].plan;
                            req.session.selectedDescription = plan[0].description;
                            req.session.selectedDuration = plan[0].duration;
                            req.session.selectedPrice = plan[0].price;
                            //redirecting to cart page
                            res.redirect("http://localhost:8081/shopping-cart");
                        }
                    });
                }


else{

    connection.query("update cart set count = count+1 where email = ? ",email, function (error, results, fields) {


    });
}



            });
        } else {
            res.json({
                error: "there is some error"
            })
            
        }
       
    });
    res.redirect("http://localhost:8081/shopping-cart");
}