from flask import Flask, render_template, session, request, redirect
from .contest import contest, api
import os
import binascii

def create_app(config_filename=None):
    app = Flask(__name__, instance_relative_config=True)
    if config_filename:
        app.config.from_pyfile(config_filename)

    api.register_api(app)
    register_blueprints(app)
    route_endpoints(app)

    app.jinja_env.globals.update(
        is_logged_in=contest.is_logged_in,
        is_judge=contest.is_judge,
        is_admin=contest.is_admin)

    app.secret_key = binascii.hexlify(os.urandom(24))

    return app

def register_blueprints(app):
    from .blueprints import admin, blue, gold

    app.register_blueprint(admin)
    app.register_blueprint(blue)
    app.register_blueprint(gold)

def route_endpoints(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            if contest.auth_login(request.form):
                return redirect(contest.home())

        return render_template('login.html')

    @app.route('/logout')
    def logout():
        del session['user_id']
        del session['user_name']
        del session['session_token']
        if 'admin' in session:
            del session['admin']
        return redirect('/')
