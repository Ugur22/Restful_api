var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bookModel = new Schema({
    text: {
        type: String
    },
    author: {
        type: String
    },
    tag: {
        type: String
    },
    read: {
        type: Boolean, default: false
    }
});

module.exports = mongoose.model('Quotes', bookModel);


