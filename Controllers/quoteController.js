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
        var query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Quote.find(query, function (err, quotes) {
            if (err) {
                res.status(500).send(err);
            } else {

                var returnQuotes = ['items'];
                quotes.forEach(function (element, index, array) {
                    var newQuote = element.toJSON();
                    newQuote._links = {};
                    newQuote._links.self = {};
                    newQuote._links.collection = {};
                    newQuote._links.self.href = 'http://' + req.headers.host + '/api/quotes/' + newQuote._id;
                    newQuote._links.collection.href = 'http://' + req.headers.host + '/api/quotes/';
                    returnQuotes.push(newQuote);
                });
                res.json(returnQuotes);
            }
        });
    };

    return {
        post: post,
        get: get
    }
};

module.exports = quoteController;