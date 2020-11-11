from flask import Flask, render_template, session, request, redirect
from contest import contest, api
from blueprints import *
import os, binascii

app = Flask(__name__)

app.register_blueprint(api)
app.register_blueprint(admin)
app.register_blueprint(blue)
app.register_blueprint(gold)

@app.route('/')
def index():
  return render_template('index.html')

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
  if 'admin' in session:
    del session['admin']
  return redirect('/')

if __name__ == "__main__":
  app.jinja_env.globals.update(
    is_logged_in=contest.is_logged_in,
    is_judge=contest.is_judge,
    is_admin=contest.is_admin
  )
  app.secret_key = binascii.hexlify(os.urandom(24))
  app.run(debug=True, host='0.0.0.0', port=80)