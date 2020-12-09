import os
import unittest
from index import app

class BasicTests(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        # app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
            # os.path.join(app.config['BASEDIR'], TEST_DB)
        self.app = app.test_client()

        self.assertEqual(app.debug, False)

    def tearDown(self):
        pass

    def test_main_page(self):
        "Ping the flask homepage to test connection"

        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    # def test_login(self):
    #     response = self.login("admin", "goldeneagles")
    #     self.assertEqual(response.status_code, 200)

    #Helper
    def login(self, username, password):
        return self.app.post(
            '/login',
            data=dict(username=username, password=password),
            follow_redirects=True
        )

    def logout(self):
        return self.app.get(
            '/logout',
            follow_redirects=True
        )

if __name__ == "__main__":
    unittest.main()