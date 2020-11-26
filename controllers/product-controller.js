var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');
var cryptr = new Cryptr('myTotalySecretKey');
module.exports.addProduct=function(req,res){
    var product={
        "plan":req.body.plan,
        "description":req.body.description,
        "full_support":req.body.full_support,
        "duration":req.body.duration,
        "questions":req.body.questions,
        "price": req.body.price
    }
    if(req.body.length <1) return "error";
    connection.query('INSERT INTO products SET ?',product, function (error, results, fields) {
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
module.exports.retrieveProduct = function(req,res,next){
  connection.query('SELECT * FROM products where 1', function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: 'there is some error with query'
        })
      } else {
        if (results.length > 0) {
         //retrieving values from the plan object from sql & store it in session variable for global access
         let plan =  [];
          for(let i =0; i <results.length; i++)
          {
             plan.push(results[i]);
          }
            req.session.plan0 =plan[0].plan;
            req.session.plan1 =plan[1].plan;
            req.session.plan2 =plan[2].plan;
            req.session.description0 =plan[0].description;
            req.session.description1 =plan[1].description;
            req.session.description2 =plan[2].description;
            req.session.full_support0 =plan[0].full_support;
            req.session.full_support1 =plan[1].full_support;
            req.session.full_support2 =plan[2].full_support;
            req.session.duration0 =plan[0].duration;
            req.session.duration1 =plan[1].duration;
            req.session.duration2 =plan[2].duration;
            req.session.questions0 =plan[0].questions;
            req.session.questions1 =plan[1].questions;
            req.session.questions2 =plan[2].questions;
            req.session.price0 =plan[0].price;
            req.session.price1 =plan[1].price;
            req.session.price2 =plan[2].price;
            next();
        } else {
          res.json({
            status: false,
            message: "cannot add product"
          });
        }
      }
    });
}




