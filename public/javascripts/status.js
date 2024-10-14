var Status = {
    gameWon: "Congratulations! You won! ",
    gameLost: "Game over. You lost! ",
    playAgain: "&nbsp;<a href='/play'>Play again!</a>",
    player1Intro: "Player 1. Choose a secret color code on the right",
    prompt: "Code to guess",
    promptAgainLength: "Try again!",
    promptChars: "Try again!",
    player2Intro: `Player 2. You win if you can guess the code within ${Setup.MAX_ALLOWED_GUESSES} tries.`,
    player2IntroNoTargetYet: `Player 2. Waiting for code to guess. You win if you can guess it within ${Setup.MAX_ALLOWED_GUESSES} tries.`,
    guessed: "Player 2 guessed code ",
    aborted: "Your gaming partner is no longer available, game aborted. <a href='/play'>Play again!</a>"
}