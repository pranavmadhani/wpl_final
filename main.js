//declaration of requried files
var express = require("express");
var bodyParser = require('body-parser');
var connection = require('./config');
var path = require('path');
var app = express();
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
const multer = require('multer')
const {
    Http2ServerRequest
} = require("http2");
app.set('view engine', 'ejs');
var RESPONSE_OUTPUT;
var STATUS = "LOGIN";



//******HELPERS */
const {
    body,
    validationResult,
    check
} = require('express-validator');
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
/* the helper function will check the user status and set value of global variables acordingly
if the variables are set which is user is present it will login else if already logged-in user will be
logged out
*/


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/data/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + path.extname(file.originalname));
    }
});


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

function navigateToQuiz(req, res)
{
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
    console.log("status is:" + STATUS)
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
    res.render(__dirname + "/views/" + "quiz", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})

app.get('/quiz_home', checkUserStatus, function (req, res) {


    let display_file = [];
    let query = 'select * from quiz where 1';
    
    if (req.query.search == undefined || req.query.filter_category == "All" ) {
        
        query = 'select * from quiz where 1';
    }
   else if(req.query.search.length>1)
   {
    query = 'select * from quiz  name like ?';
   }
    
    else {

        query = 'select * from quiz where name like ? and category =? ';
    }


    connection.query(query, [req.query.search+"%", req.query.filter_category], function (error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query' + error,

            })
        }

        for (let i = 0; i < results.length; i++) {
            display_file.push(results[i].name)
        }

        res.render(__dirname + "/views/" + "quiz_home", {
            username: RESPONSE_OUTPUT,
            login: STATUS,
            file: display_file

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
        login: STATUS
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

app.get('/sample', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "sample")
})
app.get('/cart-sample', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/views/" + "cart-sample")
})

app.get('/contact-us', function (req, res) {
    res.render(__dirname + "/views/" + "contact-Us",{
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

var upload = multer({
    storage: storage
})

app.post('/upload-quiz-json', (req, res) => {

    let upload = multer({
        storage: storage
    }).single('quiz_json');

    upload(req, res, function (err) {


        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send("file is not valid json" + err);
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        var quiz_data = {
            name: req.file.originalname,
            category: req.body.category

        }
        connection.query('INSERT INTO quiz SET ?', quiz_data, function (error, results, fields) {
            if (error) {
                res.json({
                    status: false,
                    message: 'there are some error with query' + error,

                })
            }
            // Display uploaded image for user validation
            res.send(`You have uploaded this quiz file:${req.file.originalname}`);

        });


    });
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