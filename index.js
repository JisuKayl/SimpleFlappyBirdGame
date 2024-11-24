const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let bird;
let pipes = [];
let score = 0;
let gameOver = false;

const GRAVITY = 0.6;
const FLAP = -10;
const SPAWN_RATE = 80;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const PIPE_MIN_HEIGHT = 100;
const PIPE_MAX_HEIGHT = 350;
const PIPE_SPACING = 300;

class Bird {
  constructor() {
    this.x = 150;
    this.y = canvas.height / 2;
    this.width = 40;
    this.height = 40;
    this.velocity = 0;
  }

  draw() {
    ctx.fillStyle = "#FFCD02";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  flap() {
    this.velocity = FLAP;
  }

  update() {
    this.velocity += GRAVITY;
    this.y += this.velocity;

    if (this.y + this.height > canvas.height || this.y < 0) {
      this.reset();
      gameOver = true;
      displayGameOver();
    }

    this.draw();
  }

  reset() {
    this.x = 150;
    this.y = canvas.height / 2;
    this.velocity = 0;
  }
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.topHeight = Math.floor(
      Math.random() * (PIPE_MAX_HEIGHT - PIPE_MIN_HEIGHT) + PIPE_MIN_HEIGHT
    );
    this.bottomHeight = canvas.height - this.topHeight - PIPE_GAP;
    this.passed = false;
  }

  draw() {
    ctx.fillStyle = "#228B22";
    ctx.fillRect(this.x, 0, PIPE_WIDTH, this.topHeight);
    ctx.fillRect(
      this.x,
      canvas.height - this.bottomHeight,
      PIPE_WIDTH,
      this.bottomHeight
    );
  }

  update() {
    this.x -= 2;
    this.draw();
  }
}

function spawnPipe() {
  if (
    pipes.length === 0 ||
    pipes[pipes.length - 1].x < canvas.width - PIPE_SPACING
  ) {
    pipes.push(new Pipe(canvas.width));
  }
}

function checkCollisions() {
  pipes.forEach((pipe, index) => {
    if (pipe.x < bird.x + bird.width && pipe.x + PIPE_WIDTH > bird.x) {
      if (
        bird.y < pipe.topHeight ||
        bird.y + bird.height > canvas.height - pipe.bottomHeight
      ) {
        bird.reset();
        gameOver = true;
        displayGameOver();
      }
    }

    if (pipe.x + PIPE_WIDTH < bird.x && !pipe.passed) {
      pipe.passed = true;
      if (!gameOver) {
        score++;
        scoreElement.textContent = "Score: " + score;
      }
    }

    if (pipe.x + PIPE_WIDTH < 0) {
      pipes.splice(index, 1);
    }
  });
}

function displayGameOver() {
  alert(
    `Game Over! Final Score: ${score}\nRefresh the page to start a new game.`
  );
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    bird.update();
    spawnPipe();
    pipes.forEach((pipe) => pipe.update());
    checkCollisions();
  }

  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (e) {
  if (e.key === " " && !gameOver) {
    if (gameOver) {
      return;
    }
    bird.flap();
  }
});

bird = new Bird();
update();
