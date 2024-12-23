class Paddle {
    constructor(x, y, speed, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.element = document.createElement('div');
        this.element.className = 'paddle';
        this.element.style.width = '100px';
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
        this.x = (container.offsetWidth - this.element.offsetWidth) / 2;
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
    constructor(x, y, speed, color) {
        this.x = x; 
        this.y = y; 
        this.dx = speed;
        this.dy = -speed; 
        this.radius = 7.5;
        this.color = color; 
        this.element = document.createElement('div');
        this.element.className = 'ball';
        this.element.style.width = `${this.radius * 2}px`; 
        this.element.style.height = `${this.radius * 2}px`; 
        this.element.style.backgroundColor = color; 
        this.element.style.borderRadius = '50%'; 
        this.element.style.position = 'absolute'; 
        this.move(); 
        document.getElementById('border-container').appendChild(this.element);
    }

    move() {
        this.x += this.dx; 
        this.y += this.dy; 
        this.element.style.left = `${this.x}px`; 
        this.element.style.bottom = `${this.y}px`; 
    }

    bounceHorizontal(){
        this.dx = -this.dx;
    }
    bouceVertical(){
        this.dy = -this.dy;
    }

    check(container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        if (this.x < 0 || this.x > containerWidth - this.radius *2) {
            this.bounceHorizontal()
        }
        if (this.y < 0 || this.y > containerHeight - this.radius *2) {
            this.bouceVertical()
        }
        // if (this.y < 0 ) {
        //     const errorMessage = document.createElement('div');
        //     errorMessage.innerText = "Erreur : La balle a dépassé le bord supérieur !";
        //     errorMessage.style.color = 'red';
        //     errorMessage.style.position = 'absolute';
        //     errorMessage.style.top = '10px';
        //     errorMessage.style.left = '10px';
        //     document.body.appendChild(errorMessage);
        //     this.y = 0;
        //     this.speedY = -this.speedY;
        // }
        const paddle = document.querySelector('.paddle');
        if (this.y <= 20 && this.x + this.radius * 2 > paddle.offsetLeft && this.x < paddle.offsetLeft + paddle.offsetWidth) {
            this.bouceVertical()
        }

    }
}
const paddle = new Paddle(0, 0, 15, "white");
const ball = new Ball(paddle.x + paddle.element.offsetWidth / 2 - 7.5, paddle.element.offsetTop - 15,2, "red");

function gameLoop() {
    ball.move(); 
    ball.check(document.getElementById('border-container')); 

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