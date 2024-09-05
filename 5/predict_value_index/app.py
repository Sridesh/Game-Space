from flask import Flask, render_template, request, redirect, url_for, flash
import random
import time
import mysql.connector



app = Flask(__name__)
app.secret_key = "supersecretkey"  # for flash messages

# Database configuration
db_config = {
    'user': 'game_user',
    'password': 'root',
    'host': 'localhost',
    'database': 'user_games_data'
}

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

def binary_search(arr, x):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] < x:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def jump_search(array, value):
    length = len(array)
    jump = int(length**0.5)
    prev = 0
    while array[min(jump, length) - 1] < value:
        prev = jump
        jump += int(length**0.5)
        if prev >= length:
            return -1
    for i in range(prev, min(jump, length)):
        if array[i] == value:
            return i
    return -1

def exponential_search(array, value):
    if array[0] == value:
        return 0
    index = 1
    while index < len(array) and array[index] <= value:
        index *= 2
    return binary_search(array[:min(index, len(array))], value)

def fibonacci_search(array, value):
    fib_m2 = 0
    fib_m1 = 1
    fib_m = fib_m2 + fib_m1
    n = len(array)

    while fib_m < n:
        fib_m2 = fib_m1
        fib_m1 = fib_m
        fib_m = fib_m2 + fib_m1

    offset = -1
    while fib_m > 1:
        i = min(offset + fib_m2, n-1)
        if array[i] < value:
            fib_m = fib_m1
            fib_m1 = fib_m2
            fib_m2 = fib_m - fib_m1
            offset = i
        elif array[i] > value:
            fib_m = fib_m2
            fib_m1 -= fib_m2
            fib_m2 = fib_m - fib_m1
        else:
            return i

    if fib_m1 and array[offset + 1] == value:
        return offset + 1
    return -1

def interpolation_search(array, value):
    low = 0
    high = len(array) - 1

    while low <= high and value >= array[low] and value <= array[high]:
        if low == high:
            if array[low] == value:
                return low
            return -1
        pos = low + int((float(high - low) / (array[high] - array[low]) * (value - array[low])))
        if array[pos] == value:
            return pos
        if array[pos] < value:
            low = pos + 1
        else:
            high = pos - 1
    return -1


def generate_sorted_list():
    random_numbers = [random.randint(1, 1000000) for _ in range(5000)]
    random_numbers.sort()
    return random_numbers

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']
        
        sorted_list = generate_sorted_list()
        search_value = random.choice(sorted_list)
        
        search_methods = {
            "Binary Search": binary_search,
             "Jump Search": jump_search,
            "Exponential Search": exponential_search,
            "Fibonacci Search": fibonacci_search,
            "Interpolation Search": interpolation_search
        }
        
        search_results = []
        for method_name, search_fn in search_methods.items():
            start_time = time.perf_counter()
            index = search_fn(sorted_list, search_value)
            end_time = time.perf_counter()
            time_taken = end_time - start_time
            
            search_results.append((method_name, index, time_taken))
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO search_results (search_method, search_value, index_found, time_taken)
                VALUES (%s, %s, %s, %s)
            ''', (method_name, search_value, index, time_taken))
            conn.commit()
            cursor.close()
            conn.close()

        correct_index = search_results[0][1]
        choices = [correct_index]
        while len(choices) < 4:
            option = random.randint(0, len(sorted_list) - 1)
            if option not in choices:
                choices.append(option)
        random.shuffle(choices)
        
        return render_template('index.html', username=username, search_value=search_value, 
                               choices=choices, search_results=search_results)
    
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_guess():
    # Retrieve data from the form
    username = request.form.get('username')             # Get the username
    guessed_index = request.form.get('choice')         # Get the user's guessed index (from radio button)
    correct_index = request.form.get('correct_index')   # Get the correct index from hidden input

    # Check if the values were retrieved correctly
    if guessed_index is None or correct_index is None:
        flash("Error: Required information is missing.")
        return redirect(url_for('index'))  # Redirect to the index page in case of error

    # Logic to determine if the guess is correct
    is_correct = (guessed_index == correct_index)  # Define if the guess was correct

    # Insert user response into the database
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO user_responses (username, selected_index, is_correct)
        VALUES (%s, %s, %s)
    ''', (username, guessed_index, int(is_correct)))  # Store 1 for True, 0 for False

    conn.commit()
    cursor.close()
    conn.close()

    # User feedback based on their guess
    if is_correct:
        flash(f"Correct! {username}, you guessed the right index!")
    else:
        flash(f"Oops! {username}, that's not correct. The correct index was {correct_index}.")
    # Other route definitions...

    return redirect(url_for('index'))  # Redirect as needed

@app.route('/reset_game', methods=['POST'])
def reset_game():
    # Logic to reset the game
    flash('Game has been reset. You can start a new game!')  # Flash message for user
    return redirect(url_for('index'))  # Redirect back to the index page

# Your existing routes...
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)