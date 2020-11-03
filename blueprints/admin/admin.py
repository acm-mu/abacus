from flask import Blueprint, render_template, session, redirect
import json
from contest import contest

admin = Blueprint('admin_bp', __name__, url_prefix='/admin',
                  template_folder='templates')

@admin.route('/')
def index():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/index.html')

@admin.route('/users')
def teams():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/users.html', users=contest.users().values())

@admin.route('/settings')
def settings():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/settings.html')

@admin.route('/submissions')
def submissions():
  if 'user_id' not in session:
    return render_template('401.html')
  submissions = list(contest.submissions().values())
  for submission in submissions:
    submission['team_name'] = contest.users()[submission['team_id']]['user_name']
    prob_id = [prob for prob in contest.problems().values() if prob['problem_id'] == submission['prob_id']][0]['id']
    submission['problem_id'] = prob_id
    submission['prob_name'] = contest.problems()[prob_id]['problem_name']
  submissions = sorted(submissions, key= lambda obj:obj['date'], reverse=True)
  return render_template('admin/submissions.html', submissions=submissions)

@admin.route('/submissions/<sid>')
def submission(sid):
  submissions = contest.submissions()
  if 'user_id' not in session:
    return render_template('401.html')
  if sid not in submissions:
    return render_template('404.html')
  submission = submissions[sid]
  contents = contest.s3.Bucket('abacus-submissions').Object(f"{ submission['submission_id'] }/{ submission['filename'] }").get()['Body'].read().decode()
  filename = submission['filename']
  problem = [prob for prob in contest.problems().values() if prob['problem_id'] == submission['prob_id']][0]
  submission['prob_id'] = problem['id']
  submission['problem_id'] = problem['problem_id']
  submission['prob_name'] = problem['problem_name']
  return render_template('admin/submission.html', submission=submission, filename=filename, contents=contents)

@admin.route('/submissions/<sid>/invoke')
def invoke_submission(sid):
  submission = contest.submissions()[sid]
  filename = submission['filename'] if submission['language'] == "Python 3" else f"{submission['filename'][:-5]}.class"
  payload = {
    'Records': [
      {
        's3': {
          'bucket': {
            "name": "abacus-submissions"
          },
          "object": {
            "key": f"{sid}/{filename}"
          }
        }
      }
    ]
  }

  contest.lmbda.invoke(
    FunctionName='PythonRunner' if submission['language'] == "Python 3" else 'JavaRunner',
    InvocationType='Event',
    Payload=json.dumps(payload)
  )
  return redirect(f"/admin/submissions/{sid}")

@admin.route('/clarifications')
def clarifications():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/clarifications.html')

@admin.route('/problems')
def problems():
  if 'user_id' not in session:
    return render_template('401.html')
  problems = contest.problems().values()
  problems = sorted(problems, key=lambda prob: prob['id'])
  return render_template('admin/problems.html', problems=problems)

@admin.route('/problems/<pid>/edit')
def edit_problem(pid):
  if 'user_id' not in session:
    return render_template('401.html')
  if pid not in contest.problems():
      return render_template('404.html')
  return render_template('admin/edit_problem.html', problem=contest.problems()[pid])

@admin.route('/problems/new')
def new_problem():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/new_problem.html')