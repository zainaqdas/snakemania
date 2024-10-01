let player = {
  name: "Player1",
  level: 1,
  pills: 0,
  lifelines: 10,
  referralLink: "https://t.me/MySnakeGameBot?start=REF_CODE",
  lastLogin: null,
};

let leaderboard = [];
let lifelineTimer, snakeSpeed, interval;

// Initialize Player Info on Home Screen
document.getElementById("playerName").innerText = player.name;
document.getElementById("playerLevel").innerText = player.level;
document.getElementById("playerPills").innerText = player.pills;

// Show Sections and Hide Others
function showSection(sectionId) {
  const sections = ["homeSection", "gameSection", "taskSection", "leaderboardSection", "referralSection"];
  sections.forEach((id) => {
    document.getElementById(id).style.display = id === sectionId ? "block" : "none";
  });
}

// Start the Game
document.getElementById("playBtn").addEventListener("click", () => {
  showSection("gameSection");
  startGame();
});

// Snake Game Logic
function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let snake = [{ x: 200, y: 200 }];
  let direction = { x: 0, y: -10 };
  let pill = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };

  snakeSpeed = 100 - player.level * 10; // Speed increases with level

  interval = setInterval(() => {
    ctx.clearRect(0, 0, 400, 400);

    // Draw the snake
    snake.forEach((segment) => {
      ctx.fillStyle = "green";
      ctx.fillRect(segment.x, segment.y, 10, 10);
    });

    // Move the snake
    let newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);

    if (newHead.x === pill.x && newHead.y === pill.y) {
      player.pills += 10; // Earn Pills by eating
      document.getElementById("playerPills").innerText = player.pills;
      pill = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 }; // New pill position
    } else {
      snake.pop();
    }

    // Draw the pill
    ctx.fillStyle = "red";
    ctx.fillRect(pill.x, pill.y, 10, 10);

    // Collision detection (walls or itself)
    if (newHead.x < 0 || newHead.x >= 400 || newHead.y < 0 || newHead.y >= 400 || checkCollision(newHead, snake)) {
      clearInterval(interval);
      alert("Game Over");
      showSection("homeSection");
    }
  }, snakeSpeed);
}

// Collision detection
function checkCollision(head, snake) {
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

// Button Controls for Snake
document.getElementById("upBtn").addEventListener("click", () => { direction = { x: 0, y: -10 }; });
document.getElementById("leftBtn").addEventListener("click", () => { direction = { x: -10, y: 0 }; });
document.getElementById("rightBtn").addEventListener("click", () => { direction = { x: 10, y: 0 }; });
document.getElementById("downBtn").addEventListener("click", () => { direction = { x: 0, y: 10 }; });

// Task Section Rewards
document.getElementById("task1").addEventListener("click", () => { player.pills += 50; updatePills(); });
document.getElementById("task2").addEventListener("click", () => { player.pills += 50; updatePills(); });

// Update Pills Display
function updatePills() {
  document.getElementById("playerPills").innerText = player.pills;
}

// Daily Rewards
function dailyRewards() {
  const today = new Date().toDateString();
  if (player.lastLogin !== today) {
    player.lastLogin = today;
    const dayStreak = (new Date() - new Date(player.lastLogin)) / (1000 * 60 * 60 * 24) % 7 + 1;
    player.pills += dayStreak * 100; // 100 pills on day 1, 700 on day 7
    updatePills();
    alert(`You have earned ${dayStreak * 100} Pills as your daily reward!`);
  }
}

// Call daily rewards check when the player logs in
dailyRewards();

// Leaderboard Logic
function updateLeaderboard() {
  leaderboard.push({ name: player.name, pills: player.pills });
  leaderboard.sort((a, b) => b.pills - a.pills); // Sort leaderboard by pills in descending order

  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = ""; // Clear existing leaderboard

  leaderboard.slice(0, 10).forEach((entry, index) => {
    let listItem = document.createElement("li");
    listItem.innerText = `${index + 1}. ${entry.name} - ${entry.pills} Pills`;
    leaderboardList.appendChild(listItem);
  });
}

// Weekly Leaderboard Reset
function resetLeaderboard() {
  leaderboard = [];
}

// Referral Section Logic
document.getElementById("referralLink").innerText = player.referralLink;

// Handle Referrals
function handleReferral(referralCode) {
  player.pills += 50; // Award 50 Pills for successful referral
  updatePills();
}

// Lifeline System
function restoreLifelines() {
  if (player.lifelines < 10) {
    player.lifelines += 1; // Restore one lifeline per hour
    alert("1 lifeline restored!");
  }
}

// Start the lifeline restoration every hour
lifelineTimer = setInterval(restoreLifelines, 3600000); // 3600000 milliseconds = 1 hour

// Leveling Up Mechanism
function levelUp() {
  player.level += 1;
  snakeSpeed -= 10; // Decrease snake speed interval, increasing game speed
  document.getElementById("playerLevel").innerText = player.level;
}

// Increment level after a certain number of Pills earned
function checkLevelUp() {
  if (player.pills >= player.level * 100) {
    levelUp();
  }
}

// Increment level every time the player earns enough pills
setInterval(checkLevelUp, 1000);

// Utility to reset the leaderboard at the end of the week
function weeklyReset() {
  resetLeaderboard();
  alert("Leaderboard has been reset! New competition starts now.");
}

// Call weeklyReset at the start of every week
const oneWeek = 604800000; // 7 days in milliseconds
setInterval(weeklyReset, oneWeek);
