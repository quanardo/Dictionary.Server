var express = require('express');
var router = express.Router();
var Dictionary = require('../models/dictionary');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var translate = require('translate');


// Gets dictionaries
router.get('/', function (req, res, next) {
  Dictionary
    .find({})
    .exec(function (err, dictionary) {
      res.set('Content-Type', 'application/json')
        .status(200)
        .json(dictionary);
    });
});

// Gets data from selected language
router.get('/:id', function (req, res, next) {
  Dictionary
    .findById(req.params.id, function (err, language) {
      res.set('Content-Type', 'application/json')
        .status(200)
        .json(language.translations);
    });
});


// Adds a new language
router.post('/', function (req, res, next) {
  Dictionary
    .create(req.body, function (err, newDictionary) {
      res.set('Content-Type', 'application/json')
        .status(200)
        .json(newDictionary);
    })
  // Dictionary.collection.insert(req.body, function (err) {
  //   console.log(req.body)
  //   res.set('Content-Type', 'application/json')
  //     .status(200)
  //     .json(new Dictionary({language: req.body}));
  // });
  // Dictionary
  //   .save({
  //     language: req.body.language
  //   }, function (err, dictionary) {
  //     res.set('Content-Type', 'application/json')
  //       .status(200)
  //       .json(dictionary);
  //   });
});

// Removes language
router.delete('/:id', function (req, res, next) {
  Dictionary
    .findOneAndRemove({ _id: req.params.id }, function (err, removedDictionary) {
      res.set('Content-Type', 'application/json')
        .status(200)
        .json({ status: 'Ok!' });
    });
});

// Updates language of selected translation
router.post('/:id', function (req, res, next) {
  Dictionary
    .findOneAndUpdate({ _id: req.params.id },
      {
        $set: {
          "language": req.body.language
        }
      }, function (err, dictionary) {
        res.set('Content-Type', 'application/json')
          .status(200)
          .json({ status: 'Ok!' });
      });
});

// Updates translation for selected language
router.post('/updateTrsl/:id', function (req, res, next) {
  Dictionary
    .findOneAndUpdate({
      _id: req.params.id,
      "translations._id": req.body._id
    }, {
        $set: {
          "translations.$.from": req.body.from,
          "translations.$.to": req.body.to
        }
      }, function (err, translation) {
        res.set('Content-Type', 'application/json')
          .status(200)
          .json({ status: 'Ok!' });
      });
});


// Adds new translation to selected language
router.post('/addTrsl/:id', function (req, res, next) {
  console.log(req.body)
  var translation = {
    _id: new ObjectID(),
    from: req.body.from,
    to: req.body.to
  };
  Dictionary
    .findOneAndUpdate({
      _id: req.params.id
    }, {
        $push: {
          translations: translation
        }
      }, function (err, newTrsl) {
        res.set('Content-Type', 'application/json')
          .status(200)
          .json(translation);
      });
});


// Removes translation from language
router.post('/removeTrsl/:id', function (req, res, next) {
  Dictionary
    .findOneAndUpdate({
      _id: req.params.id
    }, {
        $pull: {
          'translations': {
            _id: req.body._id
          }
        }
      }, function (err, translation) {
        res.set('Content-Type', 'application/json')
          .status(200)
          .json({ status: 'Ok!' });
      });
});

// router.post('/:id', function (req, res, next) {
//   var indexOfLang = dictionary.indexOf(getWords(dictionary, 'name', req.body.currLang));
//   var currLangArr = dictionary[indexOfLang];
//   var indexOfTrsl = currLangArr.translations.indexOf(req.body.trslToRemove);
//   currLangArr.translations.splice(indexOfTrsl, 1);
//   res.set('Content-Type', 'application/json')
//     .status(200)
//     .json(dictionary);
// });

// router.delete('/', function (req, res, next) {

// });

// function getWords(array, key, value) {
//   for (var i = 0; i < array.length; i++) {
//     if (array[i][key] === value) {
//       return array[i];
//     }
//   }
//   return null;
// }

module.exports = router;