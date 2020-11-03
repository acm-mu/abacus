import json, hashlib, uuid, decimal
from flask import Blueprint, request, session, redirect
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
      'end_date': f"{ request.form['end-date'] } { request.form['end-time'] }",
      'points_per_yes': request.form['points-per-yes'],
      'points_per_no': request.form['points-per-no'],
      'points_per_compilation_error': request.form['points-per-compilation-error'],
      'points_per_minute': request.form['points-per-minute']
    })
  data = contest.settings()  
  if 'user_id' in session:
    data['current_user'] = session['user_id']
  
  return dumps(data)

@api.route('/users', methods=['GET', 'PUT', 'POST', 'DELETE'])
def users():
  if request.method == "DELETE":
    contest.db.Table('user').delete_item(
      Key={
        'user_id': request.form['user-id']
      }
    )
  if request.method in ["POST", "PUT"]:
    if 'sub-file' in request.files:
      ## TODO: import users from csv
      return 

    m = hashlib.sha256()
    m.update(request.form['password'].encode())

    if request.method == "PUT":
      contest.db.Table('user').update_item(
        Key={
            'user_id': request.form['user-id']
        },
        UpdateExpression=f"SET #ty = :type, user_name = :user_name, division = :division, display_name = :display_name, password = :password",
        ExpressionAttributeValues={
            ':type': request.form['type'],
            ':user_name': request.form['user-name'],
            ':division': request.form['division'],
            ':display_name': request.form['display-name'],
            ':password': m.hexdigest()
        },
        ExpressionAttributeNames={
          "#ty": "type"
        })

    elif request.method == "POST":
      contest.db.Table('user').put_item(
        Item={
          'user_id': uuid.uuid4().hex,
          'type': request.form['type'],
          'user_name': request.form['user-name'],
          'display_name': request.form['display-name'],
          'division': request.form['division'],
          'password': m.hexdigest()
        }
      )

  return dumps({K: V for K, V in contest.users().items() if V['type'] == "team"})

@api.route('/submissions', methods=['GET', 'POST', 'DELETE'])
def submissions():
  if request.method == "DELETE":
    submission_id = request.form['submission_id']
    contest.db.Table('submission').delete_item(
      Key={
        'submission_id': submission_id
      }
    )
    contest.s3.Bucket('abacus-submissions').delete_objects(
      Delete={
        'Objects': [{
          'Key': f"{submission_id}"
        }]
      })

  if request.method == "POST":
    return dumps(contest.submit(request))

  return dumps(contest.submissions())

@api.route('/submissions/<sub_id>')
def submission(sub_id):
  submissions = contest.submissions()
  if sub_id not in submissions:
    return "Not Found"
  return dumps(submissions[sub_id])

@api.route('/problems', methods=['GET', 'POST'])
def problems():
  if request.method == "POST":
    tests = {k:v for k,v in request.form.items() if '-in' in k or '-out' in k}
    tests = [{'in': tests[f"{n}-in"].replace('\r\n', '\n'), 'out': tests[f"{n}-out"].replace('\r\n', '\n')} for n in range(1, int(len(tests) / 2) + 1)]

    contest.db.Table('problem').put_item(
        Item={
          'problem_id': uuid.uuid4().hex,
          'id': request.form['id'],
          'problem_name': request.form['problem-name'],
          'memory_limit': request.form['memory-limit'],
          'cpu_time_limit': request.form['cpu-time-limit'],
          'description': request.form['description'],
          'tests': tests
        }
      )
  return dumps(contest.problems())

@api.route('/problems/<prob_id>', methods=['GET', 'PUT', 'DELETE'])
def problem(prob_id):
  if request.method == "DELETE":
    contest.db.Table('problem').delete_item(
      Key={
        'problem_id': request.form['problem-id']
      }
    )
    return redirect('/problems')
    
  if request.method == "PUT":
    tests = {k:v for k,v in request.form.items() if '-in' in k or '-out' in k}
    tests = [{'in': tests[f"{n}-in"].replace('\r\n', '\n'), 'out': tests[f"{n}-out"].replace('\r\n', '\n')} for n in range(1, int(len(tests) / 2) + 1)]

    contest.db.Table('problem').update_item(
      Key={
          'problem_id': request.form['problem-id']
      },
      UpdateExpression=f"SET id = :id, problem_name = :name, memory_limit = :mlim, cpu_time_limit = :cpu, description = :desc, tests = :tests",
      ExpressionAttributeValues={
          ':id': request.form['id'],
          ':name': request.form['problem-name'],
          ':mlim': request.form['memory-limit'],
          ':cpu': request.form['cpu-time-limit'],
          ':desc': request.form['description'],
          ':tests': tests
      })
  
  return dumps(contest.problems()[prob_id])

class AbacusEncoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, decimal.Decimal):
      return int(o)
    return super(AbacusEncoder, self).default(o)