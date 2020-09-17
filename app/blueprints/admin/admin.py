from flask import Blueprint, render_template
from contest import contest

admin = Blueprint('admin_bp', __name__, url_prefix='/admin', template_folder='templates')

@admin.route('/')
def index():
  return render_template('admin/index.html')