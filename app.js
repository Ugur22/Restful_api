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


app.use('/api/quotes', quoteRouter, function () {

});
// app.use('/api/authors', authorRouter);

app.get('/', function (req, res) {

});

app.listen(port, function (req, res) {

    console.log('running on Port:' + port);
});

