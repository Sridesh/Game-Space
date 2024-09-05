let numDisks;
let rods;
let movesCount = 0;
let startTime;
let timerInterval;
let playerName;

// Get references to UI elements
const startGameBtn = document.getElementById('startGameBtn');
const resetBtn = document.getElementById('resetBtn');
const moveAtoB = document.getElementById('moveAtoB');
const moveAtoC = document.getElementById('moveAtoC');
const moveBtoA = document.getElementById('moveBtoA');
const moveBtoC = document.getElementById('moveBtoC');
const moveCtoA = document.getElementById('moveCtoA');
const moveCtoB = document.getElementById('moveCtoB');
const timerDisplay = document.getElementById('timer');
const moveCountDisplay = document.getElementById('moveCount');

// Add event listeners
startGameBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
moveAtoB.addEventListener('click', () => moveDisk('A', 'B'));
moveAtoC.addEventListener('click', () => moveDisk('A', 'C'));
moveBtoA.addEventListener('click', () => moveDisk('B', 'A'));
moveBtoC.addEventListener('click', () => moveDisk('B', 'C'));
moveCtoA.addEventListener('click', () => moveDisk('C', 'A'));
moveCtoB.addEventListener('click', () => moveDisk('C', 'B'));

function startGame() {

    // Get player name from the input field
    playerName = document.getElementById('playerName').value;

    // Validate the player's name
    if (!playerName) {
        document.getElementById('errorMessage').innerText = "Please enter your name before starting the game.";
        document.getElementById('errorMessage').style.display = "block";
        return; // Stop the function if the name is invalid
    } else {
        document.getElementById('errorMessage').style.display = "none"; // Hide the error message
    }

    numDisks = parseInt(document.getElementById('numDisks').value);
    rods = {
        A: Array.from({ length: numDisks }, (_, i) => i + 1).reverse(),
        B: [],
        C: []
    };

    // Initialize game state in the backend
    fetch('/api/start_game', { // Assuming this is your Flask endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numDisks })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                rods = data.gameState; // Get initial game state from backend
                movesCount = 0;
                startTime = Date.now();
                timerInterval = setInterval(updateTimer, 1000); // Start the timer
                setupDisks();
                updateDisplay();
            } else {
                alert(data.message); // Handle errors from backend
            }
        });

}

function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${currentTime}s`;
}

function setupDisks() {
    // Clear any existing disks
    const rodElements = document.querySelectorAll('.rod');
    rodElements.forEach(rod => {
        rod.innerHTML = ''; // Clear existing disks from rods
    });

    // Create disks based on numDisks
    for (let i = 0; i < numDisks; i++) {
        const disk = document.createElement('div');
        disk.classList.add('disk');

        // Assign classes for different sizes
        if (i === 0) disk.classList.add('large');
        if (i === 1) disk.classList.add('medium');
        if (i >= 2) disk.classList.add('small');

        // Position the disk at the bottom of Rod A
        disk.style.left = '0px'; // Left position corresponding to Rod A
        disk.style.bottom = `${i * 20}px`; // Stack disks vertically
        document.getElementById('rodA').appendChild(disk); // Append to Rod A
    }
}

function updateDisplay() {

    const rodElements = {
        A: document.getElementById('rodA'),
        B: document.getElementById('rodB'),
        C: document.getElementById('rodC')
    };

    // Clear existing disks
    Object.values(rodElements).forEach(rod => rod.innerHTML = '');

    // Ensure rods are properly initialized
    Object.keys(rods).forEach(rod => {
        if (Array.isArray(rods[rod])) {
            rods[rod].forEach(diskNumber => {
                const disk = document.createElement('div');
                disk.className = `disk disk-${diskNumber}`;
                rodElements[rod].appendChild(disk);
            });
        }
    });
}

function moveDisk(fromRod, toRod) {
    if (rods[fromRod].length === 0) {
        alert("Invalid move: No disk on the source rod.");
        return;
    }
    if (rods[toRod].length > 0 && rods[toRod][rods[toRod].length - 1] < rods[fromRod][rods[fromRod].length - 1]) {
        alert("Invalid move: Cannot place larger disk on smaller one.");
        return;
    }

    const diskNum = rods[fromRod].pop(); // Remove the disk from the source rod
    rods[toRod].push(diskNum); // Place it on the destination rod

    // Send move request to backend
    fetch(`/api/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromRod, toRod })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI based on backend response
                rods = data.gameState; // Assuming backend sends updated game state
                movesCount++;
                moveCountDisplay.textContent = `Moves: ${movesCount}`; // Update move count
                updateDisplay();

                // Check for win condition
                if (rods.C.length === numDisks) {
                    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
                    alert(`Congratulations ${playerName}! You won in ${movesCount} moves and ${timeTaken} seconds!`);
                    clearInterval(timerInterval); // Stop the timer
                    saveRecord(playerName, movesCount, timeTaken);
                }
            } else {
                alert(data.message); // Display error message from backend
            }
        });
}

function resetGame() {
    // Reset game state in the backend 
    fetch('/api/reset_game', { // Assuming this is your Flask endpoint
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear UI and reset variables
                rods = { A: [], B: [], C: [] };
                movesCount = 0;
                playerName = ""; // Clear player name
                document.getElementById('numDisks').value = ""; // Clear numDisks input
                document.getElementById('playerName').value = ""; // Clear playerName input
                timerDisplay.textContent = "Time: 0s"; // Reset timer display
                moveCountDisplay.textContent = "Moves: 0";
                clearInterval(timerInterval); // Stop the timer
                setupDisks();
            } else {
                alert(data.message); // Handle errors from backend
            }
        });
}

// Recursive function to get moves for solving Tower of Hanoi
function solveTowerOfHanoi(n, fromRod, toRod, auxRod) {
    if (n === 1) {

        moveDisk(fromRod, toRod); // You can call moveDisk to visually move
        return;
    }
    solveTowerOfHanoi(n - 1, fromRod, auxRod, toRod); // Move n-1 disks to auxiliary
    moveDisk(fromRod, toRod); // Visually move n disk
    solveTowerOfHanoi(n - 1, auxRod, toRod, fromRod); // Move the n-1 disks to destination
}


function saveRecord(playerName, numMoves, timeTaken) {
    fetch('/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName, num_moves: numMoves, time_taken: timeTaken })
    })
        .then(response => response.json())
        .then(data => alert(data.message));
}
