//declaration of requried files
var express = require("express");
var bodyParser = require('body-parser');
var connection = require('./config');
var path = require('path');
var app = express();
var methodOveride = require('method-override');
var router = express.Router();
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');
var addProduct = require('./controllers/product-controller')
var deleteProduct = require('./controllers/product-delete-controller')
var modifyPassword = require('./controllers/password-controller')
var addCart = require('./controllers/cart-controller')
var session = require('express-session')
const ejs = require('ejs');
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
var dbFetcher = require('./controllers/dbFetch')
const helper = require('./controllers/helpers')
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const multer = require('multer')
const {
    Http2ServerRequest
} = require("http2");
app.set('view engine', 'ejs');
var RESPONSE_OUTPUT;
var STATUS = "LOGIN";
var db = require("monk")("localhost:27017/quiz");
//******HELPERS */
const {
    body,
    validationResult,
    check
} = require('express-validator');
const {
    send
} = require("process");
app.set('trust proxy', 1)
// app initialization starts here
app.use(session({
    name: 'session-id',
    secret: '123456xxx',
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: new Date(Date.now() + 60 * 60 * 1000)
    }
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOveride('_method'));
app.enable('trust proxy');
/* the helper function will check the user status and set value of global variables acordingly
if the variables are set which is user is present it will login else if already logged-in user will be
logged out
*/
function checkUserStatus(req, res, next) {
    console.log("inside check status");
    if (req.session.user == '' || req.session.user == undefined) {
        console.log(req.session.user, "user not logged in");
        console.log(req.path)
        res.render(__dirname + "/views/" + "login", {
            username: RESPONSE_OUTPUT,
            login: STATUS
        });
    } else {
        console.log(req.session.user, ":logged in");
        next();
    }
}
function checkLoginStatus(req, res, next) {
    let selected_plan = req.session.selectedPlan
    console.log(selected_plan + " selected plan");
    if (req.session.user == '' || req.session.user == undefined) {
        RESPONSE_OUTPUT = "USER";
        STATUS = "LOGIN"
        console.log(req.path)
        next();
        // console.log(req.session.user, "if");
    } else {
        RESPONSE_OUTPUT = req.session.user.split('@')[0];
        STATUS = "LOGOUT";
        console.log("user is present so i will redirect to the next function call", req.session.user)
        next();
    }
}
function cartHelper(req, res) {
    if (req.session.user == undefined) res.send("error: email is undefined")
    else {
        res.redirect("http://localhost:8081/cart-sample")
    }
}
function navigateToQuiz(req, res) {
    res.redirect("http://localhost:8081/quiz_home")
    next();
}
// middleware function to check for logged-in users
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// app initialization ends here
//app get & post endpoints
app.get('/', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "Index", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})
app.get('/login', checkLoginStatus, function (req, res) {
    console.log("status is:" + STATUS);
    if (STATUS == 'LOGOUT') {
        req.session.user = "";
        STATUS = "LOGIN"
    }
    res.render(__dirname + "/views/" + "login", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})
app.get('/quiz', checkUserStatus, function (req, res) {
    var collection = db.get("quizes");
    console.log(req.query.user_selected_quiz)
    collection.findOne({
        _id: req.query.user_selected_quiz
    }, "quiz_data").then((doc) => {
        let jsonData = JSON.stringify(doc.quiz_data);
        jsonData = JSON.parse(jsonData);
        res.render(__dirname + "/views/" + "quiz", {
            username: RESPONSE_OUTPUT,
            login: STATUS,
            quiz_data: jsonData
        });
    })
    //})
})
app.get('/quiz_home', checkUserStatus, function (req, res) {
    //By default all search results will be displayed
    if (
        (!req.query.search && !req.query.genre) ||
        (req.query.search == "" && req.query.genre == "all")
    ) {
        var collection = db.get("quizes");
        collection.find({}, function (err, quiz_data) {
            if (err) throw err;
            res.render("quiz_home", {
                username: RESPONSE_OUTPUT,
                quiz: quiz_data,
                login: STATUS
                //status: req.session.userType
            });
        });
    } else if (req.query.search != "" && req.query.genre == "all") {
        console.log("else 1");
        var collection = db.get("quizes");
        var filter = new RegExp([req.query.search].join(""), "i");
        collection.find({
            title: filter
        }, function (err, quiz_data) {
            if (err) throw err;
            res.render("quiz_home", {
                username: RESPONSE_OUTPUT,
                quiz: quiz_data,
                login: STATUS
            });
        });
    } else if (req.query.search != "" && req.query.genre != "all") {
        console.log("else 2");
        var collection = db.get("quizes");
        var filter = new RegExp([req.query.search].join(""), "i");
        var genre = new RegExp([req.query.genre].join(""), "i");
        collection.find({
            title: filter,
            genre: genre
        }, function (err, quiz_data) {
            if (err) throw err;
            res.render("quiz_home", {
                username: RESPONSE_OUTPUT,
                quiz: quiz_data,
                login: STATUS
            });
        });
    } else if (req.query.search == "" && req.query.genre != "all") {
        console.log("else 3");
        var collection = db.get("quizes");
        var genre = new RegExp([req.query.genre].join(""), "i");
        console.log(req.query.genre)
        collection.find({
            genre: req.query.genre
        }, function (err, quiz_data) {
            if (err) throw err;
            res.render("quiz_home", {
                username: RESPONSE_OUTPUT,
                quiz: quiz_data,
                login: STATUS
            });
        });
    }
});
app.get('/quizes/:id', function (req, res) {
    var userStatus = req.session.userType;
    console.log(userStatus);
    if (userStatus != 'admin') {
        res.status(401).send('You are not authorized to access this page');
    }
    var collection = db.get('quizes');
    collection.findOne({
        _id: req.params.id
    }, function (err, quiz_data) {
        if (err) throw err;
        res.render("displaySelectedQuiz", {
            quiz: quiz_data,
            username: RESPONSE_OUTPUT,
            login: STATUS
        });
    });
});
app.get('/registration', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "registration", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})
app.get('/Features', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "Features", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})
app.get('/Pricing', addProduct.retrieveProduct, function (req, res) {
    res.render(__dirname + "/views/" + "Pricing", {
        username: RESPONSE_OUTPUT,
        login: STATUS,
        //fetching session variables loaded from sql from product-controller file
        plan0: req.session.plan0,
        plan1: req.session.plan1,
        plan2: req.session.plan2,
        description0: req.session.description0,
        description1: req.session.description1,
        description2: req.session.description2,
        fullsupport0: req.session.full_support0,
        fullsupport1: req.session.full_support1,
        fullsupport2: req.session.full_support2,
        duration0: req.session.duration0,
        duration1: req.session.duration1,
        duration2: req.session.duration2,
        questions0: req.session.questions0,
        questions1: req.session.questions1,
        questions2: req.session.questions2,
        price0: req.session.price0,
        price1: req.session.price1,
        price2: req.session.price2
    });
})
app.get('/profile', checkUserStatus, function (req, res) {
    res.render(__dirname + "/views/" + "profile", {
        username: RESPONSE_OUTPUT,
        email: req.session.user,
        login: STATUS,
        status: req.session.userType
    });
})
app.get('/registration-success', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "registration-success", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})
app.get('/payment-page', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "payment-page", {
        username: RESPONSE_OUTPUT,
        login: STATUS,
        selectedPlan: req.session.selectedPlan,
        description: req.session.description,
        qty: req.session.count,
        price: req.session.prices,
        loop: req.session.count
    });
});
app.get('/add_quiz', checkUserStatus, function (req, res) {
    res.render(__dirname + "/views/" + "add_quiz", {
        username: RESPONSE_OUTPUT,
        email: req.session.user,
        login: STATUS
    });
})
app.get('/shopping-cart', checkUserStatus, dbFetcher.DBHelper, function (req, res) {
    res.render(__dirname + "/views/" + "shopping-cart", {
        username: RESPONSE_OUTPUT,
        login: STATUS,
        selectedPlan: req.session.selectedPlan,
        description: req.session.description,
        qty: req.session.count,
        price: req.session.prices,
        loop: req.session.count
    });
});


app.get('/purchase-history',checkUserStatus,function(req,res){


connection.query('select * from history where user = ?',req.session.user,function(err,data){

    if(err)throw err;
    else{
       
        res.render(__dirname + "/views/" + "purchase-history",{

            username: RESPONSE_OUTPUT,
            login: STATUS,
            result:data
        })
    }
})

    

});



app.get('/sample', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "sample", {
        username: RESPONSE_OUTPUT,
        login: STATUS,
    })
})
app.get('/cart-sample', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "cart-sample")
})
app.get('/contact-us', function (req, res) {
    res.render(__dirname + "/views/" + "contact-Us", {
        username: RESPONSE_OUTPUT,
        login: STATUS,
    })
})
/* route to handle login and registration */
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.verify);
app.post('/controllers/product-controller', addProduct.addProduct);
app.post('/controllers/product-delete-controller', deleteProduct.deleteProduct);
app.post('/controllers/password-controller', modifyPassword.changePassword);
app.post('/controllers/cart-controller', addCart.addProductToCart, cartHelper);
app.post('/controllers/dbFetch', dbFetcher.postUpdatedCartValueOnCkecout);
app.post('/upload-quiz-json', (req, res) => {
    var collection = db.get("quizes");
    collection.insert({
        title: req.body.title,
        genre: req.body.category,
        image: req.body.image,
        quiz_data: JSON.parse(req.body.quiz),
    }, function (err, video) {
        if (err) throw err;
        res.send('success');
        // res.redirect("/videos");
    });
});
/****Route for delete */
app.delete("/quizes/:id", function (req, res) {
    var collection = db.get("quizes");
    collection.remove({
        _id: req.params.id
    }, function (err, quiz_data) {
        if (err) {
            console.log(err)
            throw err;
        }
        res.redirect("http://localhost:8081/sample");
    });
});
/***Route for edit */
app.get("/quizes/:id/edit", function (req, res) {
    var collection = db.get("quizes");
    collection.findOne({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        //console.log(data);
        res.render("editQuiz", {
            res: data,
            username: RESPONSE_OUTPUT,
            login: STATUS,
        });
    });
});
app.post("/quizes/:id/edit_save", function (req, res) {
    console.log(req.body);
    var collection = db.get("quizes");
    collection
        .findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                title: req.body.title,
                genre: req.body.genre,
                image: req.body.image,
            },
        })
        .then((updatedDoc) => {
            console.log("Quiz details updated");
            res.redirect("http://localhost:8081/sample");
        });
});
app.post("/payment", function (req, res) {
            let purchaseData = {
                user: req.session.user,
                date: Date.parse(new Date()),
                total: req.body.finalAmt
            }
           
            connection.query('INSERT into history set ?', purchaseData, function (err, results, data) {
                if (err) {
                    throw err
                } else {

                    connection.query('DELETE from cart where email =?',purchaseData.user, function(err,results){

                        if (err) {
                            throw err
                        } 
                        else{
                            res.json({
                                success:"yes"
                            })
                        }

                    })
                    
                }
            })
        });


     
            //set app directory to make sure static files are being read
            app.use(express.static(__dirname + '/public/assets'), function (req, res, next) {
                next();
            });
            app.use(express.static(__dirname), function (req, res, next) {
                next();
            });
            app.listen(8081, function () {
                console.log("working on port 8081")
            });