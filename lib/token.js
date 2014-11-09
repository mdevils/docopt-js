/**
 * @name Token
 * @param {Number} type
 * @param {String} value
 */
function Token(type, value) {
    /**
     * @type {Number}
     * @public
     */
    this.type = type;
    /**
     * @type {String}
     * @public
     */
    this.value = value;
}

Token.EOF = 0;
Token.TEXT = 1;
Token.USAGE = 2;

module.exports = Token;
