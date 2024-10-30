/**
 * game object, for every 2-player session there is a game object that keeps track the game state
 * and every game object is identified by the gameID. 
 * @param {Float32Array} gameID 
 */
var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.codeToGuess = null; //first player to join the game, can set the word
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

/*
 * The game can be in a number of different states as indicated by its attributes.
 */
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["ROW GUESSED"] = 3;
game.prototype.transitionStates["A"] = 4; //A won
game.prototype.transitionStates["B"] = 5; //B won
game.prototype.transitionStates["ABORTED"] = 6;

/*
 * Not all game states can be transformed into each other;
 * the matrix contains the valid transitions.
 * They are checked each time a state change is attempted.
 */
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0], //0 JOINT
    [1, 0, 1, 0, 0, 0, 0], //1 JOINT
    [0, 0, 0, 1, 0, 0, 1], //2 JOINT (note: once we have two players, there is no way back!)
    [0, 0, 0, 1, 1, 1, 1], //ROW GUESSED
    [0, 0, 0, 0, 0, 0, 0], //A WON
    [0, 0, 0, 0, 0, 0, 0], //B WON
    [0, 0, 0, 0, 0, 0, 0] //ABORTED
];

/**
 * Checks whether change in game state from `from` to `to` is valid or not.
 * @param {String} from 
 * @param {String} to 
 * @returns {Boolean}
 */
game.prototype.isValidTransition = function (from, to) {
    console.assert(
        typeof from == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof from
    );
    console.assert(
        typeof to == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof to
    );
    console.assert(
        from in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        from
    );
    console.assert(
        to in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        to
    );

    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] > 0;
};

/**
 * Checks whether game state exists
 * @param {String} s 
 * @returns 
 */
game.prototype.isValidState = function (s) {
    return s in game.prototype.transitionStates;
};

/**
 * Sets game state
 * @param {String} w 
 * @returns 
 */
game.prototype.setStatus = function (w) {
    console.assert(
        typeof w == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof w
    );

    if (
        game.prototype.isValidState(w) &&
        game.prototype.isValidTransition(this.gameState, w)
    ) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    } else {
        return new Error(
            "Impossible status change from %s to %s",
            this.gameState,
            w
        );
    }
};

/**
 * Sets the color code to be guessed by player B
 * @param {String} w 
 * @returns 
 */
game.prototype.setColorCode = function (w) {
    //two possible options for the current game state:
    //1 JOINT, 2 JOINT
    if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
        return new Error(
            "Trying to set color code, but game status is %s",
            this.gameState
        );
    }
    this.codeToGuess = w;
};

/**
 * Returns color code to be guessed by player B.
 * @returns {String} this.codeToGuess
 */
game.prototype.getColorCode = function () {
    return this.codeToGuess;
};

/**
 * Check if two players joint this game session
 * @returns {Boolean}
 */
game.prototype.hasTwoConnectedPlayers = function () {
    return this.gameState == "2 JOINT";
};

/**
 * Adds player to game if allowed according to trainsition states matrix.
 * @param {Object} p 
 * @returns 
 */
game.prototype.addPlayer = function (p) {
    console.assert(
        p instanceof Object,
        "%s: Expecting an object (WebSocket), got a %s",
        arguments.callee.name,
        typeof p
    );

    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error(
            "Invalid call to addPlayer, current state is %s",
            this.gameState
        );
    }

    /*
     * revise the game state
     */

    var error = this.setStatus("1 JOINT");
    if (error instanceof Error) {
        this.setStatus("2 JOINT");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    } else {
        this.playerB = p;
        return "B";
    }
};

module.exports = game; // export as module to be used in other scripts.
