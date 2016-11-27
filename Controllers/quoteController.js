var quoteController = function (Quote) {
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


    var get = function (req, res) {
        var exclude = {__v: 0};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Quote.find({}, exclude, function (err, ItemQuotes) {
            if (err) {
                res.status(500).send(err);
            } else {

                var quotes = quotes = {};
                var items = quotes.items = [];

                var links = quotes._links = {};
                links.self = {};
                links.self.href = 'http://' + req.headers.host + '/api/quotes/';
                var pagination = quotes.pagination = {};
                pagination.currentPage = 1;
                pagination.currentItems = 5;
                pagination.totalItems = 5;
                var paginationLinks = pagination._links = {};
                paginationLinks.first = {};
                paginationLinks.first.page = 1;
                paginationLinks.first.href = 'http://' + req.headers.host + '/api/quotes/';
                paginationLinks.last = {};
                paginationLinks.last.page = 1;
                paginationLinks.last.href = 'http://' + req.headers.host + '/api/quotes/';
                paginationLinks.previous = {};
                paginationLinks.previous.page = 1;
                paginationLinks.previous.href = 'http://' + req.headers.host + '/api/quotes/';
                paginationLinks.next = {};
                paginationLinks.next.page = 1;
                paginationLinks.next.href = 'http://' + req.headers.host + '/api/quotes/';


                ItemQuotes.forEach(function (element, index, array) {
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
        });
    };

    return {
        post: post,
        get: get
    }
};

module.exports = quoteController;