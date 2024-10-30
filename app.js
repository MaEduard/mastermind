var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");
var gameStatus = require("./statTracker");
var Game = require("./game");
const e = require("express");

var port = process.argv[2];
var app = express();

console.log("Started the server");

app.use(express.static(__dirname + "/public"));

app.get("/", indexRouter);

var server = http.createServer(app)

const wss = new websocket.Server({ server });

var websockets = {}; //property: websocket, value: game --> to keep track of the games

/*
 * regularly clean up the websockets object
 */
setInterval(function () {
    for (let i in websockets) {
        if (Object.prototype.hasOwnProperty.call(websockets, i)) {
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if (gameObj.finalStatus != null) {
                delete websockets[i];
            }
        }
    }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function connection(ws) {
    /*
     * two-player game: every two players are added to the same game
     */
    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    console.log(
        "Player %s placed in game %s as %s",
        con.id,
        currentGame.id,
        playerType
    );

    let informClientPlayerType = "";

    if (playerType == 'A') {
        informClientPlayerType = messages.S_PLAYER_A;
    }
    else {
        informClientPlayerType = messages.S_PLAYER_B;
    }

    /*
     * inform the client about its assigned player type
     */
    con.send(informClientPlayerType);

    if (playerType == 'B' && currentGame.getColorCode() != null) {
        let sendCode = messages.O_TARGET_WORD;
        sendCode.data = currentGame.getColorCode();
        con.send(JSON.stringify(sendCode));
    }

    /*
     * once we have two players, there is no way back; 
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player OP
     *  3. send the message to OP
     */
    con.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);

        let gameObj = websockets[con.id];
        fromPlayerA = true;

        if (gameObj.playerB == con) {
            fromPlayerA = false;
        }

        if (fromPlayerA) {
            /*
            * player A cannot do a lot, just send the target code;
            * if player B is already available, send message to B
            */
            if (oMsg.type == messages.T_TARGET_WORD) {
                gameObj.setColorCode(oMsg.data);

                if (gameObj.hasTwoConnectedPlayers()) {
                    let msg = JSON.parse(message);
                    gameObj.playerB.send(JSON.stringify(msg));
                }
            }
        } else {
            /*
             * player B can make a guess;
             * this guess is forwarded to A
             */
            if (oMsg.type == messages.T_MAKE_A_GUESS) {
                let msg = JSON.parse(message);
                gameObj.playerA.send(JSON.stringify(msg));
                gameObj.setStatus("ROW GUESSED");
            }

            /*
             * player B can state who won/lost
             */
            if (oMsg.type == messages.T_GAME_WON_BY) {
                gameObj.setStatus(oMsg.data);
                let msg = JSON.parse(message);
                gameObj.playerA.send(JSON.stringify(msg));
                console.log("The game has been won by:" + ' ' + oMsg.data);
                //game was won by somebody, update statistics
                gameStatus.gamesCompleted++;
            }
        }
    });

    con.on("close", function () {
        console.log(con.id + " disconnected ...");
        let gameObj = websockets[con.id];

        if (con.id % 2 == 0) {
            if (gameObj.hasTwoConnectedPlayers()) {
                gameObj.playerB.send(messages.S_GAME_ABORTED);
            }
        }
        else {
            gameObj.playerA.send(messages.S_GAME_ABORTED);
        }
    });
});

server.listen(port);


