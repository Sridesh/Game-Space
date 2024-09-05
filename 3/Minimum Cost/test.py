import unittest
import numpy as np
from scipy.optimize import linear_sum_assignment
from Minimum_cost import (
    subtract_row_min,
    subtract_column_min,
    cover_zeros,
    find_optimal_assignment,
    format_matrix,
    format_assignment
)

class TestMinimumCost(unittest.TestCase):
    
    def test_subtract_row_min(self):
        matrix = [
            [10, 20, 30],
            [40, 50, 60]
        ]
        expected_result = [
            [0, 10, 20],
            [0, 10, 20]
        ]
        result = subtract_row_min(matrix)
        self.assertEqual(result, expected_result)
    
    def test_subtract_column_min(self):
        matrix = [
            [0, 10, 20],
            [0, 10, 20]
        ]
        expected_result = [
            [0, 0, 0],
            [0, 0, 0]
        ]
        result = subtract_column_min(matrix)
        self.assertEqual(result, expected_result)
    
    def test_cover_zeros(self):
        matrix = [
            [0, 10, 20],
            [10, 0, 30]
        ]
        
        result = cover_zeros(matrix)
        self.assertTrue(np.array_equal(np.array(result), np.array([[0, 10, 20], [10, 0, 30]])))
    
    def test_find_optimal_assignment(self):
        matrix = [
            [10, 20, 30],
            [30, 20, 10]
        ]
        expected_assignment = ([0, 1], [0, 1])
        expected_total_cost = 40
        result, total_cost = find_optimal_assignment(matrix)
        self.assertEqual(result, expected_assignment)
        self.assertEqual(total_cost, expected_total_cost)
    
    def test_format_matrix(self):
        matrix = [
            [10, 20],
            [30, 40]
        ]
        expected_output = "   10   20\n   30   40"
        result = format_matrix(matrix)
        self.assertEqual(result, expected_output)
    
    def test_format_assignment(self):
        assignment = ([0, 1], [0, 1])
        expected_output = "Task 0 assigned to Employee 0\nTask 1 assigned to Employee 1"
        result = format_assignment(assignment)
        self.assertEqual(result, expected_output)

if __name__ == "__main__":
    unittest.main()
