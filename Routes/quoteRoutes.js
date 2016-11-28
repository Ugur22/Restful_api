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
        .get(quoteController.getSingleQuote)
        .options(quoteController.singleQuoteOptions)
        .put(quoteController.putQuote)
        .patch(quoteController.patchQuote)
        .delete(quoteController.deleteQuote);
    return quoteRouter;
};

module.exports = routes;