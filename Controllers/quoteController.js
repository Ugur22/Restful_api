require('mongoose-pagination');
var quoteController = function (Quote) {
    var newPageNext, newPagePrev;

    var post = function (req, res) {
        var quote = new Quote(req.body);

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
            quote.save();
            console.log(quote);
            res.status(201).send(quote);
        }

    };

    var options = function (req, res) {
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.end();
    };
    var get = function (req, res, next) {
        var page = parseInt(req.query.start) || 1;
        Quote.find().exec((err, countData) => {
            if (err) return next(err);
            var countItems = countData.length;
            // pagination
            var limit = parseInt(req.query.limit) || countItems;


            var quotes = {};

            var exclude = {__v: 0};
            Quote.find({}, exclude)
                .paginate(page, limit)
                .exec((err, data) => {
                    if (err) {
                        return next(err)
                    } else {
                        if (limit > countItems)
                            limit = countItems;

                        var totalPages = Math.ceil(countItems / limit);
                    }

                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (!req.accepts('json')) {
                            res.status(404).send(err)
                        } else {


                            if (totalPages <= 1) {
                                newPagePrev = 1;
                                newPageNext = 1;
                            }

                            if (page < totalPages) {
                                newPageNext = page + 1;
                            }


                            if (page > 1) {
                                newPagePrev = page - 1;
                            }


                            var items = quotes.items = [];

                            var links = quotes._links = {};
                            links.self = {};
                            links.self.href = 'http://' + req.headers.host + '/api/quotes/';
                            var pagination = quotes.pagination = {};
                            pagination.currentPage = page;
                            pagination.currentItems = limit;
                            pagination.totalPages = totalPages;
                            pagination.totalItems = countItems;
                            var paginationLinks = pagination._links = {};
                            paginationLinks.first = {};
                            paginationLinks.first.page = 1;
                            paginationLinks.first.href = 'http://' + req.headers.host + '/api/quotes/?' + 'start=' + 1 + '&limit=' + limit;
                            paginationLinks.last = {};
                            paginationLinks.last.page = totalPages;
                            paginationLinks.last.href = 'http://' + req.headers.host + '/api/quotes/?' + 'start=' + totalPages + '&limit=' + limit;
                            paginationLinks.previous = {};
                            paginationLinks.previous.page = newPagePrev;
                            paginationLinks.previous.href = 'http://' + req.headers.host + '/api/quotes/?' + 'start=' + newPagePrev + '&limit=' + limit;
                            paginationLinks.next = {};
                            paginationLinks.next.page = newPageNext;
                            paginationLinks.next.href = 'http://' + req.headers.host + '/api/quotes/?' + 'start=' + newPageNext + '&limit=' + limit;


                            data.forEach(function (element, index, array) {
                                var newQuote = element.toJSON();
                                var linksQuote = newQuote._links = {};
                                linksQuote.self = {};
                                linksQuote.collection = {};
                                linksQuote.self.href = 'http://' + req.headers.host + '/api/quotes/' + newQuote._id;
                                linksQuote.collection.href = 'http://' + req.headers.host + '/api/quotes/';
                                items.push(newQuote);
                            });
                            res.json(quotes);
                        }
                    }
                });
        });
    };


    var getSingleQuote = function (req, res) {
        var returnQuote = req.quote.toJSON();
        returnQuote._links = {};
        returnQuote._links.self = {};
        returnQuote._links.self.href = 'http://' + req.headers.host + '/api/quotes/' + returnQuote._id;
        returnQuote._links.collection = {};
        returnQuote._links.collection.href = 'http://' + req.headers.host + '/api/quotes/';
        res.json(returnQuote);

    };

    var singleQuoteOptions = function (req, res) {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
        res.end();
    };

    var putQuote = function (req, res) {
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
    };

    var patchQuote = function (req, res) {
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
    };

    var deleteQuote = function (req, res) {
        req.quote.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('Removed');
            }
        });
    };

    return {
        post: post,
        get: get,
        options: options,
        getSingleQuote: getSingleQuote,
        singleQuoteOptions: singleQuoteOptions,
        putQuote: putQuote,
        patchQuote: patchQuote,
        deleteQuote: deleteQuote
    }
};

module.exports = quoteController;