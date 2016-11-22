var quoteController = function (Quote) {
    var post = function (req, res) {
        var quote = new Quote(req.body);

        if (!req.body.text) {
            res.status(400);
            res.send('Title is required');
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
        Quote.find(query, function (err, quote) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(quote);
            }
        });
    };

    return {
        post: post,
        get: get
    }
};

module.exports = quoteController;