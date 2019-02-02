var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var mailerConfig = require('../helper').mailerConfig;
var moment = require('moment');

var xoauth2gen = xoauth2.createXOAuth2Generator(mailerConfig);

xoauth2gen.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
    xoauth2gen.accessToken=token.accessToken;
});

var helper={

    sendEmail:function(data){

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                xoauth2: xoauth2gen
            }
        });


        if(!data.firstname) {
            data.firstname = data.email
        }

        var text = 'Hi '+data.firstname+'!\n\n'+
                'Deadline for your task(s) are approaching soon.\n\n'+
                'Tasks: \n';

        data.tasks.forEach(function(singleTask) {
            text+= singleTask.taskName+' due on '+moment(singleTask.deadline).format('LL')+'. \n'
        });

        text+= '\n' +
            'If you would like to stop receiving email notifications for these tasks, please edit them in TodoApp.\n\n'+
                'Your TodoApp team';

        var mailOptions = {
            from: 'todoapp.sh@gmail.com',
            to: data.email,
            subject: '=?utf-8?B?4pii77iP?= ' + 'Task deadlines approaching!',  // base64 encoded email subject icon
            text: text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error)
            }
            console.log('An e-mail has been sent to '+data.email+' \n\n');
            console.log(info);
            transporter.close();
        });
    }



};

module.exports=helper;