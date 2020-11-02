from flask import Blueprint, render_template, session
from contest import contest

blue = Blueprint('blue_bp', __name__, url_prefix='/blue', template_folder='templates')

@blue.route('/')
def index():
  return render_template('blue/index.html')

@blue.route('/standings')
def standings():
  return render_template('blue/standings.html')

@blue.route('/submissions')
def submissions():
  if 'user_id' not in session:
    return render_template('401.html')
  submissions = list(contest.submissions().values())
  submissions = sorted(submissions, key= lambda obj:obj['date'], reverse=True)
  if session['user_type'] == "team":
    submissions = [sub for sub in submissions if sub['team_id'] == session['user_id']]
  return render_template('blue/submissions.html', submissions=submissions)

@blue.route('/submissions/<sid>')
def submission(sid):
  submissions = contest.submissions()
  if 'user_id' not in session:
    return render_template('401.html')
  if sid not in submissions:
    return render_template('404.html')
  submission = submissions[sid]
  if session['user_type'] == "team" and submission['team_id'] != session['user_id']:
    return render_template('401.html')
  contents = contest.s3.Bucket('abacus-submissions').Object(f"{ submission['submission_id'] }/{ submission['filename'] }").get()['Body'].read().decode()
  filename = submission['filename']
  return render_template('blue/submission.html', submission=submission, filename=filename, contents=contents)

@blue.route('/problems')
def problems():
  problems = contest.problems().values()
  return render_template('blue/problems.html', problems=problems)

@blue.route('/problems/<pid>')
def problem(pid):
  problems = contest.problems()
  if pid not in problems:
    return render_template("404.html")
  return render_template(f'blue/problem.html', problem=problems[pid])

@blue.route('/problems/<pid>/submit')
def submit(pid):
  if pid not in contest.problems():
    return render_template("404.html")
  if 'user_id' not in session or session['user_type'] != "team":
    return render_template("401.html")
  return render_template(f'blue/submit.html', pid=pid)