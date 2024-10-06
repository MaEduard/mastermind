var Tile = function (c, gt, click, id) {
    /* private members */
    var color = c;
    var gametile = gt;
    var clickable = click;
    var id = id;

    return {
        getColor : function () {
            return color;
        },

        setColor : function(c) { 
            color = c;
        },

        isGameTile : function () {
            return gametile;
        },

        isClickable : function () {
            return clickable;
        },

        getPosition : function () {
            return id;
        }
    }
};

