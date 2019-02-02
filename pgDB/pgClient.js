var helper=require('../helper');
var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var db = pgp(helper.dbConnection);

module.exports = db;