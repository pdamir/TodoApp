var express = require('express');
var router = express.Router();
var bind = require('model-binder');

router.post('/', bind(require('../models/tasklist')), function(req, res, next) {

    var task=req.requestModel;
    var token = req.authToken;

    task.createTask(token.userID, function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});

router.put('/:id', bind(require('../models/tasklist')), function(req, res, next) {
    var task=req.requestModel;
    var token = req.authToken;

    task.updateTask(token.userID, req.params.id, function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});

router.get('/', function(req, res, next){
    var task=new (require('../models/tasklist'))();
    var token = req.authToken;
    task.getAllTasksForUser(token.userID, function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});

router.get('/:id', function(req, res, next){
    var task=new (require('../models/tasklist'))();
    var token = req.authToken;

    task.getSingleTask(token.userID, req.params.id, function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});

router.delete('/:id', function(req, res, next){
    var task=new (require('../models/tasklist'))();
    var token = req.authToken;

    task.removeTask(token.userID, req.params.id, function (successData) {
        res.status(200).send(successData);
    }, function (err) {
        res.status(400).send(err);
    });
});



module.exports = router;

