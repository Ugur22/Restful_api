var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var db = mongoose.connect('mongodb://localhost:27017/quoteAPI');

var Book = require('./models/quotesModel');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


bookRouter = require("./Routes/quoteRoutes")(Book);


app.use('/api/quotes', bookRouter);
// app.use('/api/authors', authorRouter);

app.get('/', function (req, res) {
    res.send('welcome to my Restful WEB API');
});

app.listen(port, function () {
    console.log('running on Port:' + port);
});

