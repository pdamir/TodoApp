# TodoApp API

## Prerequisites

In order to run the API, NodeJS and NPM must be installed on the machine.

Try running the following commands, which should output version numbers for Node and NPM respectively
```shell
 node -v
```
or 
```shell
 nodejs -v
```

```shell
 npm -v
```

If none of the above commands output the version numbers, you need to install Node / NPM on your machine.
Please use the tutorial on the following link to accomplish that.

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04

Run above commands again and check your version numbers.
If outputs are ok, you may proceed.

Since the API is retrieving the data from the database, it will need to be set up.
Database was created in PostgreSQL, so it should be installed in order to deploy the database from the SQL dump.
Try running the following command to see if you have PostgreSQL installed:
```shell
 psql --version
```

If no version output is returned, PostgreSQL will need to be installed on your machine.
You can accomplish it by following the tutorial linked below.

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04


Once that is done, proceed by importing the 


Inside the helper.js file which is located in the root of the API folder, you will find API configuration strings.
```
./helper.js
```

One that might need to be changed to fit your Postgres configuration is 

```json
dbConnection: {
        host: "localhost",
        port: 5432,
        database: "todoapp",
        user: "postgres",
        password: "postgres"
    }
```

Please replace values in that json object with the values you have set during Postgres installation.


Prior to running the API, you need to run 'npm install' command from the root of the API folder, to install the required packages.
Once it is done, you can run 'npm start' command to start the API.

Important: TodoApp-Front - angular app, will not be able to run properly unless the API is running

## General Description

API contains the logic to create and read users, and also to create, read, update and delete tasks for authenticated user.

## Email Notifications Cron job

API contains a cron job, which will send emails to people regarding tasks whose deadline is in the next 48 hours. 
Sending email notifications for a particular task can be toggled through the form on front-end during task creation or editing.

Configuration for cron job trigger time can be found in helper.js. Currently, it is set to the following values.

```json
scheduledEmails: {
        "hour": 8,
        "minute":1,
        "second": 1
    }
```

Which means that, while the API is running, cron job will be triggered at 08:01 in the morning.
For testing purposes, feel free to change the config to your liking once you have created a few tasks and selected to receive email notifications for them.

## Login

### Request
```html
POST /login
```
```json
{
	"email": "foo@bar.com",
	"password":"Password1#"
}
```

### Response
### *Success*
```json
{
  "access_token": "U2FsdGVkX18BN0y8mn2qkde7RZbmdw2JKh2F/nNQ/bBz0slTMckNZlEfZD/HrFz8R2vWQ0n0GlZ7vxOmLMqaGGbTBmigvBDYU8MAsrEpL4g=",
  "expDate": "2018-01-25 21:42:56"
}
```
##### *Errors*
```json
{
    "error": "Login failed",
    "data": {
        "error": "User not found"
    }
}
```

## Registration

```html
POST /register
```

##### Request
```json
{
	"firstName":"Foo",
	"lastName":"Barovic",
	"email": "foo@bar.com"
}
```
##### Response
##### *Success* 
```json
{
	"firstName":"Foo",
	"lastName":"Barovic",
	"email": "foo@bar.com"
}
```

## Email notification
```html
GET /mail
```

##### Response
##### *Success*
```json
{
    "message":"Emails sent!"
}
```


## TaskList

### Create single task
```html
POST /task
```

##### Request
```json
{
	"taskName": "Travel abroad!",
	"statusId": 1,
	"sendEmail": false,
	"deadline": "2018-05-03"
}
```
##### Response
##### *Success* 
```json
{
    "message": "Task created!"
}
```

### Edit single task
```html
PUT /task/:id
```

##### Request
```json
{
	"taskName": "Travel locally!",
	"statusId": 1,
	"sendEmail": false,
	"deadline": "2018-05-03"
}
```
##### Response
##### *Success* 
```json
{
    "message": "Task created!"
}
```
### Get all tasks
```html
GET /task
```

#### Response
```json
[
    {
        "tasklistid": 2,
        "taskname": "Do the laundry",
        "statusid": 1,
        "sendemailnotification": false,
        "deadline": null,
        "userid": 5
    },
    {
        "tasklistid": 6,
        "taskname": "Prepare for work presentation",
        "statusid": 3,
        "sendemailnotification": false,
        "deadline": "2018-05-02T22:00:00.000Z",
        "userid": 5
    },
    {
        "tasklistid": 4,
        "taskname": "Request payment from client",
        "statusid": 3,
        "sendemailnotification": false,
        "deadline": "2018-05-01T22:00:00.000Z",
        "userid": 5
    },
    {
        "tasklistid": 3,
        "taskname": "Clean my room",
        "statusid": 2,
        "sendemailnotification": false,
        "deadline": "2018-04-30T22:00:00.000Z",
        "userid": 5
    }
]
```

### Get single task
```html
GET /task/:id
```

##### Response
##### *Success* 
```json
{
    "tasklistid": 4,
    "taskname": "Request payment from client",
    "statusid": 3,
    "sendemailnotification": false,
    "deadline": "2018-05-01T22:00:00.000Z",
    "userid": 5
}
```
### Delete task
```html
DELETE /task/:id
```

##### Response
##### *Success* 
```json
{ 
    "message": "Task deleted!"
}
```
##### *Errors*
```json
{
    "message": "Task not found!"
}
```

