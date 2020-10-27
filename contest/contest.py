from contest.models import *
from pymongo import MongoClient
import shutil, os, hashlib, boto3, time

class ContestService:
  def __init__(self):
    self.init_mongo()
    self.init_s3()

    self.load_settings()

    self.load_problems()
    self.load_teams()
    self.load_submissions()

  def init_mongo(self):
    username = os.environ.get('MONGODB_USERNAME', None)
    password = os.environ.get('MONGODB_PASSWORD', None)
    hostname = os.environ.get('MONGODB_HOSTNAME', None)

    if username and password and hostname:
      if "." in hostname:
        self.mongo_client = MongoClient(f'mongodb+srv://{ username }:{ password }@{ hostname }')
      else:
        self.mongo_client = MongoClient(f'mongodb://{ username }:{ password }@{ hostname }:27017')

      self.db = self.mongo_client.competition

  def init_s3(self):
    aws_access_key = os.environ.get('AWS_ACCESS_KEY', None)
    aws_secret_key = os.environ.get('AWS_SECRET_KEY', None)

    self.s3 = None
    if aws_access_key and aws_secret_key:
      self.s3_client = boto3.Session(aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key)
      self.s3 = self.s3_client.resource('s3').Bucket("abacus-submissions")

  def load_settings(self):
    if not(self.db):
      return False
    
    self.settings = self.db.settings.find_one({})

  def save_settings(self):
    self.db.settings.update_one({ '_id': self.settings['_id'] }, { '$set': self.settings })

  def get_settings(self):
    return self.settings

  def auth_login(self, formdata, session):
    m = hashlib.sha256()
    m.update(formdata['password'].encode())
    password = m.hexdigest()

    if formdata['username'] == 'admin' and password == os.environ.get('ADMIN_PASS', "").lower():
      session['user_id'] = 'admin'
      session['user_name'] = 'admin'
      session['admin'] = True
      return True

    team = self.db.teams.find_one({ "username": formdata['username'] })
    if team and team['password'].lower() == password:
      session['user_id'] = str(team['_id'])
      session['user_name'] = team['username']
      return True
      
    return False

  def load_problems(self):
    self.problems = {}
    for obj in self.db.problems.find():
      self.problems[obj['id']] = Problem(obj)
    print(f"Loaded { len(self.problems) } problem(s).")

  def get_problems(self):
    return self.problems.values()

  def get_problem(self, problem_id):
    return self.problems[problem_id]

  def load_teams(self):
    self.teams = {}
    for obj in self.db.teams.find():
      self.teams[str(obj['_id'])] = Team.fromObj(obj)

    print(f"Loaded { len(self.teams) } team(s).")

  def save_teams(self):
    for team in self.teams:
      self.db.teams.update_one({ 'id': team.id }, { '$set': team.__dict__ })
  
  def get_teams(self):
    return self.teams.values()

  def get_team(self, tid):
    if tid in self.teams:
      return self.teams[tid]
    return None

  def load_submissions(self):
    self.submissions = {}
    for obj in self.db.submissions.find():
      self.submissions[str(obj['_id'])] = Submission(obj)
    print(f"Loaded { len(self.submissions) } submission(s).")

  def save_submission(self, sid):
    sub = self.get_submission(sid)
    self.db.submissions.update_one({ 'id': sub.id }, { '$set': sub.__dict__ })

  def save_submissions(self):
    for sub in self.submissions.values():
      self.db.submissions.update_one({ 'id': sub.id }, { '$set': sub.__dict__ })

  def get_submissions(self):
    return sorted(self.submissions.values(), key=lambda s: int(s.date))

  def get_submission(self, sid):
    if sid in self.submissions:
      return self.submissions[sid]
    return None

  def del_submission(self, sid):
    submission = self.get_submission(sid)
    team = self.get_team(submission.team_id)
    team.submissions.remove(sid)

    # Delete from mongo 'teams'
    self.db.teams.update_one({ 'id': team.id }, { '$set': team.__dict__ })
    
    # Delete from mongo 'submissions'
    self.db.submissions.delete_one({ 'id': sid })
    if self.s3:
      self.s3.Object(f"{ submission.id }/{ submission.filename }").delete()

    # Remove from submissions list
    if sid in self.submissions:
      del self.submissions[sid]

  def submit(self, problem, request, team):
    language = request.form['language']
    main_class = request.form['main_class']
    sub_file = request.files['sub_file']

    # Generate mongodb _id for submission
    _id = self.db.submissions.insert_one({}).inserted_id

    # Save file to `tmp` directory
    path = f"/tmp/submissions/{ str(_id) }/{ sub_file.filename }"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sub_file.save(path)

    # Upload file to AWS S3 Bucket
    if self.s3:
      with open(path, "rb") as file_obj:
        self.s3.upload_fileobj(file_obj, f"{ str(_id) }/{ sub_file.filename }")

    # Generate sha1 hash for file
    h = hashlib.sha1()
    with open(path) as file_obj:
      h.update(file_obj.read().encode())

    # Count submission number for team
    sub_no = 1
    for sub in [self.get_submission(sid) for sid in team.submissions]:
      if sub.prob_id == problem.id:
        sub_no += 1

    # Describe Submission metadata
    submission = Submission({
      'id': str(_id),
      'sub_no': sub_no,
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
    })

    # Save Submission
    self.submissions[submission.id] = submission

    # Update metadata in mongodb
    self.db.submissions.update_one({ '_id': _id }, { '$set': submission.__dict__ })

    # Add sdubmission to team's submissions
    team.submissions.append(submission.id)

    # Save to mongodb
    self.db.teams.update_one({ 'username': team.username }, { '$set': team.__dict__ })

    return submission

  def get_users(self):
    return []
  
  def get_user(self, uid):
    return {}
  
contest = ContestService()