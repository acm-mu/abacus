import os, hashlib, boto3, time, hashlib, uuid
from flask import session
from boto3.dynamodb.conditions import Attr

class ContestService:
  def __init__(self):
    self.init_aws()

  def init_aws(self):
    aws_access_key = os.environ.get('AWS_ACCESS_KEY', None)
    aws_secret_key = os.environ.get('AWS_SECRET_KEY', None)

    if not(aws_access_key) or not(aws_secret_key):
      self.db = self.s3 = None

    self.aws = boto3.Session(
      aws_access_key_id=aws_access_key, 
      aws_secret_access_key=aws_secret_key,
      region_name="us-east-2")

    self.db = self.aws.resource('dynamodb')
    self.s3 = self.aws.resource('s3')
    self.lmbda = self.aws.client('lambda')

  def auth_login(self, form_data):
    m = hashlib.sha256()
    m.update(form_data['password'].encode())
    password = m.hexdigest()

    for user in self.get_users().values():
      if user['user_name'] == form_data['user-name']:
        if user['password'] == password:
          session['user_id'] = user['user_id']
          session['user_name'] = user['user_name']
          session['user_type'] = user['type']
          session['division'] = user['division']
          # TODO: Instead these should be retrieved from the /api/contest endpoint via the session_token variable. Do a database lookup for the user with that token.
          session['session_token'] = uuid.uuid4().hex

          self.db.Table('user').update_item(
            Key={'user_id': user['user_id']},
            UpdateExpression=f"SET session_token = :session_token",
            ExpressionAttributeValues={':session_token': session['session_token']})
          return True
        
    return False

  def is_logged_in(self):
    if 'user_id' in session:
      user = self.db.Table('user').scan(FilterExpression=Attr('user_id').eq(session['user_id']))['Items']
      if user and 'session_token' in user[0]:
        return user[0]['session_token'] == session['session_token']
    return False

  def is_judge(self):
    if self.is_logged_in():
      return session['user_type'] == "judge"
    return False

  def is_admin(self):
    if self.is_logged_in():
      return session['user_type'] == "admin"
    return False

  def home(self):
    if 'user_id' not in session or session['user_type'] == "team":
      return f"/{session['division']}"

    if session['user_type'] == 'judge':
      return '/'
    
    if session['user_type'] == 'admin':
      return '/admin'
    
  def get_settings(self):
    settings = self.db.Table('setting').scan()['Items']
    return {s['key']: s['value'] for s in settings}

  def save_settings(self, settings):
    with self.db.Table('setting').batch_writer() as batch:
      for key, value in settings.items():
        batch.put_item(
          Item={
            'key': key,
            'value': value
          })

  def get_problems(self, **kwargs):
    filter_expression = " AND ".join(f"#{key} = :{key}" for key in kwargs.keys())
    names = {f"#{key}": key for key in kwargs.keys()}
    values = {f":{key}": value for key,value in kwargs.items()}

    if kwargs:
      problems = self.db.Table('problem').scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names)['Items']
    else:
      problems = self.db.Table('problem').scan()['Items']
    
    return {problem['id']: problem for problem in problems}
  
  def get_submissions(self, **kwargs):
    filter_expression = " AND ".join(f"#{key} = :{key}" for key in kwargs.keys())
    names = {f"#{key}": key for key in kwargs.keys()}
    values = {f":{key}": value for key,value in kwargs.items()}

    if kwargs:
      submissions = self.db.Table('submission').scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names)['Items']
    else:
      submissions = self.db.Table('submission').scan()['Items']
      
    return {sub['submission_id']: sub for sub in submissions}

  def get_users(self, **kwargs):
    filter_expression = " AND ".join(f"#{key} = :{key}" for key in kwargs.keys())
    names = {f"#{key}": key for key in kwargs.keys()}
    values = {f":{key}": value for key,value in kwargs.items()}

    if kwargs:
      users = self.db.Table('user').scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names)['Items']
    else:
      users = self.db.Table('user').scan()['Items']

    return {user['user_id']: user for user in users}

  def submit(self, request):
    language = request.form['language']
    sub_file = request.files['sub-file']
    submission_id = uuid.uuid4().hex

    problem_id = request.form['problem-id']
    problem = [prob for prob in contest.get_problems().values() if prob['problem_id'] == problem_id][0]

    sub_no = len([sub for sub in self.get_submissions().values() if sub['team_id'] == session['user_id'] and sub['problem_id'] == problem_id])

    # Upload file to AWS S3 Bucket
    key = f"{ submission_id }/{ sub_file.filename }"
    self.s3.Bucket('abacus-submissions').upload_fileobj(sub_file, key)
    obj = self.s3.Bucket('abacus-submissions').Object(key).get()['Body']

    # Generate sha1 hash for file
    h = hashlib.sha1()
    h.update(obj.read())

    file_size = self.s3.ObjectSummary('abacus-submissions', key).size

    item = {
        'submission_id': submission_id,
        'sub_no': sub_no,
        'status': "pending",
        'runtime': 0,
        'score': 0,
        'date': int(time.time()),
        'language': language,
        'filename': sub_file.filename,
        'filesize': file_size,
        'sha1sum': h.hexdigest(),
        'team_id': session['user_id'],
        'problem_id': problem_id,
        'tests': problem['tests']
      }

    self.db.Table('submission').put_item(
      Item=item
    )
    
    return item
  
contest = ContestService()