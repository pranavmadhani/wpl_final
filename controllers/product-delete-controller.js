var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');

module.exports.deleteProduct = function(req,res,next){

    let plan = req.body.plan_remove;
    console.log("plan")
    connection.query('DELETE from products where plan = ?',plan, function (error, results, fields) {
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