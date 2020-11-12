import json
import urllib
import boto3

db = boto3.resource('dynamodb')

def lambda_handler(event, context):
    print(event, flush=True)
    key = urllib.parse.unquote_plus(event['requestPayload']['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
    submission_id = key.split("/")[-2]
    
    update_submission(submission_id, status="wrong_answer")
        
    return {
        'statusCode': 200,
        'body': json.dumps('Database Updated!')
    }


def update_submission(submission_id, **kwargs):
      update_expression = ",".join(f"#{key} = :{key}" for key in kwargs.keys())
      names = {f"#{key}": key for key in kwargs.keys()}
      values = {f":{key}": value for key,value in kwargs.items()}

      db.Table('submission').update_item(
        Key={ 'submission_id': submission_id },
        UpdateExpression=f"SET {update_expression}",
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names)