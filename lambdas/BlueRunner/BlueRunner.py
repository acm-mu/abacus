import boto3, os, subprocess, urllib.parse, time, re

s3 = boto3.resource('s3')
db = boto3.resource('dynamodb')

def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    
    if not(bucket_name == "abacus-submissions"):
        return
    
    bucket = s3.Bucket("abacus-submissions")
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    file_parts = re.findall(r'(.*)\/(.*)\.(.*)', key)[0]

    submission_id = file_parts[0]
    filename = file_parts[1]
    file_ext = file_parts[2]
    
    start_d = db.Table('setting').get_item(
        Key={
            'key': 'start_date'
        })['Item']
    
    submission = db.Table('submission').get_item(
        Key={
            'submission_id': submission_id
        })['Item']
        
    problem = db.Table('problem').get_item(
        Key={
            'problem_id': submission['problem_id']
        })['Item']
        
    start_date = time.localtime(int(start_d['value']))
    submission_time = time.localtime(submission['date'])

    print("Start date: {}".format(start_date))
    print("Sub time: {}".format(submission_time))

    sd_hours = start_date.tm_hour
    sd_mins = start_date.tm_min
    sub_hours = submission_time.tm_hour
    sub_mins = submission_time.tm_min

    print("Start Time: {}:{}".format(sd_hours, sd_mins))
    print("Submit Time: {}:{}".format(sub_hours, sub_mins))

    if(sd_hours == 0):
        sd_hours = 24
    elif(sub_hours == 0):
        sub_hours = 24

    print("Start Time: {}:{}".format(sd_hours, sd_mins))
    print("Submit Time: {}:{}".format(sub_hours, sub_mins))
    
    hours = 60 * abs(sub_hours - sd_hours)
    minutes = sub_mins - sd_mins
    general_score = hours + minutes
    submission['tests'] = problem['tests']
        
    # Update database
    db.Table('submission').update_item(
        Key={
            'submission_id': submission_id
        },
        UpdateExpression=f"SET tests = :tests, #state = :state",
        ExpressionAttributeValues={
            ':tests': submission['tests'],
            ':state': "pending"
        },
        ExpressionAttributeNames={
            "#state": "status"
        })
        
    timeout = problem['cpu_time_limit']
    timeout = float(timeout) / 1000 if timeout != "" else None
    
    # Download File
    os.makedirs('/tmp', exist_ok=True)
    bucket.download_file(key, f"/tmp/{ filename }.{ file_ext }") #concerned about what this is expecting
    
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
        points_per_no = int(db.Table('setting').get_item(
            Key={
                'key': 'points_per_no'
            })['Item']['value'])
        
        points_per_yes = int(db.Table('setting').get_item(
            Key={
                'key': 'points_per_yes'
            })['Item']['value'])
        
        points_per_minute = int(db.Table('setting').get_item(
            Key={
                'key': 'points_per_minute'
            })['Item']['value'])
        
        tries = int(submission['sub_no'])
        score = (int(general_score) * points_per_minute) + (points_per_no * tries) + points_per_yes
        print("hr: {}, min: {}, gs: {}, t: {}, score: {}".format(hours, minutes, general_score, tries, score))
    # Update database
    db.Table('submission').update_item(
        Key={
            'submission_id': submission_id
        },
        UpdateExpression=f"SET tests = :tests, #state = :state, runtime = :runtime, score = :score",
        ExpressionAttributeValues={
            ':tests': submission['tests'],
            ':state': status,
            ':runtime': int(runtime * 1000),
            ':score': int(score)
        },
        ExpressionAttributeNames={
            "#state": "status"
        })
    
    return True