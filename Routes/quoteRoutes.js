var express = require('express');

var routes = function (Quote) {
    var quoteRouter = express.Router();

    quoteRouter.route('/')
        .post(function (req, res) {
            var quote = new Quote(req.body);
            quote.save();
            console.log(quote);
            res.status(201).send(quote);
        })
        .get(function (req, res) {
            var query = {};
            if (req.query.genre) {
                query.genre = req.query.genre;
            }
            Quote.find(query, function (err, quote) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(quote);
                }
            });
        });

    quoteRouter.use('/:quoteId', function (req, res, next) {
        Quote.findById(req.params.quoteId, function (err, quote) {
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
            res.json(req.quote);
        })
        .put(function (req, res) {
            req.quote.title = req.body.title;
            req.quote.author = req.body.author;
            req.quote.genre = req.body.genre;
            req.quote.read = req.body.read;
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
        });
    return quoteRouter;
};

module.exports = routes;