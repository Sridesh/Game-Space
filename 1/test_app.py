import unittest
from app import app

class TowerOfHanoiTestCase(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_index_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Tower of Hanoi', response.data)

    def test_start_game(self):
        response = self.client.post('/api/start_game', json={'numDisks': 3})
        json_data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(json_data['success'])
        self.assertIn('A', json_data['gameState'])

    def test_move(self):
        self.client.post('/api/start_game', json={'numDisks': 3})
        response = self.client.post('/api/move', json={'fromRod': 'A', 'toRod': 'B'})
        json_data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(json_data['success'])

    def test_record(self):
        response = self.client.post('/api/record', json={
            'player_name': 'Tester',
            'num_moves': 10,
            'time_taken': 20
        })
        json_data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertIn('Record saved successfully', json_data['message'])

if __name__ == '__main__':
    unittest.main()
