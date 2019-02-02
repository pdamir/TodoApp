var express = require('express');
var router = express.Router();
var bind = require('model-binder');


router.get('/mail', function(req, res, next){
    var user=new (require('../models/user'))();
    var token = req.authToken;

    user.sendEmail(function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});


router.post('/register', bind(require('../models/user')), function(req, res, next) {
    var user=req.requestModel;

    user.register(function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});

router.get('/me', function(req, res, next){
    var user=new (require('../models/user'))();
    var token = req.authToken;

    user.getAuthenticatedUser(token.userID, function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});


module.exports = router;

