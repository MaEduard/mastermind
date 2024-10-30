const COLORS = {
  "red": "rgb(255, 0, 0)",
  "green": "rgb(60, 179, 113)",
  "orange": "rgb(255, 165, 0)",
  "blue": "rgb(0, 0, 255)",
  "pink": "rgb(238, 130, 238)",
  "purple": "rgb(106, 90, 205)",
  "rgb(255, 0, 0)": "red",
  "rgb(60, 179, 113)": "green",
  "rgb(255, 165, 0)": "orange",
  "rgb(0, 0, 255)": "blue",
  "rgb(238, 130, 238)": "pink",
  "rgb(106, 90, 205)": "purple"
};

const TILES_CODE_PA = ".secretcode-p1";
const TILES_PA = ".tile-p1";
const TILES_PB = ".tile-p2";

/* constructor of game state */
function GameState() {
  this.playerType = null;
  this.targetCode = new Array(4);
  this.haveWon = false;
  this.colorPicked = "blue";
  this.rowNumber = 1;
  this.rowsNR = 7;
};

/**
 * Get playertype attribute, either 'A' or 'B'
 * @returns {String} playerType attribute
 */
GameState.prototype.getPlayerType = function () {
  return this.playerType;
};

/**
 * Set playerType attribute, either 'A' or 'B'
 * @param {String} p 
 */
GameState.prototype.setPlayerType = function (p) {
  console.assert(p == 'B' || p == 'A');
  this.playerType = p;
};

GameState.prototype.getColorPicked = function () {
  return this.colorPicked;
};

/**
 * set targetCode to guess
 * @param {String} w 
 */
GameState.prototype.setTargetCode = function (code) {
  this.targetCode = code;
};

/**
 * get targetCode value
 * @returns targetCode attribute
 */
GameState.prototype.getTargetCode = function () {
  return this.targetCode;
};

GameState.prototype.pASetCode = async function (codeLength) {
  return new Promise((resolve, reject) => {
    let counter = 0;

    // Define the callback separately
    const handleClick = (event) => {
      if (!event.target.classList.contains("changed")) {
        event.target.style.backgroundColor = COLORS[this.colorPicked];
        event.target.classList.add("changed");
        this.targetCode[Number(event.target.id)] = this.colorPicked;
        counter++;
      }

      if (counter === codeLength) {
        // Resolve the promise and remove event listeners once the code is complete
        document.querySelectorAll(TILES_CODE_PA).forEach(tile => {
          tile.removeEventListener("click", handleClick);
          tile.style.backgroundColor = "black";
        });
        resolve(this.targetCode);
      }
    };

    // Remove any existing listeners before adding new ones
    document.querySelectorAll(TILES_CODE_PA).forEach(tile => {
      tile.removeEventListener("click", handleClick);  // Ensures no previous listeners remain
      tile.addEventListener("click", handleClick);
    });
  });
};


GameState.prototype.pBMakeGuess = async function (codeLength) {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let tempGuess = new Array(codeLength);

    const callBack = (event) => {
      if (!event.target.classList.contains("changed") && event.target.classList.contains("active")) {
        event.target.style.backgroundColor = COLORS[this.colorPicked];
        event.target.classList.add("changed");
        event.target.style.opacity = 1;
        tempGuess[Number(event.target.id)] = this.colorPicked;
        counter++;
        console.log(counter);

      }
      if (counter == codeLength) {
        document.querySelectorAll(TILES_PB).forEach(tile => {
          tile.removeEventListener("click", callBack);
        });
        resolve(tempGuess);
      }
    };

    // Remove any existing listeners before adding new ones
    document.querySelectorAll(TILES_PB).forEach(tile => {
      tile.removeEventListener("click", callBack);  // Ensures no previous listeners remain
      tile.addEventListener("click", callBack);
    });
  });
};

GameState.prototype.enableColorPicker = function () {
  document.querySelectorAll("tr.color-picker div").forEach(picker => {
    picker.addEventListener("click", (event) => {
      var color = event.target.id;

      // Remove "active" class from all color pickers
      document.querySelectorAll("tr.color-picker div").forEach(p => p.classList.remove("active"));

      // Add "active" class to the clicked color
      document.getElementById(color).classList.add("active");

      // Set the selected color
      this.colorPicked = color;

      event.preventDefault();  // Equivalent to 'return false;' in jQuery
    });
  });
};

GameState.prototype.disableColorPicker = function () {
  document.querySelectorAll("tr.color-picker div").forEach(picker => {
    picker.addEventListener("click", (event) => {
      // Remove "active" class from all color pickers
      document.querySelectorAll("tr.color-picker div").forEach(p => p.classList.remove("active"));
      event.preventDefault();  // Equivalent to 'return false;' in jQuery
    });
  });
};

GameState.prototype.turnOffEverything = function () {
  const allElements = document.querySelectorAll('div');
  // Remove the active class from each element
  allElements.forEach(element => {
    element.id = "inactive";
  });
}

GameState.prototype.pAdisableCode = function () {
  if (this.targetCode.length == 4) {
    $(secretCodePicker).css("background-color", "white");
  }
};

GameState.prototype.checkGuess = function (guess) {
  // 0: not in code
  // 1: in code but wrong place
  // 2: correct place
  let result = new Array(4);
  let taken = new Array(4).fill(false);
  let leftover = this.targetCode.slice();

  // first provide feedback for all the tiles that are correctly positioned and have the right color.
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] == this.targetCode[i]) {
      result[i] = 2;
      taken[i] = true;
      idx = leftover.indexOf(guess[i]);
      leftover.splice(idx, 1);
    }
  }

  // check for items that are the right color but in the wrong position
  for (let i = 0; i < guess.length; i++) {
    if (taken[i] == false && leftover.includes(guess[i])) {
      result[i] = 1;
      taken[i] = true;
      idx = leftover.indexOf(guess[i]);
      leftover.splice(idx, 1);
    }
  }

  // fill all left overs
  for (let i = 0; i < guess.length; i++) {
    if (result[i] == null) {
      result[i] = 0;
    }
  }

  return result;
};

GameState.prototype.colorIndicativeTiles = function (guess) {
  let tiles = Array.from(document.getElementsByClassName("tile-p1 active"));
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] == 0) {
      tiles[i].style.backgroundColor = "black";
    }
    else if (guess[i] == 1) {
      tiles[i].style.backgroundColor = "white";
    }
    else {
      tiles[i].style.backgroundColor = "red";
    }
  }
};

GameState.prototype.displayGuess = function (guess) {
  let tiles = Array.from(document.getElementsByClassName("tile-p2 active"));
  for (let i = 0; i < guess.length; i++) {
    tiles[i].style.backgroundColor = COLORS[guess[i]];
  }
};

GameState.prototype.updateActiveTiles = function () {
  allTilesPickerp1 = Array.from(document.getElementsByClassName("tile-p1"));
  allTilesPickerp1.forEach(tile => tile.classList.remove("active"));
  allTilesPickerp2 = Array.from(document.getElementsByClassName("tile-p2"));
  allTilesPickerp2.forEach(tile => tile.classList.remove("active"));


  var newActivesp2 = allTilesPickerp2.slice(4 * (this.rowsNR - 1), allTilesPickerp2.length - 4 * this.rowNumber);
  var newActivesp1 = allTilesPickerp1.slice(4 * (this.rowsNR - 1), allTilesPickerp1.length - 4 * this.rowNumber);

  this.rowNumber++;
  this.rowsNR--;

  for (let i = 0; i < newActivesp1.length; i++) {
    newActivesp2[i].classList.add("active");
    newActivesp1[i].classList.add("active");
  }
};

//main (IIFE so immediately executed), setting up everything including the WebSocket
(function setup() {

  var socket = new WebSocket(Setup.WEB_SOCKET_URL);

  var gs = new GameState(socket);

  var statusbar = new StatusBar();


  socket.onmessage = async function (event) {
    console.log(event);
    let incomingMsg = JSON.parse(event.data);

    //set player type
    if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
      gs.setPlayerType(incomingMsg.data); //should be "A" or "B"
    }
    else if (incomingMsg.type == Messages.T_GAME_ABORTED) {
      statusbar.setStatus(Status["aborted"]);
      gs.turnOffEverything();
    }
    else if (incomingMsg.type == Messages.T_TARGET_WORD) {
      gs.setTargetCode(incomingMsg.data);
    }
    else if (incomingMsg.type == Messages.T_MAKE_A_GUESS) {
      console.log("received!");
      let guess = incomingMsg.data;
      correct = gs.checkGuess(guess);
      gs.colorIndicativeTiles(correct);
      gs.displayGuess(guess);
      gs.updateActiveTiles();
    }
    else if (incomingMsg.type == Messages.T_GAME_WON_BY) {
      gs.turnOffEverything();
      if (incomingMsg.data == 'A') {
        statusbar.setStatus(Status["gameWon"]);
      }
      else {
        statusbar.setStatus(Status["gameLost"]);
      }
    }

    if (gs.getPlayerType() == 'A') {
      if (!gs.getTargetCode().every((element) => element == null)) {
        statusbar.setStatus(Status["wait"]);
      } else {
        statusbar.setStatus(Status["player1Intro"]);
        gs.enableColorPicker();
        const targetCode = await gs.pASetCode(4);
        let notifyBCode = Messages.O_TARGET_WORD;
        notifyBCode.data = targetCode;
        socket.send(JSON.stringify(notifyBCode));
        gs.disableColorPicker();
        statusbar.setStatus(Status["chosen"] + targetCode);
      }
    }
    else {

      var guesses = 0;
      var gameWon = false;

      if (gs.getTargetCode().every(element => element == null)) {
        statusbar.setStatus(Status["player2IntroNoTargetYet"]);
      }
      else {
        statusbar.setStatus(Status["player2Intro"]);
        gs.enableColorPicker();
        while (guesses < Setup.MAX_ALLOWED_GUESSES && !gameWon) {
          let guess = await gs.pBMakeGuess(4);
          let correct = gs.checkGuess(guess);

          if (correct.every((currentValue) => currentValue == 2)) {
            gameWon = true;
          }

          gs.colorIndicativeTiles(correct);
          gs.updateActiveTiles();
          guesses++;

          // update player A on the guesses made
          let update = Messages.O_MAKE_A_GUESS;
          update.data = guess;
          console.log("sending a message");
          socket.send(JSON.stringify(update));
        }

        // update player A on who won
        let winner = Messages.O_GAME_WON_BY;
        if (gameWon) {
          //notify player A that B has won
          // display congrats message on sb
          //disable all the buttons
          winner.data = 'B';
          statusbar.setStatus(Status["gameWon"]);
        }
        else {
          //notify player A that he or she has won
          // display game over message on sb
          // disable all buttons
          winner.data = 'A';
          statusbar.setStatus(Status["gameLost"]);
        }
        socket.send(JSON.stringify(winner));
        gs.turnOffEverything();
      }
    }
  }
})(); //execute immediately