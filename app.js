var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var db = mongoose.connect('mongodb://localhost:27017/quoteAPI');

var Quote = require('./models/quotesModel');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

quoteRouter = require("./Routes/quoteRoutes")(Quote);


app.use('/api/quotes', quoteRouter);


app.get('/', function (req, res) {
    res.send('My  quotes API');
});

app.listen(port, function (req, res) {
    console.log('running on Port:' + port);
});

