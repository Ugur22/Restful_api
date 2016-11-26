var express = require('express');

var routes = function (Quote) {
    var quoteRouter = express.Router();

    var quoteController = require('../Controllers/quoteController.js')(Quote);
    quoteRouter.route('/')
        .post(quoteController.post)
        .get(quoteController.get);

    quoteRouter.route('/api/quotes')
        .delete(function (req, res) {
            res.status(500).send('Method not allowed');
        })
        .options(function (req, res) {
            res.set('Access-Control-Allow-Methods', 'Allow', 'GET, POST, OPTIONS');
            res.end();
        });

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
            res.json(returnQuote);
        })
        .put(function (req, res) {
            req.quote.title = req.body.title;
            req.quote.author = req.body.author;
            req.quote.genre = req.body.genre;
            req.quote.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.quote);
                }
            });
            res.json(req.quote);
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
        })
    return quoteRouter;
};

module.exports = routes;