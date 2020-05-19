/*
Triggered by:
SNS
TransactionResponseTopic
arn:aws:sns:us-east-1:731082486540:TransactionResponseTopic

Objective:
1. Send response email to email address of user.

Parameter: 
1. Sender Account Number
2. Receiver Account Number
3. Amount


Identity and Access Management (IAM) Roles (Send_Response_Email_Function-role-odmde0ju):
Policies Required to run the function are -
1. AWSLambdaBasicExecutionRole
2. SendEmailSESPolicy
    //JSON Policy
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": [
                            "ses:SendEmail",
                            "ses:SendRawEmail"
                        ],
                        "Resource": "*"
                    }
                ]
            }
    // Visually
    Service:    SES

    Actions: 
                Write
                SendEmail
                SendRawEmail

    Resources:  All resources


*/
console.log('Loading function');
const AWS = require('aws-sdk');
// Change region as required
const SES = new AWS.SES({ region: 'us-east-1' });
exports.handler = async(event,context,callback) => {
    // Reads message from SNS and loads "sa","ra" and "amt" value
    var message = event.Records[0].Sns.Message;
    console.log('Message received from SNS:', message);
    message=JSON.parse(message);
    var sa=message.sa;
    var ra=message.ra;
    var amt=message.amt;
    
     const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body><h1>Hello from Bank   ! </h1></body>
    </html>
  `;
  // Change TEXT, subject as required.
  var TEXT=amt + "  is deposited in your bank "
  const subject="Bank Alert Message!";
  const fromBase64 = Buffer.from('Gribesh').toString('base64');
  const sesParams = {
    // Default template to send email
    Destination: {
      ToAddresses: [ra],
    },
    Message: {
      Body: {
        
         Text: {
       Charset: "UTF-8",
       Data: TEXT
      }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    //ReplyToAddresses: [replyTo],
    Source: `=?utf-8?B?${fromBase64}?= <gribeshdhakal@gmail.com>`,
  };
  // Send email with the parameters
  const response = await SES.sendEmail(sesParams).promise();

  console.log(response);
    //callback(null, "Success");
};