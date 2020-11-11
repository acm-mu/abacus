import json
import urllib
import boto3

db = boto3.resource('dynamodb')

def lambda_handler(event, context):
    print(event, flush=True)
    key = urllib.parse.unquote_plus(event['requestPayload']['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
    submission_id = key.split("/")[-2]
    
    db.Table('submission').update_item(
        Key={
            'submission_id': submission_id
        },
        UpdateExpression='SET #st = :val1',
        ExpressionAttributeValues={
            ':val1': "wrong_answer"
        },
        ExpressionAttributeNames={
            '#st': "status"
        })
        
    return {
        'statusCode': 200,
        'body': json.dumps('Database Updated!')
    }