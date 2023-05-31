import unittest
import json
import random
import crud
import server


class MyAppIntegrationTestCase(unittest.TestCase):
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

    def test_login(self):
        client = server.app.test_client()
        result = client.get('/login')
        self.assertIn('Login', result.data.decode())

    def test_signup(self):
        client = server.app.test_client()
        result = client.get('/signup')
        self.assertIn('Sign Up', result.data.decode())


if __name__ == '__main__':
    unittest.main()
