//declaration of requried files

var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');

// app initialization starts here

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname));




app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app initialization ends here



//app get & post endpoints

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/test.html', function (req, res) {
    res.sendFile(__dirname + "/" + "test.html");
})

app.get('/login.html', function (req, res) {
    res.sendFile(__dirname + "/" + "login.html");
})


app.get('/quiz.html', function (req, res) {
    res.sendFile(__dirname + "/" + "quiz.html");
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "registration.html");
    console.log(req.body);
})


/* route to handle login and registration */
//app.post('/api/register', registerController.register);
//app.post('/api/authenticate', authenticateController.authenticate);

console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller',authenticateController.verify);



app.listen(8081, function () {
    console.log("working on port 8081")
});