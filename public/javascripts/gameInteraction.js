
function Tile(c, gt, click, id) {
  this.color = c;
  this.gametile = gt;
  this.clickable = click;
  this.id = id;


  this.getColor = function () {
    return this.color;
  },

    this.setColor = function (c) {
      this.color = c;
    },

    this.isGameTile = function () {
      return this.gametile;
    },

    this.isClickable = function () {
      return this.clickable;
    },

    this.getPosition = function () {
      return this.id;
    }
};

function gameBoard() {
  this.myGameBoard = new Array(32);
  this.currentRow = 0;
  this.currentColorPicked = "blue";
  this.sideTiles = new Array(32);

  this.initialize = function () {
    for (var i = 0; i < 32; i++) {
      if (i < 4) {
        this.myGameBoard[i] = new Tile("beige", true, true, i)
      }
      else {
        this.myGameBoard[i] = new Tile("beige", true, false, i)
      }
    }
  };


  this.getMyGameBoard = function () {
    return this.myGameBoard;
  }
};


// Main part of the code (calls and interacts with objects)
function main() {
  var colors = {
    "red": "rgb(255, 0, 0)",
    "green": "rgb(60, 179, 113)",
    "yellow": "rgb(255, 165, 0)",
    "blue": "rgb(0, 0, 255)",
    "pink": "rgb(238, 130, 238)",
    "purple": "rgb(106, 90, 205)",
    "rgb(255, 0, 0)": "red",
    "rgb(60, 179, 113)": "green",
    "rgb(255, 165, 0)": "yellow",
    "rgb(0, 0, 255)": "blue",
    "rgb(238, 130, 238)": "pink",
    "rgb(106, 90, 205)": "purple"
  };

  var colorPickerDOM = "tr.color-picker div";
  var allTilesPickerp2 = $(".tile-p2").toArray();
  var allTilesPickerp1 = $(".tile-p1").toArray();
  var tilePickerp2 = ".tile-p2";
  var colorPicked = "blue";
  var secretCode = "blue-red-green-yellow";
  var rowsNR = 7;
  var rowNumber = 1;

  $(colorPickerDOM).on("click", function (event) {
    var color = event.target.id;
    $(colorPickerDOM).removeClass("active");
    $('#' + color).addClass("active");
    colorPicked = color;
    return false;
  });

  $(tilePickerp2).on("click", function (event) {
    // Check if the clicked tile already has the "changed" class or there are no more rows to change
    if ($(event.target).hasClass("changed")) {
      return false;
    }
    else if ($(event.target).hasClass("active")) {
      // Otherwise, change the background color and add the "changed" class
      $(event.target).css("background-color", colors[colorPicked]);
      $(event.target).addClass("changed");

      // Check how many divs have the "changed" class
      const changedTiles = $('.changed');

      // If 4 or more tiles have the "changed" class, print a message
      if (changedTiles.length % 4 == 0) {
        $(tilePickerp2).removeClass("active");
        $(".changed").css("opacity", 1);
        secretCodeArray = secretCode.split('-');
        let allTilesPickerp1Active = $(".tile-p1.active").toArray();
        console.log(allTilesPickerp1Active);

        for (let i = 0; i < 4; i++) {
          var backgroundColor = $(changedTiles[i]).css("background-color");
          if (backgroundColor == colors[secretCodeArray[i]]) {
            $(allTilesPickerp1Active[i]).css("background-color", "red");
            const index = secretCodeArray.indexOf(colors[backgroundColor]);
            secretCodeArray[index] = "noColor";
          }
          else if (secretCodeArray.includes(colors[backgroundColor])) {
            const index = secretCodeArray.indexOf(colors[backgroundColor]);
            secretCodeArray[index] = "noColor";
            $(allTilesPickerp1Active[i]).css("background-color", "white");
          }
          else {
            console.log("tile not in code");
          }
        }

        $(".tile-p1.active").removeClass("active");

        var newActivesp2 = allTilesPickerp2.slice(4 * (rowsNR - 1), allTilesPickerp2.length - 4 * rowNumber);
        var newActivesp1 = allTilesPickerp1.slice(4 * (rowsNR - 1), allTilesPickerp1.length - 4 * rowNumber);

        rowNumber++;
        rowsNR--;

        for (let i = 0; i < newActivesp1.length; i++) {
          $(newActivesp2[i]).addClass("active");
          $(newActivesp1[i]).addClass("active");
        }
        return false;
      }
    }

    return false;  // Prevent default behavior
  });



};

$(document).ready(main);