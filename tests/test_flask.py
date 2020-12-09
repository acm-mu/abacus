def test_trivial(test_client):
    response = test_client.get('/', follow_redirects=True)
    assert response.status_code == 200


def login(test_client, username, password):
    return test_client.post(
        '/login',
        data=dict(username=username, password=password),
        follow_redirects=True)


def logout(test_client):
    return test_client.get('/logout', follow_redirects=True)
