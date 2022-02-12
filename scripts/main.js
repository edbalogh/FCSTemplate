class LetterBox {
  letter;
  color = "grey";
  locked = false;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// grab the canvas object created in index.html
const canvas = document.getElementById("gameCanvas");

// pull a reference to the 2d context from that canvas
const ctx = canvas.getContext("2d");

// set the canvas width and height
canvas.width = 600;
canvas.height = 400;

/* INITIALIZE VARIABLES */
let lastTime;
let gameOver = false;
const numberOfLetters = 5;
const numberOfGuesses = 6;
const boxWidth = 50;
const boxHeight = 50;
const padding = 4;

let guesses = [];
let answer = "FAITH";
let letterBoxes = [];
let letterToDelete;

// start animation/game loop
requestAnimationFrame(gameLoop);

for (let x = 0; x < numberOfLetters; x++) {
  for (let y = 0; y < numberOfGuesses; y++) {
    const newLetterBox = new LetterBox(x, y);
    letterBoxes.push(newLetterBox)
  }
}

function gameLoop(timestamp) {
  // get the amount of time that has passed since last update
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;  

  /* UPDATE OBJECTS */
  if (gameOver) {
    ctx.font = "30px Arial bold"
    ctx.fillStyle = "#333"
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2)
  } else {
    /* START DRAWING NEXT FRAME */
    // clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    letterBoxes.forEach(l => {
      ctx.fillStyle = l.color;
      ctx.fillRect(l.x * (boxWidth + padding), l.y * (boxHeight + padding), boxWidth, boxHeight);
      ctx.fillStyle = "black";
      ctx.font = "40px Arial"
      ctx.textAlign="center";
      ctx.textBaseline = "middle";
      if(l.letter) ctx.fillText(l.letter.toUpperCase(), l.x * (boxWidth + padding) + 20, l.y * (boxHeight + padding) + 25);
    });
  }
 
  // next frame in loop
  requestAnimationFrame(gameLoop);
}

function addLetter(letter) {
  // add new letter to appropriate
  for (let y = 0; y < numberOfGuesses; y++) {
    for (let x = 0; x < numberOfLetters; x++) {
      const box = letterBoxes.find(l => l.x === x && l.y === y);
      if (!box.letter) {
        box.letter = letter.toUpperCase();
        console.log(`storing letter ${letter} at box ${x}.${y}`);
        return;
      }
    }
  }
}

function removeLastLetter() {
  // find the last letterBox that is not locked due to submitted guess
  // TODO: should sort these to ensure proper order, but trusting javascript for now
  const lastLetter = letterBoxes.filter(l => l.letter && !l.locked).at(-1);
  console.log(lastLetter);
  if (lastLetter) lastLetter.letter = undefined;
}

function submitGuess() {
  if (guesses.length < 6) {
    console.log(`submitting guess for row ${guesses.length + 1}`);
    const currentRow = letterBoxes.filter(l => l.y === guesses.length )
    let word = "";
   
    currentRow.forEach(r => {
      word += r.letter;
      if (r.letter === answer[r.x]) {
        r.color = 'green';
      } else if (answer.includes(r.letter)) {
        r.color = 'yellow';
      }
      r.locked = true;
    });

    // store guess in array
    guesses.push(word);
    
  }
}


// adding event listeners
document.addEventListener('keypress', (event) => {
  console.log(JSON.stringify(event.key));
  // make sure only letters are inserted
  if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
    addLetter(event.key.toUpperCase());
  } else if (event.key.toUpperCase() === 'DELETE' || event.key.toUpperCase() === 'BACKSPACE') {
    removeLastLetter();
  }
});

document.addEventListener('keydown', (event) => {
  // alert(`you pressed keyCode ${event.keyCode}`);
  // console.log(JSON.stringify(event.keyCode));
});

document.addEventListener('keyup', (event) => {
  // all movement on any key up
  // TODO: add logic for backspace, delete, and enter
  
  // console.log(JSON.stringify(event.keyCode));
  switch (event.keyCode) {
    case 13: submitGuess(); break;
    case 8:
    case 46: removeLastLetter(); break;
  }
});

