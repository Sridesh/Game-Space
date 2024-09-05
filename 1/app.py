from flask import Flask, request, jsonify, render_template, send_from_directory
import mysql.connector
import time

app = Flask(__name__)
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Poorna@yd0241',
    'database': 'tower_of_hanoi'
}

game_state = {}

def record_result(player_name, num_moves, time_taken):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO GameRecords (player_name, num_moves, time_taken)
        VALUES (%s, %s, %s)
    ''', (player_name, num_moves, time_taken))
    connection.commit()
    cursor.close()
    connection.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/style.css')
def serve_css():
    return send_from_directory('static', 'style.css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('static', 'script.js')

@app.route('/api/start_game', methods=['POST'])
def start_game():
    data = request.json
    num_disks = data.get('numDisks')

    # Initialize game state
    global game_state 
    game_state = {
        'numDisks': num_disks,
        'rods': {
            'A': list(range(num_disks, 0, -1)),  # Disks on rod A initially
            'B': [],
            'C': []
        }
    }

    return jsonify({'success': True, 'gameState': game_state['rods']})

@app.route('/api/move', methods=['POST'])
def move():
    data = request.json
    from_rod = data.get('fromRod')
    to_rod = data.get('toRod')

    # Validate the move
    if not game_state['rods'][from_rod]:
        return jsonify({'success': False, 'message': 'Invalid move: No disk on the source rod.'})

    if game_state['rods'][to_rod] and game_state['rods'][to_rod][-1] < game_state['rods'][from_rod][-1]:
        return jsonify({'success': False, 'message': 'Invalid move: Cannot place larger disk on smaller one.'})

    # Execute the move
    disk = game_state['rods'][from_rod].pop()
    game_state['rods'][to_rod].append(disk)

    return jsonify({'success': True, 'gameState': game_state['rods']})

@app.route('/api/reset_game', methods=['POST'])
def reset_game():
    global game_state
    game_state = {}  # Reset game state

    return jsonify({'success': True})


@app.route('/api/record', methods=['POST'])
def record():
    try:
        data = request.json
        player_name = data.get('player_name')
        num_moves = data.get('num_moves')
        time_taken = data.get('time_taken')
        
        record_result(player_name, num_moves, time_taken)
        return jsonify({"message": "Record saved successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
