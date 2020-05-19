"""
Triggered by:
SQS

TransactionSNSTopicQueue
arn:aws:sqs:us-east-1:731082486540:TransactionSNSTopicQueue
Batch size: 10


Objective:
1. Process the transaction and updates in Database (AccountDetails)
2. Read email address of user from MCP.
3. Send response email to the user.

Parameter: AccountNumber

Identity and Access Management (IAM) Roles (Get_Transaction_Details_Function-role-yy2d6rym):
Policies Required to run the function are -
1. AWSLambdaBasicExecutionRole 
2. AmazonSNSFullAccess
"""
import requests
from bs4 import BeautifulSoup
import json
import boto3
import decimal
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

sns = boto3.client('sns')
dynamodb = boto3.resource('dynamodb')
#AccountDetails is the database that stores account related information (AccountNumber, AccountName, Amount).
#Change name of database as required
table= dynamodb.Table('AccountDetails')

print('Loading function')
def lambda_handler(event, context):
    lo=''
    #Reads the event that is received from SQS and loads sender account, receiver account and amount
    for record in event['Records']:
        print ("test")
        payload=record["body"]
        payload=json.loads(payload)
        payload=payload['Message']
        print(str(payload))
        lo=json.loads(payload)

    sender_acc=lo['sa']
    receiver_acc=lo['ra']
    send_amt=lo['amt']
    print(send_amt+' is sent to ' + receiver_acc + ' from ' + sender_acc)
    
    #Formats the json result
    class DecimalEncoder(json.JSONEncoder):
        def default(self, o):
            if isinstance(o, decimal.Decimal):
                if o % 1 > 0:
                    return float(o)
                else:
                    return int(o)
            return super(DecimalEncoder, self).default(o)
    
    # sender_acc=123;
    # send_amt=10;
    # receiver_acc=1234;
    sender_acc=int(sender_acc)
    receiver_acc=int(receiver_acc)
    send_amt=int(send_amt)
    
    #Sender Side
    
    response=table.get_item(
        Key={
            'AccountNumber':sender_acc
        }    
    )
    
    result=response['Item']
    formatresult=json.dumps(result, indent=4, cls=DecimalEncoder)
    userdetails = json.loads(formatresult)
    amount=int(userdetails["Amount"])
    print(amount)
    
    #Subtract the amount
    x=amount-send_amt
    x=str(x)
    
    #Update new amount in database
    response = table.update_item(
        Key={
            "AccountNumber":sender_acc
        },
        UpdateExpression="set Amount = :a",
        ExpressionAttributeValues={
            ":a":x
        },
        ReturnValues="UPDATED_NEW"
    )

    print("UpdateItem succeeded:")
    print(json.dumps(response, indent=4, cls=DecimalEncoder))
    
    
    #Receiver Side
        
    response=table.get_item(
        Key={
            'AccountNumber':receiver_acc
        }    
    )
    
    result=response['Item']
    formatresult=json.dumps(result, indent=4, cls=DecimalEncoder)
    userdetails = json.loads(formatresult)
    amount=int(userdetails["Amount"])
    print(amount)
    
    #Add the amount
    x=amount+send_amt
    x=str(x)
    
    #Update new amount in database
    response = table.update_item(
        Key={
            "AccountNumber":receiver_acc
        },
        UpdateExpression="set Amount = :a",
        ExpressionAttributeValues={
            ":a":x
        },
        ReturnValues="UPDATED_NEW"
    )

    print("UpdateItem succeeded:")
    print(json.dumps(response, indent=4, cls=DecimalEncoder))
    
    """
    # Connect to MCP machine
    url='http://96.64.80.81/MCPConnector/get/values/1'
    resp=requests.get(url)
    words=[]
    if resp.status_code==200: 
    	print(resp)
    	print("Successfully Accessed Web Page " + str(resp)) 
    	resp=str(resp.content)
    	print(resp)
    	words=resp.split(">")
    	print(words)
    	email=words[1].split('"')
    	print(email)
    	add=email[0].strip()
    	print(add)
    	payload={
    		  "sa": "gribeshdhakal2019@gmail.com",
    		  "ra": add,
    		  "amt": send_amt
    			}
    	payload=json.dumps(payload)
    	print(payload)
    	response = sns.publish(
    		TopicArn='arn:aws:sns:us-east-1:731082486540:TransactionResponseTopic',
    		Message=payload,
    		)
    	print(response)
    else: 
    	print(resp)
    	print("Error while accessing webpage" + str(resp))
    """
    # Uncomment above lines to check with MCP and comment line 162
    add="gribeshdhakal@gmail.com"
    
    # Payload that is sent to SNS
    payload={
        "sa": "gribeshdhakal2019@gmail.com",
        "ra": add,
        "amt": send_amt
        
    }
    payload=json.dumps(payload)
    print(payload)
    #Publish the message to SNS with payload
    response = sns.publish(
        TopicArn='arn:aws:sns:us-east-1:731082486540:TransactionResponseTopic',
        Message=payload,
        )
    print(response)

     #After successful sending of email return status code 200 and allow CORS Policy 
    return {
        'statusCode':200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        # This message can be changed
        'body':'Completed'
    }