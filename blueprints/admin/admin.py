from flask import Blueprint, render_template, request
from contest import contest

admin = Blueprint('admin_bp', __name__, url_prefix='/admin',
                  template_folder='templates')

@admin.route('/')
def index():
    return render_template('admin/index.html')

@admin.route('/schools')
def schools():
    return render_template('admin/schools.html')

@admin.route('/teams')
def teams():
    return render_template('admin/teams.html')

@admin.route('/settings')
def settings():
    return render_template('admin/settings.html')
