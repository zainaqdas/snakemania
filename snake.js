// Game Variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Size of the snake and food
let snake = [{ x: 9 * box, y: 9 * box }]; // Snake starts at the center
let direction = { x: 0, y: 0 }; // Current direction of the snake
let food = { x: Math.floor(Math.random() * 18 + 1) * box, y: Math.floor(Math.random() * 18 + 1) * box }; // Random food position
let score = 0; // Player's score
let lifelines = 10; // Lifelines
let dailyRewards = 100; // Daily rewards points
let totalPoints = 0; // Total points for tasks
let leaderboard = []; // Leaderboard array
let referrals = {}; // Referral tracking

// Draw Snake Function
function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });
}

// Draw Food Function
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// Move Snake Function
function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return; // Do not move if no direction is set

    const newHead = { x: snake[0].x + direction.x * box, y: snake[0].y + direction.y * box };

    // Check for food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 18 + 1) * box, y: Math.floor(Math.random() * 18 + 1) * box }; // New food position
        totalPoints += 10; // Increment points for eating food
    } else {
        snake.pop(); // Remove last segment if no food is eaten
    }

    // Check for collisions with walls or self
    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height || collision(newHead, snake)) {
        // Handle Game Over
        alert("Game Over!");
        clearInterval(game);
        return;
    }

    snake.unshift(newHead); // Add new head to the snake
}

// Check Collision Function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Main Draw Function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSnake(); // Draw the snake
    drawFood(); // Draw the food
    moveSnake(); // Move the snake
}

// Control Functions
document.getElementById("upButton").addEventListener("click", function() {
    if (direction.y === 0) {
        direction = { x: 0, y: -1 }; // Move up
    }
});

document.getElementById("downButton").addEventListener("click", function() {
    if (direction.y === 0) {
        direction = { x: 0, y: 1 }; // Move down
    }
});

document.getElementById("leftButton").addEventListener("click", function() {
    if (direction.x === 0) {
        direction = { x: -1, y: 0 }; // Move left
    }
});

document.getElementById("rightButton").addEventListener("click", function() {
    if (direction.x === 0) {
        direction = { x: 1, y: 0 }; // Move right
    }
});

// Start the Game
let game = setInterval(draw, 100); // Draw every 100ms

// Task Management
let tasks = [
    { name: "Follow Social Media", points: 50 },
    { name: "Like a Post", points: 30 },
    { name: "Share a Post", points: 40 },
];

// Function to Complete Task
function completeTask(taskIndex) {
    const task = tasks[taskIndex];
    totalPoints += task.points;
    alert(`Task Completed: ${task.name} +${task.points} Pills!`);
    displayTasks(); // Refresh task list
}

// Function to Display Tasks
function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear current tasks
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.innerHTML = `${task.name} - ${task.points} Pills <button onclick="completeTask(${index})">Complete</button>`;
        taskList.appendChild(taskItem);
    });
}

// Call displayTasks() to show tasks initially
displayTasks();

// Leaderboard Management

// Function to Update Leaderboard
function updateLeaderboard(playerName, score) {
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort descending by score
    if (leaderboard.length > 10) {
        leaderboard.pop(); // Keep only top 10
    }
}

// Function to Display Leaderboard
function displayLeaderboard() {
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = ""; // Clear current leaderboard
    leaderboard.forEach((player) => {
        const playerItem = document.createElement("div");
        playerItem.innerHTML = `${player.name} - ${player.score} Pills`;
        leaderboardList.appendChild(playerItem);
    });
}

// Call displayLeaderboard() to show leaderboard initially
displayLeaderboard();

// Referral Management

function generateReferralLink(playerName) {
    const referralLink = `https://yourgame.com/?ref=${playerName}`;
    referrals[playerName] = (referrals[playerName] || 0) + 1; // Increment referral count
    alert(`Your referral link: ${referralLink}`);
}

// Function to Check Referrals
function checkReferrals() {
    Object.keys(referrals).forEach(player => {
        console.log(`${player} has referred ${referrals[player]} players.`);
    });
}

// Example: Call this function when a player generates a referral link
// generateReferralLink("Player1");
