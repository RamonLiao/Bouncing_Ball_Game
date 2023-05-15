/** Canvas Reference
 * https://www.w3schools.com/tags/ref_canvas.asp
 */

const c = document.getElementById("canvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let paddle_x = 100;
let paddle_y = 500;
let paddle_width = 200;
let paddle_height = 5;
let brickWidth = 50;
let brickHeight = 50;
let brickArray = [];
let count = 0;

// min, max -> get a random integer within a range
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = brickWidth;
    this.height = brickHeight;
    brickArray.push(this);
    this.visible = true; // this measure can lower time complexity during checking touching ball.
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// produce all bricks (possbile to optimise producing algorithm)
function checkOverlap(new_x, new_y) {
  let overLapping = false;
  for (let i = 0; i < brickArray.length; i++) {
    if (
      new_x >= brickArray[i].x - brickWidth &&
      new_x <= brickArray[i].x + brickWidth &&
      new_y >= brickArray[i].y - brickHeight &&
      new_y <= brickArray[i].y + brickHeight
    ) {
      overLapping = true;
      return overLapping;
    } else {
      overLapping = false;
    }
  }
  return overLapping;
}

do {
  new_x = getRandomArbitrary(0, 950);
  new_y = getRandomArbitrary(0, 550);
  let overLapping = checkOverlap(new_x, new_y);
  if (!overLapping) {
    console.log(new_x, new_y);
    new Brick(new_x, new_y);
  }
} while (brickArray.length < 10);

// mouse event
c.addEventListener("mousemove", (e) => {
  paddle_x = e.clientX;
});

function drawCircle() {
  // check ball hitting bricks
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;
      // change velocities of x and y
      // hiting from the bottom || hitting from the top
      if (circle_y >= brick.y + brickHeight || circle_y <= brick.y) {
        ySpeed *= -1;
        // hitting from the left || hitting from the right
      } else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      // remove the brick from brickArray
      // brickArray.splice(index, 1); // Time complexity = O(n)
      // if (brickArray == 0) {
      //   alert("Game Over!");
      //   clearInterval(game);
      // }
      if (count == 10) {
        alert("Game Over!");
        clearInterval(game);
      }
    }
  });

  // check ball hitting the paddle
  if (
    circle_x >= paddle_x - radius &&
    circle_x <= paddle_x + paddle_width + radius &&
    circle_y >= paddle_y - radius &&
    circle_y <= paddle_y + paddle_height + radius
  ) {
    // bouncing effect (deducting number cannot be too small and it should be bigger than radius a lot.)
    if (ySpeed > 0) {
      circle_y -= 50;
    } else {
      circle_y += 50;
    }
    ySpeed *= -1;
  }

  // check ball hiting the border or not
  // checking the right border
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  // checking the left border
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  // checking the top border
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  // checking the bottom border
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }

  // updating the coordination of cirlse
  circle_x += xSpeed;
  circle_y += ySpeed;

  // draw black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // draw all bricks
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // draw a controllable paddle
  ctx.fillStyle = "orange";
  ctx.fillRect(paddle_x, paddle_y, paddle_width, paddle_height);

  // draw a ball
  // x, y -> center of a circle | radius | startAngle = 0 && endAngle = 360˚ -> central angle of a circle
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

let game = setInterval(drawCircle, 25);
