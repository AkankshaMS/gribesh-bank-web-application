"""
Triggered by:
OTP_API
arn:aws:execute-api:us-east-1:731082486540:ddzczm8zei/*/GET/*
Details
API endpoint: https://ddzczm8zei.execute-api.us-east-1.amazonaws.com/prod/{AccountNumber}
API type: REST
Authorization: NONE
Method: GET
Resource path: /{AccountNumber}
Stage: prod

Objective:
1. Reads the otp of user through AccountNumber from "OTP" database and return the same.

Parameter: AccountNumber

Identity and Access Management (IAM) Roles (OTP_Read_Function-role-84wbeden):
Policies Required to run the function are -
1. AWSLambdaBasicExecutionRole 
2. AmazonDynamoDBFullAccess 
    (Note: Instead of Full Access, Read only access can be provided)

"""
import json
import boto3
import decimal
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
#OTP is the database that stores (AccountNumber, Email, OTP).
#Change name of database as required
table= dynamodb.Table('OTP')

def lambda_handler(event,context):
    #Reads the event that is received from api gateway and loads sender_acc
    print(event)
    du=json.dumps(event)
    lo=json.loads(du)
    print(lo['pathParameters'])
    body=lo['pathParameters']
    du=json.dumps(body)
    print(du)
    lo=json.loads(du)
    acc_num=lo['AccountNumber']
    print(acc_num)
    acc_num=int(acc_num)

    #Formats json value
    class DecimalEncoder(json.JSONEncoder):
        def default(self, o):
            if isinstance(o, decimal.Decimal):
                if o % 1 > 0:
                    return float(o)
                else:
                    return int(o)
            return super(DecimalEncoder, self).default(o)

    #Reads table value as AccountNumber as key    
    response=table.get_item(
        Key={
            'AccountNumber':acc_num
        }    
    )
    result=response['Item']
    formatresult=json.dumps(result, indent=4, cls=DecimalEncoder)
    print(result["OTP"])
    #Get otp value from the response of DynamoDB
    otp=result["OTP"]
    userdetails = json.loads(formatresult)
    response=userdetails
    print("This is response " + str(response))

    #After successful process, return status code 200 and allow CORS Policy 
    return {
        'statusCode':200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        #This should only return "otp" value
        'body':otp
    }