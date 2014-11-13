var Token = require('./token');

var STATE = {
    TEXT: 0,
    USAGE_SECTION: 1,
    USAGE_PATTERN: 2,
    OPTIONS_SECTION: 3,
    OPTION_INFO: 4
};

var USAGE_STR = 'usage:';
var OPTIONS_STR = 'options:';

function Parser(doc) {
    this._doc = doc;
    this._lines = doc.split('\n');
    this._line = 0;
    this._col = 0;
    this._state = STATE.TEXT;
    this._token = null;

}

Parser.prototype.next = function () {
    var token = null;
    while (this._line < this._lines.length - 1 && this._col >= this._lines[this._line].length) {
        this._line++;
        this._col = 0;
    }
    if (
        this._line >= this._lines.length ||
        (this._line === this._lines.length - 1 && this._col === this._lines[this._line].length)
    ) {
        token = new Token(Token.EOF);
    } else {
        var line = this._lines[this._line];
        var trimmedPiece = line.substr(this._col).trim();
        if (
            this._state === STATE.TEXT ||
            this._state === STATE.USAGE_SECTION ||
            this._state === STATE.OPTIONS_SECTION
        ) {
            if (trimmedPiece.toLowerCase().indexOf(USAGE_STR) === 0) {
                token = new Token(Token.USAGE, trimmedPiece.substr(0, USAGE_STR.length));
                this._col += USAGE_STR.length;
                this._state = STATE.USAGE_SECTION;
            } else if (trimmedPiece.toLowerCase().indexOf(OPTIONS_STR) === 0) {
                token = new Token(Token.OPTIONS, trimmedPiece.substr(0, OPTIONS_STR.length));
                this._col += OPTIONS_STR.length;
                this._state = STATE.OPTIONS_SECTION;
            } else if (this._state === STATE.TEXT || !line.match(/^\s+/)) {
                token = new Token(Token.TEXT, line.substring(this._col, line.length));
                this._line++;
                this._col = 0;
            }
        }
    }
    this._token = token;
    return token;
};

Parser.prototype.getCurrent = function () {
    return this._token;
};

// Набросать краткий README
// https://github.com/docopt/docopt

module.exports = Parser;
