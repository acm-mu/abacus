import os, hashlib, boto3, time, hashlib
from flask import session

class ContestService:
  def __init__(self):
    self.init_aws()

    self.load_problems()
    self.load_settings()
    self.load_submissions()
    self.load_users()

  def auth_login(self, form_data):
    m = hashlib.sha256()
    m.update(form_data['password'].encode())
    password = m.hexdigest()

    for user in self.users.values():
      if user['user_name'] == form_data['username']:
        if user['password'] == password:
          session['user_id'] = user['user_id']
          session['user_name'] = user['user_name']
          session['user_type'] = user['type']
          return True
        
    return True

  def home(self):
    if 'user_id' not in session or session['user_type'] == "team":
      return '/'
    
    if session['user_type'] == 'admin':
      return '/admin'

  def load_problems(self):
    problems = self.db.Table('problem').scan()['Items']
    self.problems = {problem['problem_id']: problem for problem in problems}
    
  def load_settings(self):
    settings = self.db.Table('setting').scan()['Items']
    self.settings = {s['key']: s['value'] for s in settings}

  def save_settings(self, settings):
    self.settings = settings

    with self.db.Table('setting').batch_writer() as batch:
      for key, value in self.settings.items():
        batch.put_item(
          Item={
            'key': key,
            'value': value
          }
        )
  
  def load_submissions(self):
    submissions = self.db.Table('submission').scan()['Items']
    self.submissions = {sub['submission_id']: sub for sub in submissions}

  def load_users(self):
    users = self.db.Table('user').scan()['Items']
    self.users = {user['user_id']: user for user in users}

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

  def submit(self, problem, request, team):
    language = request.form['language']
    main_class = request.form['main_class']
    sub_file = request.files['sub_file']
    submission_id = '1'

    # Upload file to AWS S3 Bucket
    self.s3.Bucket('abacus-submissions').upload_fileobj(sub_file, f"{ submission_id }/{ sub_file.filename }")

    # Generate sha1 hash for file
    h = hashlib.sha1()
    h.update(sub_file.read().encode())

    # Describe Submission metadata
    self.db.Table('submission').put_item(
      Item={
        'id': submission_id,
        'sub_no': 0,
        'status': "Pending",
        'runtime': 0,
        'date': int(time.time() * 1000),
        'language': language,
        'main_class': main_class,
        'filename': sub_file.filename,
        'filesize': os.path.getsize(path),
        'sha1sum': h.hexdigest(),
        'team_id': team.id,
        'team_name': team.name,
        'prob_id': problem.id,
        'prob_name': problem.name,
        'tests': problem.copy_tests()
      }
    )

    return submission_id
  
contest = ContestService()