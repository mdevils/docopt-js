var Token = require('./token');

var STATE = {
    TEXT: 0,
    USAGE_SECTION: 1,
    USAGE_PATTERN: 2,
    OPTION_INFO: 3
};

var USAGE_STR = 'usage:';

function Parser(doc) {
    this._doc = doc;
    this._lines = doc.split('\n');
    this._line = 0;
    this._col = 0;
    this._state = STATE.TEXT;
    this._token = null;

}

Parser.prototype.next = function () {
    var line = this._lines[this._line];
    var token = null;
    if (this._line >= this._lines.length) {
        token = new Token(Token.EOF);
    } else {
        var trimmedPiece = line.substr(this._col).trim();
        if (this._state === STATE.TEXT) {
            if (trimmedPiece.toLowerCase().indexOf(USAGE_STR) === 0) {
                token = new Token(Token.USAGE, trimmedPiece.substr(0, USAGE_STR.length));
                this._col += USAGE_STR.length;
            } else {
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

// Использовать класс Token.
// Написать тест на Usage/Text.
// https://github.com/docopt/docopt

module.exports = Parser;
