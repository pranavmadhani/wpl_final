var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
var connection = require('./../config');

module.exports.changePassword=function(req,res){
   
  
    var encryptedString = cryptr.encrypt(req.body.password);
    var encryptedString1 = cryptr.encrypt(req.body.password1);
    let email=req.body.email;
    let password = encryptedString;
    let password1 = encryptedString1;
  
    //   console.log(email)
    //   console.log(password)

     
       
        
    
    if(req.body.length <1) return "error";
    connection.query('UPDATE users SET password= ? where email = ?',[password,email], function (error, results, fields) {
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