/**
 * Object containing all status messages.
 */
const Status = {
    gameWon: "Congratulations! You won! ",
    gameLost: "Game over. You lost! ",
    player1Intro: "Player 1. Use colors to pick a code by clicking on the tiles above!!",
    chosen: "Your chosen code: ",
    wait: "Player 2 is trying to guess your code. Wait till the game is finished.",
    player2Intro: `Player 2. You win if you can guess the code within ${Setup.MAX_ALLOWED_GUESSES} tries.`,
    player2IntroNoTargetYet: `Player 2. Waiting for code to guess. You win if you can guess it within ${Setup.MAX_ALLOWED_GUESSES} tries.`,
    guessed: "Player 2 guessed code",
    aborted: "Your gaming partner is no longer available, game aborted. <a href='/play'>Play again!</a>"
  };

/*
 * Object representing the status bar.
 */  
function StatusBar(){
  this.setStatus = function(status){
      document.getElementById("statusbar").innerHTML = status;
  };
}