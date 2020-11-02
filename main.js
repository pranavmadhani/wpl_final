//declaration of requried files
var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');
var session = require('cookie-session');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
const {
    Http2ServerRequest
} = require("http2");
app.set('view engine', 'ejs');
var RESPONSE_OUTPUT;
var STATUS = "LOGIN";




/* the helper function will check the user status and set value of global variables acordingly
if the variables are set which is user is present it will login else if already logged-in user will be
logged out
*/
function checkUserStatus(req, res, next) {

    console.log("inside check status");

    if (req.session.user == '' || req.session.user == undefined) {

        console.log(req.session.user, "if");
        res.render(__dirname + "/" + "login", {

            username: RESPONSE_OUTPUT,
            login: STATUS
        });



    } else {
        console.log(req.session.user, "else");

        next();

    }

}

function checkLoginStatus(req, res, next) {

    console.log("inside check login")
    if (req.session.user == '' || req.session.user == undefined) {
        RESPONSE_OUTPUT = "USER";
        STATUS = "LOGIN"
        console.log(req.session.user, "if");

        next()




    } else {

        RESPONSE_OUTPUT = req.session.user.split('@')[0];
        STATUS = "LOGOUT";
        console.log("user is present so i will redirect to the next function call", req.session.user)
        next();



    }

}




// app initialization starts here
app.use(session({
    name: 'session-id',
    secret: '123456xxx',
    saveUninitialized: false,
    resave: false,
    cookie: {
        path: '/',
        expires: 3600,
        secure: false
    }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
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


    res.render(__dirname + "/" + "Index", {
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

    res.render(__dirname + "/" + "login", {
        username: RESPONSE_OUTPUT,
        login: STATUS


    });
})
app.get('/quiz', checkUserStatus, function (req, res) {
    res.render(__dirname + "/" + "quiz", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });
})
app.get('/registration', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/" + "registration", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });

})


app.get('/Features', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/" + "Features", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });

})

app.get('/Pricing', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/" + "Pricing", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });

})




app.get('/registration-success', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/" + "registration-success", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });

})


app.get('/shopping-cart', checkLoginStatus, function (req, res) {
    res.render(__dirname + "/" + "shopping-cart", {
        username: RESPONSE_OUTPUT,
        login: STATUS
    });

})

/* route to handle login and registration */


app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.verify);


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