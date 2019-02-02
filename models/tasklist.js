var db = require('../pgDB/pgClient');
var fs = require('fs');
var moment = require('moment');

function taskListModel(){
    var $this = this;
    this.taskListId = '';
    this.listid = '';
    this.taskName = '';
    this.statusId = '';
    this.sendEmail = false;
    this.deadline = null;

    this.getAllTasksForUser = function(userID, success, error) {
        db.any('select * from tasklist tl ' +
            'where tl.userid = $1 order by tl.deadline DESC', [userID])
            .then(function (data) {
                success(data);
            })
            .catch(function (err) {
                error(err);
            });
    };

    this.getSingleTask= function(userID, taskID, success, error) {
        db.one('select * from tasklist tl ' +
            'where tk.tasklistid = $1 tl.userid = $2 ', [taskID, userID])
            .then(function (data) {
                if(data.tasklistid) {
                    success(data)
                } else {
                    error({message: "No lists found"});
                }
            })
            .catch(function (err) {
                error(err);
            });
    };

        this.createTask = function(userID, success, error) {

        $this.deadline = !$this.deadline ? null : $this.deadline;

        db.none('insert into tasklist(taskname, statusid, deadline, sendemailnotification, userid)' +
            'values($1, $2, $3, $4, $5)', [$this.taskName, $this.statusId, $this.deadline, $this.sendEmail, userID])
            .then(function (data) {

                $this.retrieveAllAndSaveToFile("select * from tasklist", [], 'tasks', function(successData) {
                    success({message: "Task created!"});
                }, function(errData) {
                    error(errData);
                })
            })
            .catch(function (err) {
                error(err);
            });
    };

    this.updateTask = function(userID, taskID, success, error) {
        $this.deadline = !$this.deadline ? null : $this.deadline;

        db.none('update tasklist set taskname=$1, sendemailnotification = $2, deadline = $3, statusId= $4 where tasklistid=$5 and userid = $6',
            [$this.taskName, $this.sendEmail, $this.deadline, $this.statusId, taskID, userID])
            .then(function () {
                success({message: 'Task updated!'});
            })
            .catch(function (err) {
                error(err);
            });
    };

    this.removeTask= function (userID, taskID, success, error) {

        db.one('select * from tasklist tl ' +
            'where tl.tasklistid = $1 and tl.userid = $2 ', [taskID, userID])
            .then(function (data) {
                if(data.tasklistid) {
                    db.result('delete from tasklist where tasklistid = $1', [taskID])
                        .then(function (result) {
                            success({message: 'Task deleted!'});
                        })
                        .catch(function (err) {
                            error(err);
                        });
                } else {
                        error({message: "Task not found!"});
                }
            })
            .catch(function (err) {
                error(err);
            });
    };

    this.retrieveAllAndSaveToFile = function(query, queryParams, fileName, success, error) {
        db.any(query, queryParams)
            .then(function(data) {
                fs.writeFile (moment().format('MM-DD')+'-'+fileName+".json", JSON.stringify(data, null, 4), function(err) {
                        if (err) {
                            return error(err);
                        }
                        success({message: "complete"});
                    }
                )
            })
            .catch(function(err) {
                error(err)
            })

    }

}

module.exports = taskListModel;