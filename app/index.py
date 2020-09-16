from flask import Flask, render_template, request, url_for, redirect, session
from contest import ContestService
import os, binascii

app = Flask(__name__)

contest = ContestService()

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/standings')
def standings():
  return render_template('standings.html', problems=contest.get_problems(), teams=contest.get_teams())

@app.route('/submissions')
def submissions(): 
  return render_template('submissions.html', submissions=contest.get_submissions())

@app.route('/submissions/<sid>')
def submission(sid):
  submission = contest.get_submission(sid)
  if submission:
    filename = submission.filename
    contents = None
    if contest.s3:
      contents = contest.s3.Object(f"{submission.id}/{submission.filename}").get()['Body'].read().decode()
    else:
      contents = open(f"/tmp/submissions/{submission.id}/{submission.filename}").read()
    return render_template('submission.html', submission=submission, filename=filename, contents=contents)
  return render_template("404.html")

@app.route('/submissions/<sid>/run')
def run_submission(sid):
  submission = contest.get_submission(sid)
  if submission:
    contest.test_submission(sid)
    return redirect(f'/submissions/{sid}')
  return render_template('404.html')

@app.route('/submissions/<sid>/delete')
def del_submission(sid):
  submission = contest.get_submission(sid)
  if submission:
    contest.del_submission(sid)
    return redirect(request.referrer)
  return render_template('404.html')

@app.route('/problems')
def problems():
  return render_template('problems.html', problems=contest.get_problems())

@app.route('/problems/<pid>')
def problem(pid):
  desc = open(f"problems/{pid}.md").read()
  return render_template('problem.html', problem=contest.get_problem(pid), desc=desc)
  
@app.route('/problems/<pid>/submit', methods=['GET', 'POST'])
def submit(pid):
  problem = contest.get_problem(pid)
  if request.method == "POST":
    if 'user_id' not in session:
      return render_template('401.html')
    team = contest.get_team(session['user_id'])
    submission = contest.submit(problem, request, team)
    return redirect(f'/submissions/{submission.id}')

  return render_template('submit.html', problem=problem)

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    if contest.auth_login(request.form, session):
      return redirect('/')

  return render_template('login.html', session=session)
 
@app.route('/logout')
def logout():
  del session['user_id']
  del session['user_name']
  if 'admin' in session:
    del session['admin']
  return redirect(request.referrer)

if __name__ == "__main__":
  app.secret_key = binascii.hexlify(os.urandom(24))
  port = int(os.environ.get("PORT", 80))
  app.run(debug=True, host='0.0.0.0',port=port)