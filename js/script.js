class Paddle {
    constructor(speed) {
        this.speed = speed;
        this.element = document.createElement('div');
        this.element.className = 'paddle';
        document.getElementById('border-container').appendChild(this.element);
        this.center();
    }

    center() {
        const container = document.getElementById('border-container');
        this.x = (container.clientWidth - this.element.clientWidth) / 2;
        this.y = container.clientHeight - this.element.clientHeight
        this.updatePosition()
    }

    moveLeft() {
        this.x -= this.speed;
        this.check();
        this.updatePosition();
    }

    moveRight() {
        this.x += this.speed;
        this.check();
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    check() {
        const container = document.getElementById('border-container');
        const containerWidth = container.clientWidth;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.element.offsetWidth > containerWidth) {
            this.x = containerWidth - this.element.offsetWidth;
        }
    }
}

class Ball {
    constructor(x, y, speed, loselife) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dx = speed;
        this.dy = -speed;
        this.radius = 12;
        this.loselife = loselife;
        this.element = document.createElement('div');
        this.element.className = 'ball'; 
        document.getElementById('border-container').appendChild(this.element);
        this.move()
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.updatePosition()
    }

    bounceHorizontal() {
        this.dx = -this.dx;
    }

    bouceVertical() {
        this.dy = -this.dy;
    }

    check(container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        if (this.x < 0 || this.x > containerWidth - this.radius * 2) {
            this.bounceHorizontal();
        }

        if (this.y < 0) {
            this.bouceVertical();
        }

        if (this.y > containerHeight - this.radius * 2) {
            this.loselife();
            this.resetPosition();
        }

        const paddle = document.querySelector('.paddle');
        if (
            this.x + this.radius * 2 >= paddle.offsetLeft &&
            this.x <= paddle.offsetLeft + paddle.offsetWidth &&
            this.y + this.radius * 2 >= paddle.offsetTop &&
            this.y <= paddle.offsetTop + paddle.offsetHeight
        ) {
            this.y = paddle.offsetTop - this.radius * 2;
            this.bouceVertical();
            const paddleCenter = paddle.offsetLeft + paddle.offsetWidth / 2;
            const hitPosition = (this.x + this.radius) - paddleCenter;
            const normalizedHit = hitPosition / (paddle.offsetWidth / 2);
            this.dx = normalizedHit * this.speed;  
        }
    }

    resetPosition() {
        paddle.center();
        this.x = paddle.x + (paddle.element.offsetWidth / 2) - 10;
        this.y = paddle.y - 20;
    }

}

class ScoreBoard {
    constructor(Time, score, lives, timerInterval) {
        this.Time = Time;
        this.score = score;
        this.lives = lives;
        this.timerInterval = timerInterval;
        this.element = document.createElement('div');
        this.element.id = 'scoreboard';
        this.element1 = document.createElement('div');
        this.element1.id = 'timer'; 
        this.element2 = document.createElement('div');
        this.element2.id = 'score';
        this.element2.textContent = `Score: ${score}`;
        this.element3 = document.createElement('div');
        this.element3.id = 'lives';
        this.element3.textContent = `Lives: ${lives}`;
        this.element.appendChild(this.element1);
        this.element.appendChild(this.element2);
        this.element.appendChild(this.element3);
        document.body.appendChild(this.element);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!isPaused) {
                this.Time++;
                const minutes = Math.floor(this.Time / 60);
                const seconds = this.Time % 60;
                document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000)
    }

    updateScore() {
        this.element2.textContent = `Score: ${score}`;
    }

    updateLives() {
        this.element3.textContent = `Lives: ${lives}`;
    }
}

let timerInterval;

let lives = 3


let scoreboard = new ScoreBoard(0, 0, lives, timerInterval);

class MenuPause {
    constructor(isSpacePressed) {
        this.isSpacePressed = isSpacePressed;
        this.element = document.createElement('div');
        this.element.id = 'pause-menu';
        this.element.style.display = 'none';
        this.createButtons();
        document.getElementById('border-container').appendChild(this.element);
    }

    createButtons() {
        const continueButton = document.createElement('button');
        continueButton.innerText = 'Continue';
        continueButton.addEventListener('click', () => {
            this.continueGame();
            this.isSpacePressed = true;
        });

        this.element.appendChild(continueButton);
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.addEventListener('click', () => {
            this.restartGame();
            this.isSpacePressed = true;
        });
        this.element.appendChild(restartButton);
    }

    toggleDisplay() {
        this.element.style.display = this.element.style.display === 'none' ? 'block' : 'none';
    }

    continueGame() {
        togglePause();
    }

    restartGame() {
        location.reload();
    }
}

const menuPause = new MenuPause(true);
const paddle = new Paddle(30);
const ball = new Ball(paddle.x + (paddle.element.offsetWidth / 2) - 10, paddle.y - 20, 7, loselife);

const brickMatrix = [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 2, 1, 2, 0, 0, 0],
    [0, 0, 3, 0, 2, 0, 2, 0, 3, 0, 0],
    [0, 0, 4, 3, 1, 3, 1, 3, 4, 0, 0],
    [0, 5, 2, 1, 0, 5, 0, 1, 2, 5, 0],
    [2, 0, 0, 0, 6, 0, 6, 0, 0, 0, 2],
    [0, 0, 0, 7, 1, 6, 1, 7, 0, 0, 0],
    [0, 0, 8, 1, 7, 0, 7, 1, 8, 0, 0],
    [0, 9, 2, 0, 1, 9, 1, 0, 2, 9, 0],
    [10, 0, 0, 0, 3, 0, 3, 0, 0, 0, 10],
    [0, 0, 0, 2, 0, 1, 0, 2, 0, 0, 0],
    [0, 0, 4, 3, 5, 4, 5, 3, 4, 0, 0],
    [0, 4, 0, 5, 4, 1, 4, 5, 0, 4, 0],
    [0, 7, 6, 1, 0, 4, 0, 1, 6, 7, 0],
    [1, 0, 0, 0, 0, 10, 0, 0, 0, 0, 1],
];

const bricks = []


class Brick {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.visible = true;
        this.element = document.createElement('div');
        this.element.className = 'brick'
        this.element.style.position = 'absolute ';
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.background = `linear-gradient(135deg,${color},#69665a`;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        document.getElementById('border-container').appendChild(this.element);
    }

    draw() {
        this.element.style.display = this.visible ? 'block' : 'none';
    }


    checkCollision(ball) {
        if (this.visible) {
            const ballLeft = ball.x;
            const ballRight = ball.x + ball.radius * 2;
            const ballTop = ball.y;
            const ballBottom = ball.y + ball.radius * 2;

            const brickLeft = this.x;
            const brickRight = this.x + this.width;
            const brickTop = this.y;
            const brickBottom = this.y + this.height;

            if (
                ballRight >= brickLeft &&
                ballLeft <= brickRight &&
                ballBottom >= brickTop &&
                ballTop <= brickBottom
            ) {
  
                const overlapLeft = ballRight - brickLeft;
                const overlapRight = brickRight - ballLeft;
                const overlapTop = ballBottom - brickTop;
                const overlapBottom = brickBottom - ballTop;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                    ball.bounceHorizontal()
                } else if (minOverlap === overlapBottom || minOverlap === overlapTop) {
                    ball.bouceVertical()
                }
                this.visible = false;
                score += 10
                scoreboard.updateScore()
            }
        }
    }
}

let score = 0


const brickWidth = 84.27 ;
const brickHeight = 50;
const spacing = 5  ;
const COLOR_MAP = {
    1: "255, 255, 255", 
    2: "255, 165, 0", 
    3: "0, 191, 255",   
    4: "50, 205, 50",  
    5: "255, 0, 0",   
    6: "30, 144, 255",  
    7: "255, 20, 147", 
    8: "255, 215, 0",  
    9: "169, 169, 169",  
    10: "255, 255, 0"  
};

function createBricksFromMatrix(matrix) {
    for (let row = 0 ; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            const brickValue = matrix[row][col]
            if (brickValue > 0) {
                const x = col * (brickWidth + spacing) + 2;
                const y = row * (brickHeight + spacing);
                const brick = new Brick(x, y, brickWidth, brickHeight,`rgb(${COLOR_MAP[brickValue]})`)
                bricks.push(brick)
            }
        }
    }
}

createBricksFromMatrix(brickMatrix);

let isPaused = false;



function gameLoop() {

    if (!isPaused) {
        ball.move();
        ball.check(document.getElementById('border-container'));
        if (bricks.every(brick => !brick.visible)) {
            alert("Congratulations! You cleared all the bricks!");
            ball.resetPosition()
            menuPause.restartGame()
            return;
        }
        bricks.forEach(brick => {
            brick.checkCollision(ball)
            brick.draw()
        })
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();





function togglePause() {
    isPaused = !isPaused;
    menuPause.toggleDisplay();
    if (isPaused) {
        cancelAnimationFrame(gameLoop);
    } else {
        gameLoop();
    }
}



document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        togglePause()
        menuPause.isSpacePressed = !menuPause.isSpacePressed
    }

    if (menuPause.isSpacePressed) {
        if (event.key === 'ArrowLeft') {
            paddle.moveLeft();
        } else if (event.key === 'ArrowRight') {
            paddle.moveRight();
        }
    }

});



function loselife() {
    lives--
    scoreboard.updateLives()
    if (lives <= 0) {
        alert("Game Over!")
        menuPause.restartGame()
        clearInterval(timerInterval)
    }
}

function initGame() {
    scoreboard.startTimer();
}

initGame()  