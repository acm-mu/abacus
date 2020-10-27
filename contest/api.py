import json
from flask import Blueprint, request, Response
from boto3.dynamodb.conditions import Attr
from contest import contest

api = Blueprint('api_bp', __name__, url_prefix='/api',
                  template_folder='templates')

def dumps(data):
  return json.loads(json.dumps(data, sort_keys=True, cls=AbacusEncoder))

@api.route('/contest', methods=['GET', 'POST'])
def settings():
  if request.method == "POST":
    print(request.form, flush=True)
    contest.save_settings({
      'competition_name': request.form['competition-name'],
      'start_date': f"{ request.form['start-date'] } { request.form['start-time'] }",
      'end_date': f"{ request.form['end-date'] } { request.form['end-time'] }"
    })

  return dumps(contest.settings)

@api.route('/teams')
def teams():
  if request.method == 'POST':
    contest.db.Table('user').put_item(
      Item={
        'user_name': request.form['user_name'],
        'display_name': request.form['display_name'],
        'password': request.form['password']
      }
    )

  return dumps({K: V for K, V in contest.users.items() if V['type'] == "team"})

@api.route('/submissions', methods=['GET', 'POST'])
def submissions():
  if request.method == 'GET':
    return dumps(contest.submissions)

@api.route('/problems')
def problems():
  return dumps(contest.problems)

@api.route('/problems/<prob_id>')
def problem(prob_id):
  return dumps(contest.problems[prob_id])

import decimal
class AbacusEncoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, decimal.Decimal):
      return int(o)
    return super(AbacusEncoder, self).default(o)