class Paddle {
    constructor(speed, color) {
        this.speed = speed;
        this.color = color;
        this.element = document.createElement('div');
        this.element.className = 'paddle';
        this.element.style.width = '110px';
        this.element.style.height = '20px';
        this.element.style.backgroundColor = color;
        this.element.style.position = 'absolute';
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
    constructor(x, y, speed, color, loselife) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dx = speed;
        this.dy = -speed;
        this.radius = 10;
        this.color = color;
        this.loselife = loselife;
        this.element = document.createElement('div');
        this.element.className = 'ball';
        this.element.style.width = `${this.radius * 2}px`;
        this.element.style.height = `${this.radius * 2}px`;
        this.element.style.backgroundColor = color;
        this.element.style.borderRadius = '50%';
        this.element.style.position = 'absolute';
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
            this.bouceVertical();
        }
    }

    resetPosition() {
        paddle.center();
        this.x = paddle.x + (paddle.element.offsetWidth / 2) - 10;
        this.y = paddle.y - 20;
    }

}

class MenuPause {
    constructor(color) {
        this.color = color;
        this.element = document.createElement('div');
        this.element.id = 'pause-menu';
        this.element.style.display = 'none';
        this.element.style.position = 'absolute';
        this.element.style.top = '50%';
        this.element.style.left = '50%';
        this.element.style.transform = 'translate(-50%, -50%)';  
        this.element.style.background = 'rgba(0, 0, 0, 0.8)';
        this.element.style.color = color;
        this.element.style.padding = '20px';
        this.element.style.borderRadius = '10px';
        this.element.style.textAlign = 'center';
        this.createButtons();
        document.body.appendChild(this.element); 
    }

    createButtons() { 
        const continueButton = document.createElement('button');
        continueButton.innerText = 'Continue';
        continueButton.addEventListener('click', () => this.continueGame());
        this.element.appendChild(continueButton);
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.addEventListener('click', () => this.restartGame());
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

const menuPause = new MenuPause('white');
const paddle = new Paddle(15, "white");
const ball = new Ball(paddle.x + (paddle.element.offsetWidth / 2) - 10, paddle.y - 20, 3, "red", loselife);

const brickMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
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
        this.element.style.position = 'absolute';
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.backgroundColor = color;
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
                ballRight > brickLeft &&
                ballLeft < brickRight &&
                ballBottom > brickTop &&
                ballTop < brickBottom
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
            }
        }
    }
}


const brickWidth = 80.3;
const brickHeight = 60;
const brickColor = 'blue';
const spacing = 5.4;

function createBricksFromMatrix(matrix) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] !== 0) {
                const x = col * (brickWidth + spacing);
                const y = row * (brickHeight + spacing);
                const brick = new Brick(x, y, brickWidth, brickHeight, brickColor)
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
    } else if (event.key === 'ArrowLeft') {
        paddle.moveLeft();
    } else if (event.key === 'ArrowRight') {
        paddle.moveRight();
    }
});

let lives = 3

function loselife() {
    lives--
    if (lives <= 0) {
        alert("Game Over!")
        lives = 3
        return
    }
}