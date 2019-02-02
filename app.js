var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var bearer = require('bearer');
var pg = require('pg');
var helper=require('./helper');
var cors = require('cors');

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin,Origin,Accept,X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Setup authentication
//This should be done before all routes are configured to assure that authorization will be first to execute
bearer({
    //Make sure to pass in the app (express) object so we can set routes
    app:app,
    //Please change server key for your own safety!
    serverKey:"pu0sx2RqRB4Zo4DD5Zf6mdjkbn65eQwv",
    tokenUrl:'/login', //Call this URL to get your token. Accepts only POST method
    extendTokenUrl:'/extendtoken', //Call this URL to get your token. Accepts only POST method
    cookieName:'x-auth',
    createToken:function(req, next, cancel){
        //If your user is not valid just return "underfined" from this method.
        //Your token will be added to req object and you can use it from any method later

        var user = new (require('./models/user'));

        user.email=req.body.email;
        user.password=req.body.password;
        user.login(function (successData) {
            next({
                expire: moment.utc(Date.now()).add(10, 'days'),
                email: successData.email,
                userID: successData.userid
            });
        }, function (errorData) {
            cancel(errorData);
        });
    },
    extendToken:function(req, next, cancel){
        var token=req.authToken;
        if (token){
            next({
                email: token.email,
                expire: moment(Date.now()).add('days', 1).format('YYYY-MM-DD HH:mm:ss')
            });
        }else{
            cancel();
        }
    },
    validateToken:function(req, token){
        //you could also check if request came from same IP using req.ip==token.ip for example
        if (token){
            return moment(token.expire)>moment(new Date());
        }
        return false;
    },
    onTokenValid:function(token, next, cancel){
        next()
    },
    userInRole:function(token, roles, next, cancel){
        //Provide role level access restrictions on url
        //You can use onTokenValid for this also, but I find this easier to read later
        //If you specified "roles" property for any secureRoute below, you must implement this method
        var username=token.username;

        var client=new pg.Client(helper.connString);
        client.on('drain', client.end.bind(client));
        client.connect();

        var params=roles.map(function(rolename, i){
            return ('$'+(i+1));
        }).join(',');

        var paramArray=roles;
        paramArray.push(username);

        client.query('select count(*) from userroles where rolename in ('+params+') and username=$'+paramArray.length, paramArray, function(err, result){
            if(!err) {
                if (result.rows[0].count>0) {
                    next()
                }else
                {
                    cancel();
                }
            }else
            {
                cancel();
            }
        });
    },
    onAuthorized: function(req, token){
    },
    onUnauthorized: function(req, token){
    },
    secureRoutes:[
        {url:'/task/*', method:'get'},
        {url:'/task/*', method:'post'}
    ]
});

//Setup routing
require('./routes/route-config')(app);

module.exports = app;
