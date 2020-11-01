from flask import Blueprint, render_template, request
from contest import contest

admin = Blueprint('admin_bp', __name__, url_prefix='/admin',
                  template_folder='templates')

@admin.route('/')
def index():
    return render_template('admin/index.html')

@admin.route('/teams')
def teams():
    return render_template('admin/teams.html')

@admin.route('/settings')
def settings():
    return render_template('admin/settings.html')

@admin.route('/problems')
def problems():
    return render_template('admin/problems.html', problems=contest.problems().values())

@admin.route('/problems/<pid>/edit')
def edit_problem(pid):
    if pid not in contest.problems():
        return render_template('404.html')
    return render_template('admin/edit_problem.html', problem=contest.problems()[pid])