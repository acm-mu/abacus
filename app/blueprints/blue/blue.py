from flask import Blueprint, render_template, redirect, request, session
from contest import contest

blue = Blueprint('blue_bp', __name__, url_prefix='/', template_folder='templates')

@blue.route('/standings')
def standings():
  return render_template('blue/standings.html', problems=contest.get_problems(), teams=contest.get_teams(), settings=contest.get_settings())

@blue.route('/submissions')
def submissions(): 
  return render_template('blue/submissions.html', submissions=contest.get_submissions(), settings=contest.get_settings())

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
    return render_template('blue/submission.html', submission=submission, filename=filename, contents=contents, settings=contest.get_settings())
  return render_template("404.html")

@blue.route('/submissions/<sid>/run')
def run_submission(sid):
  submission = contest.get_submission(sid)
  if submission:
    contest.test_submission(sid)
    return redirect(f'/submissions/{ sid }')
  return render_template('404.html')

@blue.route('/submissions/<sid>/delete')
def del_submission(sid):
  submission = contest.get_submission(sid)
  if submission:
    contest.del_submission(sid)
    return redirect(request.referrer)
  return render_template('404.html')

@blue.route('/problems')
def problems():
  return render_template('blue/problems.html', problems=contest.get_problems(), settings=contest.get_settings())

@blue.route('/problems/<pid>')
def problem(pid):
  desc = open(f"problems/{ pid }.md").read()
  return render_template('blue/problem.html', problem=contest.get_problem(pid), desc=desc, settings=contest.get_settings())
  
@blue.route('/problems/<pid>/submit', methods=['GET', 'POST'])
def submit(pid):
  problem = contest.get_problem(pid)
  if request.method == "POST":
    if 'user_id' not in session:
      return render_template('401.html')
    team = contest.get_team(session['user_id'])
    submission = contest.submit(problem, request, team)
    return redirect(f'/submissions/{ submission.id }')

  return render_template('blue/submit.html', problem=problem, settings=contest.get_settings())
