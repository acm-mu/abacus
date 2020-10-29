import json, hashlib, uuid, decimal
from flask import Blueprint, request, session
from contest import contest

api = Blueprint('api_bp', __name__, url_prefix='/api',
                  template_folder='templates')

def dumps(data):
  return json.loads(json.dumps(data, sort_keys=True, cls=AbacusEncoder))

@api.route('/contest', methods=['GET', 'POST'])
def settings():
  if request.method == "POST":
    contest.save_settings({
      'competition_name': request.form['competition-name'],
      'start_date': f"{ request.form['start-date'] } { request.form['start-time'] }",
      'end_date': f"{ request.form['end-date'] } { request.form['end-time'] }"
    })
  data = contest.settings()  
  if 'user_id' in session:
    data['current_user'] = session['user_id']
  
  return dumps(data)

@api.route('/teams', methods=['GET', 'POST'])
def teams():
  contest.load_users()
  if request.method == "POST":
    m = hashlib.sha256()
    m.update(request.form['password'].encode())

    contest.db.Table('user').put_item(
      Item={
        'user_id': uuid.uuid4().hex,
        'type': "team",
        'user_name': request.form['user-name'],
        'display_name': request.form['display-name'],
        'password': m.hexdigest()
      }
    )

  return dumps({K: V for K, V in contest.users().items() if V['type'] == "team"})

@api.route('/submissions', methods=['GET', 'POST'])
def submissions():
  if request.method == "POST":
    return dumps(contest.submit(request))

  return dumps(contest.submissions())

@api.route('/submissions/<sub_id>')
def submission(sub_id):
  submissions = contest.submissions()
  if sub_id not in submissions:
    return "Not Found"
  return dumps(submissions[sub_id])

@api.route('/problems')
def problems():
  contest.load_problems()
  return dumps(contest.problems())

@api.route('/problems/<prob_id>')
def problem(prob_id):
  return dumps(contest.problems()[prob_id])

class AbacusEncoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, decimal.Decimal):
      return int(o)
    return super(AbacusEncoder, self).default(o)