from flask import Blueprint, render_template, request
from contest import contest

gold = Blueprint('gold_bp', __name__, url_prefix='/gold',
                  template_folder='templates')

@gold.route('/')
def index():
    return render_template('gold/index.html')