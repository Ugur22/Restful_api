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
            var returnQuote = req.quote.toJSON();
            returnQuote.links = {};
            var newLink = 'http://' + req.headers.host + '/api/quotes/?tag=' + returnQuote.tag;
            returnQuote.links.filterByThisTag = newLink.replace(' ', '%20');
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
        .options(function (req, res) {
            res.set('Allow', "POST,GET,OPTIONS");
            res.end();
        });
    return quoteRouter;
};

module.exports = routes;