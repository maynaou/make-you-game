class Paddle {
    constructor(x, y, speed, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.element = document.createElement('div');
        this.element.className = 'paddle';
        this.element.style.width = '110px';
        this.element.style.height = '20px';
        this.element.style.backgroundColor = color;
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
        document.getElementById('border-container').appendChild(this.element);
        this.center();
    }

    center() {
        const container = document.getElementById('border-container');
        this.x = (container.clientWidth - this.element.clientWidth) / 2;
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
        this.dx = speed;
        this.dy = speed;
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


    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
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
            this.bounceHorizontal()
        }
        if (this.y > containerHeight - this.radius * 2) {
            this.bouceVertical()
        }
        const paddle = document.querySelector('.paddle');
        if (this.y <= this.radius * 2 && this.x > paddle.offsetLeft && this.x < paddle.offsetLeft + paddle.offsetWidth) {
            this.bouceVertical()
        }

        if (this.y < 0) {
            this.loselife()
            this.resetPosition()
        }
    }
    resetPosition() {
        paddle.center()
        this.x = paddle.x + paddle.element.offsetWidth / 2 - 10;
        this.y = paddle.element.offsetHeight + 2, 5;
    }
}
const paddle = new Paddle(0, 0, 15, "white");
const ball = new Ball(paddle.x + (paddle.element.offsetWidth / 2) - 10, paddle.element.offsetHeight + 2.5, 2, "red", loselife);

const brickMatrix = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
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
        bricks.push(this)
    }

    draw() {
        this.element.style.display = this.visible ? 'block' : 'none';
    }

    checkCollision(ball) {
        if (this.visible) {
            if (ball.x - ball.radius * 2 > this.x && ball.x < this.x + this.width &&
                ball.y - ball.radius * 2 > this.y && ball.y < this.y + this.height) {
                this.visible = false; 
                ball.bouceVertical();
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
                new Brick(x,y,brickWidth,brickHeight,brickColor)
            }
        }
    }
}

createBricksFromMatrix(brickMatrix);

function gameLoop() {
    ball.move();
    ball.check(document.getElementById('border-container'));
    
    bricks.forEach(brick => {
        brick.checkCollision(ball)
        brick.draw()
    })
    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
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
        return
    }
}