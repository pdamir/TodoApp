var cron = require('node-schedule');
var helper=require('../helper');
var mailRule = helper.scheduledEmails;


var mails = {

    generateNotificationMails:function() {

        var emailRule = new cron.RecurrenceRule();

        emailRule.hour = mailRule.hour;
        emailRule.minute = mailRule.minute;
        emailRule.second = mailRule.second;

        cron.scheduleJob(emailRule, function() {
            console.log("Running the generate emails task...");

            var user=new (require('../models/user'))();

            user.sendEmail(function(successData) {
                console.log('Sent emails!');
            }, function(errData) {
               console.log(errData);
            });

        });
    }
};

module.exports = mails;