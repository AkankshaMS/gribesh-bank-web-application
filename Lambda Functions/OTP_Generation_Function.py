"""
Triggered by :
OTP_API
arn:aws:execute-api:us-east-1:731082486540:ddzczm8zei/*/POST/generate
Details
API endpoint: https://ddzczm8zei.execute-api.us-east-1.amazonaws.com/prod/generate
API type: REST
Authorization: NONE
Method: POST
Resource path: /generate
Stage: prod

Objective:
1. Generates a new OTP and stores in "OTP" (DynamoDB).
2. Sends email to the email address of the user.

Parameter: AccountNumber

Identity and Access Management (IAM) Roles (OTP_Generation_Function-role-e15xl4id):
Policies Required to run the function are -
1. AWSLambdaBasicExecutionRole 
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "logs:CreateLogGroup",
                    "Resource": "arn:aws:logs:us-east-1:731082486540:*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "logs:CreateLogStream",
                        "logs:PutLogEvents"
                    ],
                    "Resource": [
                        "arn:aws:logs:us-east-1:731082486540:log-group:/aws/lambda/OTP_Generation_Function:*"
                    ]
                }
            ]
        }
        Note: arn of lambda function should be changed.
2. AmazonDynamoDBFullAccess
3. AmazonSESFullAccess

"""
import json
import random
import boto3 #Amazon_SDK
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
#OTP is the database that stores (AccountNumber, Email, OTP).
#Change name of database as required
table= dynamodb.Table('OTP')

def lambda_handler(event, context):
    #Generates random number as otp in given range
    otp = random.randint(100000,999999)
    print("OTP", otp)
    #Reads the event that is received from api gateway and loads sender_acc
    print(event)
    du=json.dumps(event)
    lo=json.loads(du)
    print(lo['body'])
    body=lo['body']
    du=json.dumps(body)
    print(du)
    lo=json.loads(du)
    lo=json.loads(lo)
    sender_acc=lo['sa']
    sender_acc=int(sender_acc)
    print(sender_acc)
    # Testing: Comment 25-46 and uncomment 48 to test this particular function only.
    # sender_acc=1234
    otp=str(otp)

    #Updates newly generated otp in the database
    response = table.update_item(
        Key={
            "AccountNumber":sender_acc
        },
        UpdateExpression="set OTP = :a",
        ExpressionAttributeValues={
            ":a":otp
        },
        ReturnValues="UPDATED_NEW"
    )

    print("UpdateItem succeeded:")
    
    #Gets the email address of the user as sender_acc is key value.
    response=table.get_item(
        Key={
            'AccountNumber':sender_acc
        }    
    )
    result=response['Item']
    email=result["Email"]
    print(email)
    resp="Success"
    #Sender and receiver email address need to be verifed in SES (specified region)
    SENDER = "gribeshdhakal@gmail.com"
    RECIPIENT = email
    #Change your region
    AWS_REGION = 'us-east-1'
    SUBJECT = "OTP"
    #Text of email that user receives.
    BODY_TEXT = "Your otp pin is "+ otp
    BODY_HTML = """<html>
   <head></head>
   <body>
     <h1>OTP PIN</h1>
     <p>You received OTP</p>
   </body>
   </html>
             """
    CHARSET = "UTF-8"
    #specify service name and region
    client = boto3.client('ses',region_name=AWS_REGION)
    try:
        #Default format to send email.
        response = client.send_email(
           Destination={
               'ToAddresses': [
                   RECIPIENT,
               ],
           },
           Message={
               'Body': {
                   'Text': {
                       'Charset': CHARSET,
                       'Data': BODY_TEXT,
                   },
               },
               'Subject': {
                   'Charset': CHARSET,
                   'Data': SUBJECT,
               },
           },
           Source=SENDER,
           )
           
    except ClientError as e:
        resp=e.response['Error']['Message']
    #   return(e.response['Error']['Message'])
    else:
        resp=response['MessageId']
        print('Email sent')
        #return("Email sent! Message ID:" + response['MessageId'] )

    #After successful sending of email return status code 200 and allow CORS Policy 
    return {
        'statusCode':200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        #Body message can be changed as required.
        'body':''
    }
    
