from abacus.contest import contest
from moto.dynamodb2 import mock_dynamodb2

import boto3
import uuid
import hashlib

def test_trivial(test_client):
    response = test_client.get('/', follow_redirects=True)
    assert response.status_code == 200


# @pytest.fixture
def create_table():
    contest.db = boto3.resource('dynamodb', region_name='us-east-2')

    contest.db.create_table(
        AttributeDefinitions=[{
            'AttributeName': 'user_id',
            'AttributeType': 'S'
        }],
        KeySchema=[{
            'AttributeName': 'user_id',
            'KeyType': 'HASH'
        }],
        TableName='user',
    )

    assert contest.get_users() == []


@mock_dynamodb2
def test_empty_user_table():
    create_table()

    assert contest.get_users() == []

@mock_dynamodb2
def test_nonempty_user_table():
    create_table()

    m = hashlib.sha256()
    m.update("Password".encode())

    contest.db.Table('user').put_item(Item={
        'user_name': 'test-user',
        'password': m.hexdigest(),
        'display_name': 'Test User',
        'division': 'blue',
        'role': 'team',
        'session_token': None,
        'user_id': uuid.uuid4().hex
    })

    assert contest.get_users()[0]['user_name'] == 'test-user'