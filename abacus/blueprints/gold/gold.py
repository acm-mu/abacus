from flask import Blueprint, render_template, request
from abacus.contest import contest

gold = Blueprint('gold_bp', __name__, url_prefix='/gold',
                 template_folder='templates')


@gold.route('/')
def index():
    return render_template('gold/index.html')

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
