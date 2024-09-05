import numpy as np
import tkinter as tk
from tkinter import font, messagebox
import random
import time
from datetime import datetime
from scipy.optimize import linear_sum_assignment
import sqlite3

def setup_database():
    conn = sqlite3.connect('results.db')
    cursor = conn.cursor()

    # SQLite Database
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            num_tasks INTEGER,
            time_taken REAL,
            timestamp TEXT
        )
    ''')

    conn.commit()
    conn.close()

setup_database()

def solve_hungarian():
    try:
        num_tasks = int(entry_num_tasks.get())
        if num_tasks <= 0:
            raise ValueError("Number of tasks must be positive.")
        
        start_time = time.time()
        
        #Gneration of random matrix with values from 20 to 200
        matrix = [[random.randint(20, 200) for _ in range(num_tasks)] for _ in range(num_tasks)]
        
        # Function Calling Substraction of Row minima & Column Minima
        row_min_matrix = subtract_row_min(matrix)
        col_min_matrix = subtract_column_min(row_min_matrix)
        
        # Function Calling Covering Zeros
        covered_matrix = cover_zeros(col_min_matrix)
        assignment, total_cost = find_optimal_assignment(covered_matrix)
        
        end_time = time.time()
        time_taken = end_time - start_time
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Formating the cost matrix for Neatness for display 
        formatted_matrix = format_matrix(covered_matrix)
        assignment_str = format_assignment(assignment)
        
        # Displaying the results in the text area
        cost_matrix_text.delete(1.0, tk.END)
        cost_matrix_text.insert(tk.END, "Cost Matrix:\n")
        cost_matrix_text.insert(tk.END, formatted_matrix + '\n')
        cost_matrix_text.insert(tk.END, "\nOptimal Assignment:\n")
        cost_matrix_text.insert(tk.END, assignment_str)
        cost_matrix_text.insert(tk.END, f"\nTotal Cost: {total_cost}\n")
        
        # Database Insertion
        insert_data(num_tasks, time_taken, timestamp)
    
    except ValueError :
        messagebox.showerror("Invalid Input", "Value Entered is Not supported")

#Funtion definition of substracting Row minima        

def subtract_row_min(matrix): 
    processed_matrix = []
    for row in matrix:
        min_value = min(row)
        processed_row = [value - min_value for value in row]
        processed_matrix.append(processed_row)
    return processed_matrix


#Funtion definition of substracting Column minima

def subtract_column_min(matrix):
    num_rows = len(matrix)
    num_cols = len(matrix[0]) if num_rows > 0 else 0
    processed_matrix = []
    
    # Finding column minima
    col_minima = [min(matrix[row][col] for row in range(num_rows)) for col in range(num_cols)]
    
    # Subtracting column minima from each element in the matrix
    for row in matrix:
        processed_row = [row[col] - col_minima[col] for col in range(num_cols)]
        processed_matrix.append(processed_row)
    
    return processed_matrix

#Funtion definition of Covering Zeros
def cover_zeros(matrix):
    matrix = np.array(matrix)
    num_rows, num_cols = matrix.shape
    covered_rows = set()
    covered_cols = set()
    
    # Convert matrix to binary (0 or 1) for zero covering
    binary_matrix = (matrix == 0).astype(int)
    
    while len(covered_rows) + len(covered_cols) < num_rows:
        # Covering rows and columns with zeros
        row_cover = [False] * num_rows
        col_cover = [False] * num_cols
        
        # Covering rows with maximum zeros
        row_zeros_count = binary_matrix.sum(axis=1)
        for i in range(num_rows):
            if not row_cover[i] and row_zeros_count[i] > 0:
                covered_rows.add(i)
                row_cover[i] = True
                binary_matrix[i, :] = 0
        
        # Covering columns with remaining zeros
        col_zeros_count = binary_matrix.sum(axis=0)
        for j in range(num_cols):
            if not col_cover[j] and col_zeros_count[j] > 0:
                covered_cols.add(j)
                col_cover[j] = True
                binary_matrix[:, j] = 0
        
        if len(covered_rows) + len(covered_cols) >= num_rows:
            break
    
    if len(covered_rows) + len(covered_cols) == num_rows:
        return matrix.tolist()
    
    # Creating additional zeros
    uncovered_elements = np.inf
    for i in range(num_rows):
        if i not in covered_rows:
            for j in range(num_cols):
                if j not in covered_cols:
                    uncovered_elements = min(uncovered_elements, matrix[i, j])
    
    for i in range(num_rows):
        for j in range(num_cols):
            if i not in covered_rows and j not in covered_cols:
                matrix[i, j] -= uncovered_elements
            if i in covered_rows and j in covered_cols:
                matrix[i, j] += uncovered_elements
    
    return cover_zeros(matrix.tolist())


#Funtion definition Finding optimal Assingment


def find_optimal_assignment(matrix):
    # Converting matrix to numpy array for scipy optimization
    
    cost_matrix = np.array(matrix, dtype=int)  # checking the elementis if they are integers
    
    # Using Hungarian algorithm from scipy to find the optimal assignment, 
    row_ind, col_ind = linear_sum_assignment(cost_matrix)
    
    # Calculating the total cost of the optimal assignment
    total_cost = cost_matrix[row_ind, col_ind].sum()
    
    return (row_ind, col_ind), total_cost

#Funtion definition for insertion of datA Database


def insert_data(num_tasks, time_taken, timestamp):
    conn = sqlite3.connect('results.db')
    cursor = conn.cursor()
    
    # Insert data into the table
    cursor.execute('''
        INSERT INTO results (num_tasks, time_taken, timestamp)
        VALUES (?, ?, ?)
    ''', (num_tasks, time_taken, timestamp))
    
    conn.commit()
    conn.close()

#Funtion definition for Formatting the matrix for More clear reading in the UI

def format_matrix(matrix):
     #Formatting the matrix as a string with aligned columns
    if not matrix:
        return ""
    num_cols = len(matrix[0])
    formatted_rows = []
    for row in matrix:
        formatted_row = " ".join(f"{elem:4}" for elem in row)  # Adjust width for neatness
        formatted_rows.append(formatted_row)
    return "\n".join(formatted_rows)

def format_assignment(assignment):
    # Formatting the assignment as a string
    assignment_str = "\n".join(f"Task {i} assigned to Employee {j}" for i, j in enumerate(assignment[1]))
    return assignment_str

# UI
root = tk.Tk()
root.title("Minimum Cost")
root.geometry("1200x600")

label_font = font.Font(size=16, weight='bold')
entry_font = font.Font(size=16)
button_font = font.Font(size=16, weight='bold')

root.configure(bg='#f0f8ff')

label = tk.Label(root, text="Enter the number of tasks:", font=label_font, bg='#f0f8ff', fg='#333333')
label.pack(pady=10)

entry_num_tasks = tk.Entry(root, font=entry_font, bg='#ffffff', fg='#000000', bd=2, relief='solid')
entry_num_tasks.pack(pady=5, padx=20)

btn_solve = tk.Button(root, text="Play", command=solve_hungarian, font=button_font, width=15, height=2, bg='#4CAF50', fg='#ffffff', relief='raised')
btn_solve.pack(pady=20)

cost_matrix_text = tk.Text(root, height=15, font=('Courier', 12), bg='#f0f8ff', fg='#000000', wrap=tk.WORD)
cost_matrix_text.pack(pady=10)

root.mainloop()
