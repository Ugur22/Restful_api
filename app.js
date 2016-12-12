var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var db = mongoose.connect('mongodb://localhost:27017/quoteAPI');

var Quote = require('./models/quotesModel');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


quoteRouter = require("./Routes/quoteRoutes")(Quote);


app.use(function (res, req) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.next();
});
app.use('/api/quotes', quoteRouter);


app.get('/', function (req, res) {
    res.send('My  quotes API');
});

app.listen(port, function (req, res) {
    console.log('running on Port:' + port);
});

