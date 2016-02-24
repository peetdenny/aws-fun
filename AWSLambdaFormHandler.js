var aws = require('aws-sdk');
var ses = new aws.SES({
   accessKeyId: 'AS1fIdT1peMyR34lAcc3sk3y',  // never check in your real credentials
   secretAccesskey: '9mYJz/Ws1artibartf4rstyh :)',
   region: 'eu-west-1' 
});

var sendEmail = function(emailDetails, context){
    if( !emailDetails.email) context.fail("Please provide at least an email address");
    console.log("sending email with following details: ", emailDetails)
    var messageParts = [];
    messageParts.push("Email Address: "+emailDetails.email)
    if (emailDetails.name) messageParts.push("Name: "+emailDetails.name);
    if (emailDetails.company) messageParts.push("Company: "+emailDetails.company);
    if (emailDetails.subject) messageParts.push("Subject: "+emailDetails.subject);
    if (emailDetails.message) messageParts.push("Message: \n"+emailDetails.message);
    var params = {
        Destination: { ToAddresses: [ 'Best Boy Electric <team@bestboyelectric.io>' ] },
        Message: {
          Body: { Text: { Data: messageParts.join("\r\n"), Charset: 'UTF-8' } },
          Subject: { Data: "You've got an electric message", Charset: 'UTF-8' }
        },
        Source: "Contact Form <team@bestboyelectric.io>",
        ReplyToAddresses: [ "team@bestboyelectric.io" ]
    };

    ses.sendEmail(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      context.fail(err);
    } else {
      console.log("Email send confirmed with following", data);
      context.succeed('Thanks for dropping us a line');
    }
  });
}

exports.handler = function(event, context) {
    console.log("Incoming: ", event);
    
    console.log("email address=",event.email)
    var emailDetails = {
        "name": event.name,
        "email": event.email,
        "company": event.company,
        "subject": event.subject,
        "message": event.message
    };
    sendEmail(emailDetails, context)
};
