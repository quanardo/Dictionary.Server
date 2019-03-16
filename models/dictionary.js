var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var DictionarySchema = new mongoose.Schema({
    language: String,
    translations: [{
        from: {
            type: String
        },
        to: {
            type: String
        }
    }],
    date: { type: Date, default: Date.now },
    tag: [{
        type: String,
        default: ['all']
    }]
}, {
    collection: 'dictionaries'
});

var Dictionary = mongoose.model('Dictionary', DictionarySchema);
module.exports = Dictionary;