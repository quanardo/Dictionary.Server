var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto').randomBytes(256).toString('hex');

router.post('/register', function (req, res) {
    if (!req.body.email) {
        res.json({ sucess: false, message: 'You must provide an e-mail' });
    } else {
        if (!req.body.username) {
            res.json({ success: false, message: 'You must provide an username' });
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'You must provide a password' });
            } else {
                var user = new User({
                    email: req.body.email.toLowerCase(),
                    username: req.body.username.toLowerCase(),
                    password: req.body.password
                });
                user.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            res.json({ success: false, message: 'Username or e-mail already exists' });
                        } else {
                            if (err.errors) {
                                if (err.errors.email) {
                                    res.json({ success: false, message: err.errors.email.message });
                                } else {
                                    if (err.errors.username) {
                                        res.json({ success: false, message: err.errors.username.message });
                                    } else {
                                        if (err.errors.password) {
                                            res.json({ success: false, message: err.errors.password.message });
                                        } else {
                                            res.json({ success: false, message: err });
                                        }
                                    }
                                }
                            } else {
                                res.json({ success: false, message: 'Could not save user. Error: ', err });
                            }
                        }
                    } else {
                        res.json({ success: true, message: 'Account registred!' });
                    }
                });
            }
        }
    }
});



router.post('/login', function (req, res) {
    if (!req.body.username) {
        res.json({ success: false, message: 'No username as provided.' });
    } else {
        if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided.' });
        } else {
            User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Username not found.' });
                    } else {
                        var validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Password invalid' });
                        } else {
                            var token = jwt.sign({ userId: user._id }, crypto, { expiresIn: '24h' });
                            res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } });
                        }
                    }
                }
            });
        }
    }
});

module.exports = router;