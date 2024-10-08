var main = function () {
    "use strict";
    
    var makeTabActive = function (tabNumber) {

        var tabSelector = ".tabs a:nth-child(" + tabNumber + ") span";
        $(".tabs span").removeClass("active");
        $(".div").removeClass("active");
        $(tabSelector).addClass("active");

        $(".content span").removeClass("active");
        $("button").removeClass("active");

        if (tabNumber == 1) {
            $("button").addClass("active");
        }
        else {
            var contentSelector = ".content span:nth-child(" + tabNumber + ")";
            $(contentSelector).addClass("active");
        }
    }


    $(".tabs a:nth-child(1) span").on("click", function () {
        makeTabActive(1);
        return false;
    })

    $(".tabs a:nth-child(2) span").on("click", function () {
        makeTabActive(2);
        return false;
    })
    $(".tabs a:nth-child(3) span").on("click", function () {
        makeTabActive(3);
        return false;
    })


};

$(document).ready(main);