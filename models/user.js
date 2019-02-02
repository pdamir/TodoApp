var db = require('../pgDB/pgClient');
var helper=require('../helper');
var mailer = require('../helpers/nodemailerHelper');
var async = require('async');

function userModel(){
    var $this=this;
    this.name='';
    this.email= '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';


    this.isValidLoginOrRegistration = function () {
        $this.errors = [];

        var reMail = new RegExp("^[a-zA-Z0-9!#$%&'*+/=?^_'{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_'{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$");
        if ($this.email.length == 0 || !reMail.test($this.email)) {
            $this.errors.push({code:900, message:"Email is not valid"});
        }

        if(!this.password || $this.password.length == 0) {
            $this.errors.push({code: 900, message: "Missing password"});
        }

        return ($this.errors.length === 0);
    };

    this.login = function (success, error) {
        if ($this.isValidLoginOrRegistration()) {

        db.any('SELECT userid, email, password, firstname, lastname FROM users where email=$1', [$this.email])
            .then(function(data) {
                if (data.length == 0){
                    return error({error:"User not found"});
                }

                var decPass=helper.decrypt(data[0].password, helper.cryptoKey);
                if (decPass == $this.password){
                    success({
                        userid: data[0].userid,
                        email: data[0].email
                    });
                }else {
                    error({error:"Provided password does not match the provided email"});
                }
            })
            .catch(function(err) {
                error(err);
            })


        } else {
            error($this.errors);
        }
    };

    this.checkMailExists = function (email, success, error) {

            db.any('select * from users where email= $1', [$this.email])
                .then(function(data) {
                    if (data.length > 0){
                        return error({error:"User account already exists for this email address"});
                    } else {
                        success({code:200, message:'Email address is not used'})
                    }
                })
                .catch(function(err) {
                    error(err);
                })

    };

    this.register = function (success, error) {

        if ($this.isValidLoginOrRegistration()) {

            $this.checkMailExists($this.email, function(successData) {
                var password=helper.encrypt($this.password, helper.cryptoKey);
                    db.none('INSERT INTO users(email, password, firstname, lastname) VALUES ($1, $2, $3, $4)', [$this.email, password, $this.firstName, $this.lastName])
                        .then(function(data) {
                            success({
                                email:$this.email,
                                firstName:$this.firstName,
                                lastName: $this.lastName
                            });
                        })
                        .catch(function(err) {
                            error(err);
                        })


            }, function(errData) {
                error(errData);
            });
        } else {
            error($this.errors);
        }
    };

    this.getAuthenticatedUser = function (userID , success, error) {
        db.any('SELECT email, firstname, lastname FROM users WHERE userid = $1', [$this.email])
            .then(function(data) {
                if(data && data.length == 1) {
                    success(data[0]);
                } else {
                    error({message: "User not found"});
                }

            })
            .catch(function(err) {
                error(err);
            })
    };

    this.sendEmail = function(success, error) {

        function hasItem(array, item) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].userid == item.userid) return i;
            }
            return -1;
        }

        function generateFinalMailArray (data) {

            var final = [];
            var itemInd = -1;

            for(var x = 0; x < data.length; x++) {
                itemInd = hasItem(final, data[x]);
                if(itemInd == -1) {
                    data[x].tasks = [];
                    data[x].tasks.push({
                        taskListID: data[x].tasklistid,
                        taskName: data[x].taskname,
                        deadline: data[x].deadline
                    });
                    delete data[x].tasklistid;
                    delete data[x].taskname;
                    delete data[x].deadline;

                    final.push(data[x]);
                } else {
                    final[itemInd].tasks.push({
                        taskListID: data[x].tasklistid,
                        taskName: data[x].taskname,
                        deadline: data[x].deadline
                    });
                }
            }

            return final;
        }

        db.any("SELECT  u.userid, tl.tasklistid, tl.taskname, tl.deadline, u.email, u.firstname "+
            "FROM tasklist tl "+
            "INNER JOIN users u on u.userid = tl.userid "+
            "WHERE deadline IS NOT NULL " +
            "AND tl.sendemailnotification IS TRUE " +
            "AND tl.deadline < (current_timestamp + INTERVAL '48 HOURS' ) :: DATE " +
            "AND tl.deadline > current_timestamp", null)
            .then(function(data) {
                if(data && data.length) {

                    var final = generateFinalMailArray(data);

                    async.each(final,
                        function (singleUserData, callback) {
                             mailer.sendEmail(singleUserData);
                             callback();
                        },
                        function (err) {
                            if (err) {
                                error(err);
                            }
                            else {
                                success({message:'Emails sent!'});
                            }
                        }
                    );


                } else {
                    error({message: "No tasks found!"});
                }

            })
            .catch(function(err) {
                error(err);
            });
    }

}

module.exports = userModel;