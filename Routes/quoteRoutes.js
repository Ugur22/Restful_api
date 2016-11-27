var express = require('express');
var routes = function (Quote) {
    var quoteRouter = express.Router();

    var quoteController = require('../Controllers/quoteController.js')(Quote);
    quoteRouter.route('/')
        .post(quoteController.post)
        .get(quoteController.get)
        .options(quoteController.options);


    quoteRouter.use('/:quoteId', function (req, res, next) {
        var exclude = {__v: 0};
        Quote.findById(req.params.quoteId, exclude, function (err, quote) {
            if (err) {
                res.status(500).send(err);
            } else if (quote) {
                req.quote = quote;
                next();
            }
            else {
                res.status(404).send('no quote found');
            }
        });
    });

    quoteRouter.route('/:quoteId')
        .get(function (req, res) {
            var returnQuote = req.quote.toJSON();
            returnQuote._links = {};
            returnQuote._links.self = {};
            returnQuote._links.self.href = 'http://' + req.headers.host + '/api/quotes/' + returnQuote._id;
            returnQuote._links.collection = {};
            returnQuote._links.collection.href = 'http://' + req.headers.host + '/api/quotes/';
            res.json(returnQuote);
        })
        .options(function (req, res) {
            res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
            res.end();
        })
        .put(function (req, res) {
            req.quote.text = req.body.text;
            req.quote.author = req.body.author;
            req.quote.tag = req.body.tag;

            if (!req.body.text) {
                res.status(400);
                res.send('text is required');
            }
            else if (!req.body.author) {
                res.status(400);
                res.send('author is required');
            }

            else if (!req.body.tag) {
                res.status(400);
                res.send('tag is required');
            }
            else {
                req.quote.save(function (err) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json(req.quote);
                    }
                });
            }

        })
        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                req.quote[p] = req.body[p];
            }

            req.quote.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.quote);
                }
            });
        })
        .delete(function (req, res) {
            req.quote.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send('Removed');
                }
            });
        });
    return quoteRouter;
};

module.exports = routes;