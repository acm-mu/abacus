from flask import Blueprint, render_template, request
from contest import contest
from authlib import login_required

gold = Blueprint('gold_bp', __name__, url_prefix='/gold',
                 template_folder='templates')


@gold.route('/')
def index():
    return render_template('gold/index.html')


@gold.route('/connect', methods=['POST'])
@login_required
def connect():
    if request.method == "POST":
        contest.db.Table('user').update_item(
                    Key={
                        'user_id': contest.getuserinfo('user_id')
                    },
                    UpdateExpression=f"SET scratch_username = :scratch_username",
                    ExpressionAttributeValues={
                        ':scratch_username': request.form['scratch_username']
                    })
        return render_template("gold/connected.html")


@gold.route('/submit')
def submit():
    return render_template('gold/submit.html', project_id=request.args.get('project_id', default = ''), problems=contest.get_problems(division='gold'))


@gold.route('/problems')
def problems():
    return render_template('gold/problems.html', problems=contest.get_problems(division="gold"))


@gold.route('/problems/<pid>')
def problem(pid):
    return render_template('gold/problem.html', problem=contest.get_problems(division="gold", id=pid)[0], submissions = None)


@gold.route('/problems/<pid>/submit')
def submit_problem(pid):
    return render_template('gold/submit_problem.html', problem_id=pid)


@gold.route('/submissions')
@login_required
def submissions():
    submissions = []
    if contest.getuserinfo('role') == "team":
        submissions = contest.get_submissions(team_id=contest.getuserinfo('user_id'))
        for submission in submissions:
            problem = contest.get_problems(
                problem_id=submission['problem_id'])[0]
            submission['problem_id'] = problem['id']
            submission['prob_name'] = problem['problem_name']
    else:
        submissions = contest.get_submissions()

    submissions = sorted(
        submissions, key=lambda obj: obj['date'], reverse=True)
    return render_template('gold/submissions.html', submissions=submissions)


@gold.route('/submissions/<sid>')
@login_required
def submission(sid):
    submissions = contest.get_submissions(submission_id=sid)
    if not submissions:
        return render_template('404.html')
    submission = submissions[0]
    if contest.getuserinfo('role') == "team" and submission['team_id'] != contest.getuserinfo('user_id'):
        return render_template('401.html')

    problem = contest.get_problems(problem_id = submission['problem_id'])[0]
    submission['prob_id'] = problem['id']
    submission['prob_name'] = problem['problem_name']

    return render_template('gold/submission.html', submission=submission)