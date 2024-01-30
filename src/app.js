document.addEventListener("DOMContentLoaded", () => {

// Defining the constant and let variables

const grid = document.querySelector('.grid');
const result = document.querySelector('.results');
const startButton = document.querySelector('.start')
const width = 15;
const aliensRemoved = [];
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;

// Creating the squares

for (let i = 0; i < width * width; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
};

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

// Function to draw the Invaders 

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  };
};

draw();

squares[currentShooterIndex].classList.add('shooter');

// Function to remove the Invaders

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  };
};

// Function to move the Shooter

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch (e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
      break;
    case 'ArrowRight':
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
      break;
  }
  squares[currentShooterIndex].classList.add('shooter');
};

// Declaring the shooter movement

document.addEventListener('keydown', moveShooter);

// Function to move the alien invaders 

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  // What happens if it hits the right edge of the board

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      isGoingRight = false;
    };
  };

  // What happens if it hits the left edge of the board

  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1
      direction = 1
      isGoingRight = true;
    };
  };

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  };

  draw();

  // What happens when an alien hits the shooter

  if (squares[currentShooterIndex].classList.contains('invader')) {
    result.innerHTML = 'GAME OVER!';
    clearInterval(invadersId);
    document.removeEventListener('keydown', shoot);
    document.removeEventListener('keydown', moveShooter);
  };

  // Game Won condition

  if (aliensRemoved.length === alienInvaders.length) {
    result.innerHTML = 'YOU WON!';
    clearInterval(invadersId);
    document.removeEventListener('keydown', shoot);
    document.removeEventListener('keydown', moveShooter);
  };
};

// Interval in which the aliens move 

// invadersId = setInterval(moveInvaders, 600);

// Function for shooting!!

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser');
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('explosion');

      setTimeout(() => squares[currentLaserIndex].classList.remove('explosion'), 450);
      clearInterval(laserId);

      // Tracking the Score 

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++
      result.innerHTML = "Score: " + results
    };
  };

  if (e.key === 'ArrowUp') {
    laserId = setInterval(moveLaser, 100)
  };
};

// Declaring the shooting key

document.addEventListener('keydown', shoot);

// Making a Start Game button 

startButton.addEventListener('click', () => {
  if (!invadersId) {
    invadersId = setInterval(moveInvaders, 600);
    document.removeEventListener('keydown', moveFrog)
  } 
})

});