import json
import hashlib
import uuid
import decimal
from flask import request, redirect, session
from flask_restful import Resource, Api, reqparse
from contest import contest
from authlib import auth_required


def dumps(data):
    return json.loads(json.dumps(data, sort_keys=True, cls=AbacusEncoder))

def success(message):
    return { "status": 200, "message": message }
    
def not_found(message):
    return { "status": 404, "message": message }


class Contest(Resource):

    def get(self):
        data = contest.get_settings()
        if contest.is_logged_in():
            data['current_user'] = contest.getuserinfo('user_id')
        return dumps(data)

    def post(self):
        contest.save_settings(request.form)
        return dumps(contest.get_settings())


class Users(Resource):

    @auth_required
    def get(self):
        return dumps(contest.get_users())
        # return dumps({K: V for K, V in contest.get_users().items() if V['type'] == "team"})

    @auth_required
    def delete(self):
        # TODO: Delete all users submissions
        print("DELETE", flush=True)
        user_id = request.form['user-id']
        print(user_id, flush=True)
        if not(contest.get_users(user_id = user_id)):
            return not_found(f"Could not find user with id: {user_id}")

        contest.db.Table('user').delete_item(
            Key={'user_id': user_id})

        return success("User deleted successfully!")

    def post(self):
        if 'csv-file' in request.files:
            replace = request.form['replace']
            csv_file = request.files['csv-file']

            contest.import_users(csv_file, replace)
        else:
            m = hashlib.sha256()
            m.update(request.form['password'].encode())

            if request.method == "PUT":
                contest.db.Table('user').update_item(
                    Key={
                        'user_id': request.form['user-id']
                    },
                    UpdateExpression=f"SET role = :role, user_name = :user_name, division = :division, display_name = :display_name, password = :password",
                    ExpressionAttributeValues={
                        ':role': request.form['role'],
                        ':user_name': request.form['user-name'],
                        ':division': request.form['division'],
                        ':display_name': request.form['display-name'],
                        ':password': m.hexdigest()
                    })

            elif request.method == "POST":
                contest.db.Table('user').put_item(
                    Item={
                        'user_id': uuid.uuid4().hex,
                        'role': request.form['role'],
                        'user_name': request.form['user-name'],
                        'display_name': request.form['display-name'],
                        'division': request.form['division'],
                        'password': m.hexdigest()
                    }
                )


class Submissions(Resource):
    def get(self):
        submissions = contest.get_submissions()
        for submission in submissions:
            problem = contest.get_problems(
                problem_id=submission['problem_id'])[0]
            submission['problem_id'] = problem['id']
            submission['prob_name'] = problem['problem_name']

        return dumps(submissions)

    def delete(self):
        submission_id = request.form['submission_id']
        contest.db.Table('submission').delete_item(
            Key={
                'submission_id': submission_id
            }
        )
        contest.s3.Bucket('abacus-submissions').delete_objects(
            Delete={
                'Objects': [{
                    'Key': f"{submission_id}"
                }]
            })

    def post(self):
        return dumps(contest.submit(request))


class Submission(Resource):
    def get(self, sid):
        return dumps(contest.get_submissions(submission_id = sid))


class Problems(Resource):
    # @auth_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('division')
        args = parser.parse_args()
        if args['division']:
            return dumps(contest.get_problems(division=args['division']))

        return dumps(contest.get_problems())

    def post(self):
        tests = [{k: v for k, v in request.form.items(
        ) if '-in' in k or '-out' in k or '-include' in k}]
        # TODO: test this line
        tests = [{'in': tests[n][f"{n}-in"].replace('\r\n', '\n'), 'out': tests[n][f"{n}-out"].replace(
            '\r\n', '\n'), 'include': tests[n][f"{n}-include"]} for n in range(1, int(len(tests) / 2) + 1)]

        contest.db.Table('problem').put_item(
            Item={
                'problem_id': uuid.uuid4().hex,
                'id': request.form['id'],
                'problem_name': request.form['problem-name'],
                'memory_limit': request.form['memory-limit'],
                'cpu_time_limit': request.form['cpu-time-limit'],
                'description': request.form['description'],
                'tests': tests
            })


class Problem(Resource):
    def get(self, pid):
        problems = contest.get_problems(problem_id=pid)
        return dumps(problems)

    def delete(self, pid):
        contest.db.Table('problem').delete_item(
            Key={
                'problem_id': pid
            }
        )
        return redirect('/problems')

    def put(self, pid):
        tests = [{k: v for k, v in request.form.items()
                 if '-in' in k or '-out' in k}]
        # TODO: test this line
        tests = [{'in': tests[n][f"{n}-in"].replace('\r\n', '\n'), 'out': tests[n][f"{n}-out"].replace(
            '\r\n', '\n')} for n in range(1, int(len(tests) / 2) + 1)]

        contest.db.Table('problem').update_item(
            Key={
                'problem_id': request.form['problem-id']
            },
            UpdateExpression=f"SET id = :id, problem_name = :name, memory_limit = :mlim, cpu_time_limit = :cpu, description = :desc, tests = :tests",
            ExpressionAttributeValues={
                ':id': request.form['id'],
                ':name': request.form['problem-name'],
                ':mlim': request.form['memory-limit'],
                ':cpu': request.form['cpu-time-limit'],
                ':desc': request.form['description'],
                ':tests': tests
            })

class Standings(Resource):
    def get(self):
        return dumps(contest.get_standings('blue'))


def register_api(app):
    api = Api(app)

    api.add_resource(Contest, '/api/contest')
    api.add_resource(Users, '/api/users')
    api.add_resource(Submissions, '/api/submissions')
    api.add_resource(Submission, '/api/submissions/<sid>')
    api.add_resource(Problems, '/api/problems')
    api.add_resource(Problem, '/api/problems/<pid>')
    api.add_resource(Standings, '/api/standings')


class AbacusEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return int(o)
        return super(AbacusEncoder, self).default(o)
