from flask import Blueprint, render_template, request, session
from abacus.contest import contest, login_required

gold = Blueprint('gold_bp', __name__, url_prefix='/gold',
                 template_folder='templates')


@gold.route('/')
def index():
    return render_template('gold/index.html')


@gold.route('/connect', methods=['GET', 'POST'])
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
                    
    return render_template('gold/connect_scratch.html')


@gold.route('/submit')
def submit():
    return render_template('gold/submit.html', scratch_url=request.args.get('scratch_url', default = ''))


@gold.route('/problems')
def problems():
    return render_template('gold/problems.html', problems=contest.get_problems(division="gold"))


@gold.route('/problems/<pid>')
def problem(pid):
    return render_template('gold/problem.html', problem=contest.get_problems(division="gold", id=pid)[0], submissions = None)


@gold.route('/problems/<pid>/submit')
def submit_problem(pid):
    return render_template('gold/submit_problem.html', problem_id=pid)
