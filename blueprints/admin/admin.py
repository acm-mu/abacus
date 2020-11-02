from flask import Blueprint, render_template, session
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
  return render_template('admin/submission.html', submission=submission, filename=filename, contents=contents)

@admin.route('/clarifications')
def clarifications():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/clarifications.html')

@admin.route('/problems')
def problems():
  if 'user_id' not in session:
    return render_template('401.html')
  return render_template('admin/problems.html', problems=contest.problems().values())

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