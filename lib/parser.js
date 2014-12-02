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
        var fragment = line.substr(this._col);
        var trimmedFragment = fragment.replace(/^\s+/, '');
        if (trimmedFragment === '') {
            this._line++;
            this._col = 0;
            return this.next();
        }
        var trimOffset = fragment.length - trimmedFragment.length;
        var trimmedFirstChar = trimmedFragment.charAt(0);
        if (
            this._state === STATE.TEXT ||
            this._state === STATE.USAGE_SECTION ||
            this._state === STATE.OPTIONS_SECTION
        ) {
            if (trimmedFragment.toLowerCase().indexOf(USAGE_STR) === 0) {
                token = new Token(Token.USAGE, trimmedFragment.substr(0, USAGE_STR.length));
                this._col += USAGE_STR.length;
                this._state = STATE.USAGE_SECTION;
            } else if (trimmedFragment.toLowerCase().indexOf(OPTIONS_STR) === 0) {
                token = new Token(Token.OPTIONS, trimmedFragment.substr(0, OPTIONS_STR.length));
                this._col += OPTIONS_STR.length;
                this._state = STATE.OPTIONS_SECTION;
            } else if (this._col === 0 && !line.match(/^\s/)) {
                this._state = STATE.TEXT;
                token = new Token(Token.TEXT, line);
                this._line++;
                this._col = 0;
            } else if (this._state === STATE.OPTIONS_SECTION) {
                var nc = trimmedFragment.charAt(1);
                if (trimmedFirstChar === '-' && nc && nc !== ' ' && nc !== '\t') {
                    token = new Token(Token.OPTION_NAME, this._parseOption(trimOffset));
                } else if (trimmedFirstChar === ',') {
                    token = new Token(Token.OPTION_SEPARATOR, ',');
                    this._col += trimOffset + 1;
                } else {
                    token = new Token(Token.OPTION_TEXT, trimmedFragment);
                    this._line++;
                    this._col = 0;
                }
            } else if (this._state === STATE.USAGE_SECTION) {
                if (isAlphaNumDashUnderscore(trimmedFirstChar)) {
                    var pos = 0;
                    var identifier = trimmedFragment.charAt(pos);
                    pos++;
                    while (isAlphaNumDashUnderscore(trimmedFragment.charAt(pos))) {
                        identifier += trimmedFragment.charAt(pos);
                        pos++;
                    }
                    this._col += trimOffset + pos;
                    token = new Token(Token.USAGE_IDENTIFIER, identifier);
                }
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

/**
 * @param {Number} offset
 * @returns {String}
 */
Parser.prototype._parseOption = function (offset) {
    var line = this._lines[this._line];
    var pos = this._col + offset;
    var result = '';
    while (isAlphaNumDashUnderscore(line.charAt(pos))) {
        result += line.charAt(pos);
        pos++;
    }
    this._col = pos;
    return result;
};

Parser.prototype.getCurrent = function () {
    return this._token;
};

/**
 * @param {String} c
 * @returns {Boolean}
 */
function isAlphaNumDashUnderscore(c) {
    var cc = c.charCodeAt(0);
    return c === '-' || c === '_' ||
        (cc >= 97 && cc <= 122) || // a..z
        (cc >= 65 && cc <= 90) ||  // A..Z
        (cc >= 48 && cc <= 57);    // 0..9
}

// Тесть для USAGE_IDENTIFIER
// https://github.com/docopt/docopt

module.exports = Parser;
