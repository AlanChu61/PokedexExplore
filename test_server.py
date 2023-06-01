import unittest
import json
import random
import crud
import server


class MyAppIntegrationTestCase(unittest.TestCase):
    # test non-login user's access to pages
    def test_index(self):
        client = server.app.test_client()
        result = client.get('/')
        self.assertIn('HomePage', result.data.decode())

    def test_battle(self):
        client = server.app.test_client()
        result = client.get('/battle_players')
        self.assertIn('Battle', result.data.decode())

    def test_map(self):
        client = server.app.test_client()
        result = client.get('/map_pokemons')
        self.assertIn('Map', result.data.decode())

    def test_detail(self):
        client = server.app.test_client()
        result = client.get('/detail_pokemons')
        self.assertNotIn('Info', result.data.decode())

    def test_login(self):
        client = server.app.test_client()
        result = client.get('/login')
        self.assertIn('Login', result.data.decode())

    def test_signup(self):
        client = server.app.test_client()
        result = client.get('/signup')
        self.assertIn('Sign Up', result.data.decode())


class MyAppUnitTestCase2(unittest.TestCase):
    # test login user's access to pages

    def setUp(self):
        client = server.app.test_client()
        result = client.post('/login', data={
            "email": "test1@email.com",
            "password": "test1",
        }, follow_redirects=True)
        self.assertEqual(result.status_code, 200)

    def test_detail(self):
        client = server.app.test_client()
        result = client.get('/detail_pokemons')
        self.assertIn('Info', result.data.decode())


if __name__ == '__main__':
    unittest.main()
