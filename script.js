const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10, paddleHeight = 100;
const player1 = { x: 20, y: 200, dy: 0 };
const player2 = { x: 770, y: 200, dy: 0 };

let balls = [createBall()];
let bounceCount = 0;

function createBall() {
  const speed = 4;
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

    // Bounce off top/bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy *= -1;
      incrementBounces();
    }

    // Paddle collisions
    if (ball.x - ball.radius < player1.x + paddleWidth &&
        ball.y > player1.y && ball.y < player1.y + paddleHeight) {
      ball.dx *= -1;
      ball.x = player1.x + paddleWidth + ball.radius;
      incrementBounces();
    }

    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y && ball.y < player2.y + paddleHeight) {
      ball.dx *= -1;
      ball.x = player2.x - ball.radius;
      incrementBounces();
    }

    // Out of bounds (just reset ball position)
    if (ball.x < 0 || ball.x > canvas.width) {
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
  for (let ball of balls) {
    drawCircle(ball.x, ball.y, ball.radius, 'white');
  }
}

function gameLoop() {
  movePlayers();
  updateBalls();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', e => {
  if (e.key === 'w') player1.dy = -5;
  if (e.key === 's') player1.dy = 5;
  if (e.key === 'ArrowUp') player2.dy = -5;
  if (e.key === 'ArrowDown') player2.dy = 5;
});

document.addEventListener('keyup', e => {
  if (['w', 's'].includes(e.key)) player1.dy = 0;
  if (['ArrowUp', 'ArrowDown'].includes(e.key)) player2.dy = 0;
});

gameLoop();
