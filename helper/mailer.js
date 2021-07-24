const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "deeps1790@gmail.com",
        pass: "magicdevelopers"
    }
});

exports.sendMail =  (mailOptions, successCb, errCb) => {
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            errCb(error)
        }else{
            console.log("Message sent: " + response.message);
            successCb();
        }
    });
};
