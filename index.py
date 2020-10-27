from flask import Flask, render_template, session, request, redirect
from contest import contest
from blueprints import *
import os, binascii

app = Flask(__name__)

app.register_blueprint(admin)
app.register_blueprint(blue)

@app.route('/')
def index():
  return render_template('index.html', settings=contest.get_settings())

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    if contest.auth_login(request.form, session):
      return redirect('/')

  return render_template('login.html', session=session, settings=contest.get_settings())
 
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