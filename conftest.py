import pytest
from abacus import create_app

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app('flask_test.cfg')
    testing_client = flask_app.test_client()

    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client

    ctx.pop()
