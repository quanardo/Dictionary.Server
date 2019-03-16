var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var dictionaryRouter = require('./routes/dictionary');
var authRouter = require('./routes/auth');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var url = 'mongodb://localhost:27017/dictionary';

mongoose.Promise = global.Promise;
mongoose.connect(url).then(() => {
    console.log('Connected');
}, (err) => {
    console.log(err);
});

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/', indexRouter);
app.use('/api/dictionary', dictionaryRouter);
app.use('/api/auth', authRouter);



module.exports = app;