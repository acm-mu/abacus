from flask import Blueprint, render_template
from contest import contest

blue = Blueprint('blue_bp', __name__, url_prefix='/', template_folder='templates')

@blue.route('/standings')
def standings():
  return render_template('blue/standings.html')

@blue.route('/submissions')
def submissions(): 
  return render_template('blue/submissions.html')

@blue.route('/submissions/<sid>')
def submission(sid):
  submission = contest.get_submission(sid)
  if submission:
    filename = submission.filename
    contents = None
    if contest.s3:
      contents = contest.s3.Object(f"{ submission.id }/{ submission.filename }").get()['Body'].read().decode()
    else:
      contents = open(f"/tmp/submissions/{ submission.id }/{ submission.filename }").read()
    return render_template('blue/submission.html', submission=submission, filename=filename, contents=contents)
  return render_template("404.html")


@blue.route('/problems')
def problems():
  return render_template('blue/problems.html')

@blue.route('/problems/<pid>')
def problem(pid):
  desc = open(f"problems/{ pid }.md").read()
  return render_template('blue/problem.html', problem=contest.get_problem(pid), desc=desc)