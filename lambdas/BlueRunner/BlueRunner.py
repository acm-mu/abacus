import boto3, os, subprocess, urllib.parse, time, re
from datetime import datetime

s3 = boto3.resource('s3')
db = boto3.resource('dynamodb')

def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    if not(bucket_name == "abacus-submissions"):
        return
    
    bucket = s3.Bucket("abacus-submissions")
    key = urllib.parse.unquote_plus(key, encoding='utf-8')

    submission_id, filename, file_ext = re.findall(r'(.*)\/(.*)\.(.*)', key)[0]

    settings = db.Table('setting').scan()['Items']
    settings = {s['key']: s['value'] for s in settings}
    
    submission = get_item('submission', submission_id=submission_id)
    problem = get_item('problem', problem_id=submission['problem_id'])
        
    submission['tests'] = problem['tests']
        
    # Update database to pending
    update_submission(submission_id, 
        status="pending", 
        tests=submission['tests'])
        
    timeout = problem['cpu_time_limit']
    timeout = float(timeout) / 1000 if timeout != "" else None
    
    # Download File
    os.makedirs('/tmp', exist_ok=True)
    bucket.download_file(key, f"/tmp/{ filename }.{ file_ext }")
    
    # Run testcases
    status = "accepted"
    runtime = -1
    for test in submission['tests']:
        start_time = time.time()
        inp = test['in'].encode()
        try:
            if(file_ext == 'py'):
                cmd = f"python3 /tmp/{filename}.py"
            elif(file_ext == 'class'):
                cmd = f"java -cp /tmp/ {filename}"
            else:
                raise TypeError("Not a valid file type!")

            test_run = subprocess.run(cmd.split(" "), input=inp, capture_output=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            print("Result: TIMEOUT EXPIRED", flush=True)
            
            status = 'timeout_error'
            test['result'] = "rejected"
            continue
        except TypeError as err:
            print(err)
            continue

        runtime = max(runtime, time.time() - start_time)
        output = test_run.stdout.decode().strip()
        
        print("\n\nRUN OUTPUT", flush=True)
        print(output.encode(), flush=True)
        
        print("\nEXPECTED OUTPUT", flush=True)
        print(test['out'].encode(), flush=True)
        
        if output != test['out'] or test_run.stderr:
            print("\nResult: REJECTED", flush=True)
            status = "rejected"
            test['result'] = "rejected"
        else:
            print("\nResult: ACCEPTED", flush=True)
            test['result'] = "accepted"
    
    # Calculate score
    score = 0
    if status == "accepted":
        start_date = datetime.fromtimestamp(int(settings['start_date']))
        submission_time = datetime.fromtimestamp(submission['date'])
        
        minutes = int((submission_time - start_date).seconds / 60)

        points_per_no = int(settings['points_per_no'])
        points_per_yes = int(settings['points_per_yes'])
        points_per_minute = int(settings['points_per_minute'])
        
        tries = int(submission['sub_no'])
    
        score = (int(minutes) * points_per_minute) + (points_per_no * tries) + points_per_yes

    # Update database
    update_submission(submission_id, 
        tests=submission['tests'], 
        status=status, 
        runtime=int(runtime * 1000), 
        score=int(score))
    
    return True

def get_item(table, **key):
    return db.Table(table).get_item(Key=key)['Item']

def update_submission(submission_id, **kwargs):
      update_expression = ",".join(f"#{key} = :{key}" for key in kwargs.keys())
      names = {f"#{key}": key for key in kwargs.keys()}
      values = {f":{key}": value for key,value in kwargs.items()}

      db.Table('submission').update_item(
        Key={ 'submission_id': submission_id },
        UpdateExpression=f"SET {update_expression}",
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names)