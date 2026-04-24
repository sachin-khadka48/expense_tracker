import unittest
from src.tracker import Tracker

class TestTracker(unittest.TestCase):

    def setUp(self):
        self.tracker = Tracker()

    def test_add_expense(self):
        self.tracker.add_expense(500, 'Food')
        self.assertEqual(len(self.tracker.view_expenses()), 1)
        self.assertEqual(self.tracker.view_expenses()[0].amount, 500)
        self.assertEqual(self.tracker.view_expenses()[0].category, 'Food')

    def test_calculate_total(self):
        self.tracker.add_expense(500, 'Food')
        self.tracker.add_expense(200, 'Travel')
        self.assertEqual(self.tracker.calculate_total(), 700)

    def test_view_expenses(self):
        self.tracker.add_expense(300, 'Utilities')
        expenses = self.tracker.view_expenses()
        self.assertEqual(len(expenses), 1)
        self.assertEqual(expenses[0].amount, 300)
        self.assertEqual(expenses[0].category, 'Utilities')

if __name__ == '__main__':
    unittest.main()