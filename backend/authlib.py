from contest import contest
from functools import wraps
from flask import request, session, render_template
from typing import Any, Callable

def auth_required(fn: Any):
    if callable(fn):
        return decorate_auth(fn)
    role = fn

    def func(fn: Callable):
        return decorate_auth(fn, role)
    return func


def login_required(fn: Any):
    if callable(fn):
        return decorate_login(fn)
    role = fn

    def func(fn: Callable):
        return decorate_login(fn, role)
    return func


def decorate_auth(fn: Callable, role: str = None) -> Callable:
    def auth(*args, **kwargs):
        auth_token = request.headers.get('X-PA-AUTH-TOKEN', None)

        if not auth_token and 'session_token' in session:
            auth_token = session['session_token']

        if not auth_token:
            return f"Missing Headers (X-PA-AUTH-TOKEN)", 400  # BAD REQUEST
        elif not authorize(auth_token, role):
            return "Not Authorized", 401  # UNAUTHORIZED

        return fn(*args, **kwargs)
    return auth


def decorate_login(fn: Callable, role: str = None) -> Callable:
    @wraps(fn)
    def is_loggedin(*args, **kwargs):
        auth_token = session['session_token'] if 'session_token' in session else None

        if not auth_token or not authorize(auth_token, role):
            return render_template("401.html")

        return fn(*args, **kwargs)
    return is_loggedin


def authorize(auth_token: str, role: str = None) -> bool:
    users = contest.get_users(session_token=auth_token)
    if len(users) == 0:
        return False
    if role:
        return users[0]['role'] == role

    return True
