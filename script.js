const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let paddleWidth = 10;
let paddleHeight = 100;
let player1, player2;
let balls = [];
let bounceCount = 0;
let timer = 60;
let gameOver = false;

// Initial values
function resetPlayersAndBalls() {
  player1 = { x: 30, y: canvas.height / 2 - 50, dy: 0, misses: 0 };
  player2 = { x: canvas.width - 40, y: canvas.height / 2 - 50, dy: 0, misses: 0 };
  balls = [createBall()];
  bounceCount = 0;
}

// Responsive resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (!gameOver) {
    resetPlayersAndBalls();
  }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createBall() {
  const speed = 7; // faster ball speed
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: (Math.random() > 0.5 ? 1 : -1) * speed,
    dy: (Math.random() > 0.5 ? 1 : -1) * speed,
  };
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, size = 20) {
  ctx.fillStyle = 'white';
  ctx.font = `${size}px sans-serif`;
  ctx.fillText(text, x, y);
}

function movePlayers() {
  player1.y += player1.dy;
  player2.y += player2.dy;
  player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));
  player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));
}

function updateBalls() {
  for (let ball of balls) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off top/bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy *= -1;
      incrementBounces();
    }

    // Paddle collisions
    if (
      ball.x - ball.radius < player1.x + paddleWidth &&
      ball.y > player1.y && ball.y < player1.y + paddleHeight
    ) {
      ball.dx *= -1;
      ball.x = player1.x + paddleWidth + ball.radius;
      incrementBounces();
    }

    if (
      ball.x + ball.radius > player2.x &&
      ball.y > player2.y && ball.y < player2.y + paddleHeight
    ) {
      ball.dx *= -1;
      ball.x = player2.x - ball.radius;
      incrementBounces();
    }

    // Missed ball
    if (ball.x < 0) {
      player1.misses++;
      Object.assign(ball, createBall());
    }

    if (ball.x > canvas.width) {
      player2.misses++;
      Object.assign(ball, createBall());
    }
  }
}

function incrementBounces() {
  bounceCount++;
  if (bounceCount % 10 === 0) {
    balls.push(createBall());
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(player1.x, player1.y, paddleWidth, paddleHeight, 'white');
  drawRect(player2.x, player2.y, paddleWidth, paddleHeight, 'white');

  drawText(`Misses: ${player1.misses}`, player1.x, player1.y - 20);
  drawText(`Misses: ${player2.misses}`, player2.x - 80, player2.y - 20);
  drawText(`Time Left: ${timer}`, canvas.width / 2 - 50, 30);

  for (let ball of balls) {
    drawCircle(ball.x, ball.y, ball.radius, 'white');
  }

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
    let result;
    if (player1.misses < player2.misses) {
      result = "Player 1 Wins!";
    } else if (player2.misses < player1.misses) {
      result = "Player 2 Wins!";
    } else {
      result = "It's a tie!";
    }
    ctx.fillText(result, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`P1 Misses: ${player1.misses} | P2 Misses: ${player2.misses}`, canvas.width / 2, canvas.height / 2 + 50);
  }
}

function gameLoop() {
  if (!gameOver) {
    movePlayers();
    updateBalls();
    draw();
    requestAnimationFrame(gameLoop);
  } else {
    draw(); // draw final screen
  }
}

// Countdown timer
setInterval(() => {
  if (!gameOver) {
    timer--;
    if (timer <= 0) {
      gameOver = true;
    }
  }
}, 1000);

// Controls with faster paddle speed
document.addEventListener('keydown', e => {
  if (e.key === 'w') player1.dy = -10;
  if (e.key === 's') player1.dy = 10;
  if (e.key === 'ArrowUp') player2.dy = -10;
  if (e.key === 'ArrowDown') player2.dy = 10;
});

document.addEventListener('keyup', e => {
  if (['w', 's'].includes(e.key)) player1.dy = 0;
  if (['ArrowUp', 'ArrowDown'].includes(e.key)) player2.dy = 0;
});

// Start
resetPlayersAndBalls();
gameLoop();
