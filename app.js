var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var db = mongoose.connect('mongodb://localhost:27017/bookAPI');

var Book = require('./models/bookModel');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


bookRouter = require("./Routes/bookRoutes")(Book);


app.use('/api/books', bookRouter);
// app.use('/api/authors', authorRouter);

app.get('/', function (req, res) {
    res.send('welcome to my Restful WEB API');
});

app.listen(port, function () {
    console.log('running on Port:' + port);
});

