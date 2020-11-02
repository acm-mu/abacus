import os, hashlib, boto3, time, hashlib, uuid
from flask import session

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

  def auth_login(self, form_data):
    m = hashlib.sha256()
    m.update(form_data['password'].encode())
    password = m.hexdigest()

    for user in self.users().values():
      if user['user_name'] == form_data['user-name']:
        if user['password'] == password:
          session['user_id'] = user['user_id']
          session['user_name'] = user['user_name']
          session['user_type'] = user['type']
          session['division'] = user['division']
          return True
        
    return False

  def home(self):
    if 'user_id' not in session or session['user_type'] == "team":
      return f"/{session['division']}"
    
    if session['user_type'] == 'admin':
      return '/admin'

  def problems(self):
    problems = self.db.Table('problem').scan()['Items']
    return {problem['id']: problem for problem in problems}
    
  def settings(self):
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
  
  def submissions(self):
    submissions = self.db.Table('submission').scan()['Items']
    return {sub['submission_id']: sub for sub in submissions}

  def users(self):
    users = self.db.Table('user').scan()['Items']
    return {user['user_id']: user for user in users}

  def submit(self, request):
    language = request.form['language']
    main_class = request.form['main-class']
    sub_file = request.files['sub-file']
    submission_id = uuid.uuid4().hex

    problem_id = request.form['problem-id']
    problem = self.problems()[problem_id]

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
        'sub_no': 0,
        'status': "pending",
        'runtime': 0,
        'date': int(time.time() * 1000),
        'language': language,
        'main_class': main_class,
        'filename': sub_file.filename,
        'filesize': file_size,
        'sha1sum': h.hexdigest(),
        'team_id': session['user_id'],
        'team_name': session['user_name'],
        'prob_id': problem_id,
        'prob_name': problem['problem_name'],
        'tests': problem['tests']
      }

    self.db.Table('submission').put_item(
      Item=item
    )
    
    return item
  
contest = ContestService()