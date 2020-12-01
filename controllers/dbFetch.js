/**
 * 
This file contains method that will be useful to fetch data from database like plan,price,description,qty,etc
that we require to display at frontend.It will be used especially in payment and shopping page.
 */
//declaration of requried files
var express = require("express");
var connection = require('./../config');
var path = require('path');
//function call for fetching data
module.exports.DBHelper = function dbFetcher(req, res, next) {
    connection.query('select plan, count from cart where email =?', [req.session.user], function (err, resultsOfplan, fields) {
        if (err) res.send({
            message: "error occured in shopping cart fetching data"
        })
        let plans = [];
        let counts = [];
        for (let i = 0; i < resultsOfplan.length; i++) {
            counts.push(resultsOfplan[i].count)
            plans.push(resultsOfplan[i].plan)
        }
        connection.query('select description, price from products where 1', function (err, results, fields) {
            console.log("inside")
            let prices = [];
            let description = [];
            for (let i = 0; i < results.length; i++) {
                prices.push(results[i].price)
                description.push(results[i].description)
            }
            req.session.selectedPlan = plans;
            req.session.count = counts;
            req.session.prices = prices
            req.session.description = description;
            next();
        });
    })
    //next();
};


module.exports.postUpdatedCartValueOnCkecout = function dbFetcher(req, res, next) {
   
   
    if(Object.keys(req.body).length === 0)  
    {
        console.log("inside if");
    
        res.status(400).send({ message: 'Cart is empty please add items to cart' }); 
    }
    else{
    var updatedProductCount = req.body
    var email = req.session.user
    var plan = req.session.selectedPlan
    var qty =req.body.qty;
    
    console.log(req.body)

//get value of email and plans and qty respectively and store it in variable
var values = [];


console.log("inside else");

for(let i =0;i <qty.length; i++)
{
values.push({count:qty[i],email:email,plan:plan[i]})

  connection.query("update cart set count = ? where email = ? and plan =?", [qty[i],email,plan[i]],  function (error, results, fields) {

        if(error)
        {
            res.status(500).send('Something broke!')
            
        }
        



    });
}
console.log("success.. cart value set")
res.redirect("http://localhost:8081/payment-page");

}
}