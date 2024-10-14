/* Code shared between client and server: game setup. */
(function (exports) {
    exports.WEB_SOCKET_URL = "ws://localhost:3000"; /* WebSocket URL */
    exports.MAX_ALLOWED_GUESSES = 8;
})(typeof exports === "undefined" ? (this.Setup = {}) : exports);