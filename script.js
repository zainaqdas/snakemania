const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Size of the snake and food
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = 'RIGHT';
let food = spawnFood();
let score = 0;
let lifelines = 10;
let pills = 0;
let level = 1;
let dailyRewards = [100, 200, 300, 400, 500, 600, 700];
let dailyRewardCount = 0;
let tasks = [
    { name: 'Follow us on Twitter', reward: 50 },
    { name: 'Like our Facebook post', reward: 30 },
    { name: 'Share a post', reward: 20 },
];

document.getElementById('playBtn').addEventListener('click', startGame);
document.getElementById('leftBtn').addEventListener('click', () => changeDirection('LEFT'));
document.getElementById('upBtn').addEventListener('click', () => changeDirection('UP'));
document.getElementById('downBtn').addEventListener('click', () => changeDirection('DOWN'));
document.getElementById('rightBtn').addEventListener('click', () => changeDirection('RIGHT'));

document.getElementById('tasksBtn').addEventListener('click', showTasks);
document.getElementById('leaderboardBtn').addEventListener('click', showLeaderboard);
document.getElementById('referralBtn').addEventListener('click', showReferral);

let game;

function startGame() {
    clearInterval(game);
    resetGame();
    game = setInterval(draw, 100);
    hideAllSections();
}

function resetGame() {
    snake = [{ x: 9 * box, y: 9 * box }];
    direction = 'RIGHT';
    food = spawnFood();
    score = 0;
    pills = 0;
    lifelines = 10;
    dailyRewardCount = (dailyRewardCount + 1) % 7;
    pills += dailyRewards[dailyRewardCount];
    updateDisplay();
}

function draw() {
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen'; // Head and body color
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Wrapping around the screen
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;

    const newHead = { x: snakeX, y: snakeY };

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        pills += 10; // Earn Pills for eating food
        food = spawnFood();
        increaseLevel(); // Increase level for each food eaten
    } else {
        snake.pop(); // Remove the tail
    }

    if (collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over! Your score was: ' + score);
    }

    snake.unshift(newHead);
    updateDisplay();
}

function changeDirection(newDirection) {
    if (newDirection === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
    if (newDirection === 'UP' && direction !== 'DOWN') direction = 'UP';
    if (newDirection === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
    if (newDirection === 'DOWN' && direction !== 'UP') direction = 'DOWN';
}

function collision(head, array) {
    for (let i = 1; i < array.length; i++) { // Exclude the head from collision check
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

function updateDisplay() {
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('pills').innerText = pills;
    document.getElementById('lifelines').innerText = 'Lifelines: ' + lifelines;
    document.getElementById('level').innerText = level;
}

function increaseLevel() {
    if (score % 5 === 0) { // Increase level every 5 points
        level++;
        clearInterval(game);
        game = setInterval(draw, 100 - (level * 5)); // Increase speed with level
    }
}

function showTasks() {
    hideAllSections();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerText = `${task.name} - Reward: ${task.reward} Pills`;
        li.addEventListener('click', () => completeTask(task));
        taskList.appendChild(li);
    });
    document.getElementById('taskSection').classList.remove('hidden');
}

function completeTask(task) {
    pills += task.reward; // Add task reward to Pills
    alert(`Task completed: ${task.name} - Earned ${task.reward} Pills!`);
    updateDisplay();
}

function showLeaderboard() {
    hideAllSections();
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = ''; // Clear previous leaderboard entries

    // Dummy data for leaderboard (in a real app, this would come from a server)
    const leaderboardData = [
        { name: 'Player1', pills: 150 },
        { name: 'Player2', pills: 120 },
        { name: 'Player3', pills: 100 },
        { name: 'Player4', pills: 90 },
        { name: 'Player5', pills: 80 },
        { name: 'Player6', pills: 70 },
        { name: 'Player7', pills: 60 },
        { name: 'Player8', pills: 50 },
        { name: 'Player9', pills: 40 },
        { name: 'Player10', pills: 30 },
    ];

    leaderboardData.sort((a, b) => b.pills - a.pills); // Sort by pills

    leaderboardData.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name}: ${entry.pills} Pills`;
        leaderboardList.appendChild(li);
    });

    document.getElementById('leaderboardSection').classList.remove('hidden');
}

function showReferral() {
    hideAllSections();
    document.getElementById('referralLink').innerText = `http://game.com/referral?user=Player1`; // Modify with real username
    document.getElementById('referralSection').classList.remove('hidden');
}

function hideAllSections() {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('taskSection').classList.add('hidden');
    document.getElementById('leaderboardSection').classList.add('hidden');
    document.getElementById('referralSection').classList.add('hidden');
}

document.getElementById('homeBtn').addEventListener('click', () => {
    hideAllSections();
    updateDisplay(); // Update display when going back to home
    document.getElementById('homeSection').classList.remove('hidden');
});

// Function to handle lifeline restoration
function restoreLifelines() {
    if (lifelines < 10) {
        lifelines++;
        updateDisplay();
    }
}

// Check if lifelines need to be restored every hour (3600000 ms)
setInterval(restoreLifelines, 3600000);
