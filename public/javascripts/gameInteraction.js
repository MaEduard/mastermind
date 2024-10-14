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
  var secretCodePicker = ".secretcode-p1";
  var tilePickerp2 = ".tile-p2";
  var colorPicked = "blue";
  var secretCode = new Array();
  var rowsNR = 7;
  var rowNumber = 1;

  $(secretCodePicker).on("click", function (event) {
    if (!$(event.target).hasClass("changed")) {
      $(event.target).css("background-color", colors[colorPicked]);
      $(event.target).addClass("changed");
      secretCode.push(colorPicked);
    }
    else {
      window.alert("You cannot change the secret code!");
    }

    if (secretCode.length == 4) {
      $(secretCodePicker).css("background-color", "white");
    }
  });

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
    else if (secretCode.length == 0) {
      window.alert("Player 1 first has to add a secret color code!");
    }
    else if ($(event.target).hasClass("active")) {
      // Otherwise, change the background color and add the "changed" class
      $(event.target).css("background-color", colors[colorPicked]);
      $(event.target).addClass("changed");

      // Check how many divs have the "changed" class
      let changedTiles = $('.tile-p2.changed').toArray();
            
      // If 4 or more tiles have the "changed" class, print a message
      if (changedTiles.length % 4 == 0) {
        let secretCodeTemp = structuredClone(secretCode);
        let correct = 0;
        $(tilePickerp2).removeClass("active");
        $(".changed").css("opacity", 1);
        let allTilesPickerp1Active = $(".tile-p1.active").toArray();

        for (let i = 0; i < allTilesPickerp1Active.length; i++) {
          var backgroundColor = colors[$(changedTiles[i]).css("background-color")];
          if (backgroundColor == secretCodeTemp[i]) {
            $(allTilesPickerp1Active[i]).css("background-color", "red");
            const index = secretCodeTemp.indexOf(backgroundColor);
            secretCodeTemp[index] = "noColor";
            correct++;
          }
          else if (secretCodeTemp.includes(backgroundColor)) {
            const index = secretCodeTemp.indexOf(backgroundColor);
            secretCodeTemp[index] = "noColor";
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
        
        if (correct == 4) {
          window.alert("p1 has cracked the code!");
        }
        for (let i = 0; i < newActivesp1.length; i++) {
          $(newActivesp2[i]).addClass("active");
          $(newActivesp1[i]).addClass("active");
        }
      }
    }
    return false;  // Prevent default behavior
  });
};

$(document).ready(main);