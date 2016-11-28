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


app.use('/api/quotes', quoteRouter);


app.use(function (req, res) {
    if (req.accepts('json')) {
        res.send(' accepted');

    } else {
        res.send('not accepted');
    }
});

app.get('/', function (req, res) {
    res.send('My  quotes API');
});

app.listen(port, function (req, res) {
    console.log('running on Port:' + port);
});

