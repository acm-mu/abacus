from flask import Blueprint, render_template, request
from contest import contest
from datetime import datetime

admin = Blueprint('admin_bp', __name__, url_prefix='/admin',
                  template_folder='templates')

@admin.route('/')
def index():
    return render_template('admin/index.html', settings=contest.get_settings())

@admin.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':

        contest.settings['competition_name'] = request.form['competition-name']

        date_format = "%Y-%m-%d %H:%M"
        start_date_str = f"{request.form['start-date']} {request.form['start-time']}"
        start_date = datetime.strptime(start_date_str, date_format)

        end_date_str = f"{request.form['end-date']} {request.form['end-time']}"
        end_date = datetime.strptime(end_date_str, date_format)
        
        contest.settings['start_date'] = start_date
        contest.settings['end_date'] = end_date

        contest.save_settings()
        return render_template('admin/settings.html', settings=contest.get_settings(), status="success")

    return render_template('admin/settings.html', settings=contest.get_settings())
