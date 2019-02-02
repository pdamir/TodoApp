var CryptoJS = require('node-cryptojs-aes').CryptoJS;

var helper={
    dbConnection: {
        host: "localhost",
        port: 5432,
        database: "todoapp",
        user: "postgres",
        password: "postgres"
    },
    scheduledEmails: {
        "hour": 8,
        "minute":1,
        "second": 1
    },
    cryptoKey: "Rht0YRauPNeaJlefvZwkQ8s6dUiXNkt8",
    mailerConfig: {
        user: 'todoapp.sh@gmail.com',
        clientId: '304406274038-9uirmehn23949lnspe7uc9eleegko00p.apps.googleusercontent.com',
        clientSecret: 'z1ZrG5y6dLJ7EW7Tbt8eCcjE',
        refreshToken: '1/pl3eG36TFcjY70d-XqJdv_M8JD-vyDmDFaydrG2p9RVVAymz12kdhzNamIRYrcMx',
        accessToken: 'ya29.GltGBdfaUir7s97yHm1JjzIBM-03cq4FIH2XtZm_gKq9y7gUPVJDDT23kd8PMCxU4bZCK4MmBaDwx69cW_9K3w3gbfniz97UIwKw8E0Jgnj4nwoBN_GfNtTuQ78i'
    },
    encrypt:function(input, key){
        return CryptoJS.AES.encrypt(input, key).toString();
    },
    decrypt:function(input, key){
        var decrypted = CryptoJS.AES.decrypt(input, key);
        return CryptoJS.enc.Utf8.stringify(decrypted);
    }
};

module.exports=helper;
