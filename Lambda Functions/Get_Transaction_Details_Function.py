"""
Triggered by:
Transaction_API
arn:aws:execute-api:us-east-1:731082486540:nst07ve964/*/POST/deposit
Details
API endpoint: https://nst07ve964.execute-api.us-east-1.amazonaws.com/prod/deposit
API type: REST
Authorization: COGNITO_USER_POOLS
Method: POST
Resource path: /deposit
Stage: prod

Objective:
1. Get transaction details from api gateway
2. Send those transaction details to the SNS Topic (TransactionTopic)

Parameter: AccountNumber

Identity and Access Management (IAM) Roles (Get_Transaction_Details_Function-role-yy2d6rym):
Policies Required to run the function are -
1. AWSLambdaBasicExecutionRole 
2. AmazonSNSFullAccess
"""
import json
import boto3 #Amazon_SDK
import decimal
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
#AccountDetails is the database that stores account related information (AccountNumber, AccountName, Amount).
#Change name of database as required
table= dynamodb.Table('AccountDetails') 

def lambda_handler(event, context):
    #Reads the event that is received from api gateway and loads 
    print(event)
    du=json.dumps(event)
    lo=json.loads(du)
    print(lo['body'])
    body=lo['body']
    du=json.dumps(body)
    print(du)
    lo=json.loads(du)
    lo=json.loads(lo)
    
    #Change this topic arn as required.
    topicarn='arn:aws:sns:us-east-1:731082486540:TransactionTopic'
    snsClient=boto3.client('sns')
    #publish= '{"sender_acc":sender_acc,"receiver_acc":receiver_acc",send_amt":send_amt}'
    #publish="Hello from gribesh"
    publish=lo
    #Publish message to the SNS
    snsClient.publish(TopicArn=topicarn,Message=json.dumps(publish),Subject='Transaction',MessageAttributes={"TransactionType":{"DataType":"String","StringValue":"Transaction"}})

     #After successful sending of email return status code 200 and allow CORS Policy 
    return {
        'statusCode':200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        # This message can be changed.
        'body':'Completed'
    }