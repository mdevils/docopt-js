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

Token.EOF = 'end-of-file';
Token.TEXT = 'text';
Token.OPTIONS = 'options-section';
Token.OPTION_NAME = 'option-name';
Token.OPTION_SEPARATOR = 'option-separator';
Token.OPTION_TEXT = 'option-text';
Token.USAGE = 'usage-section';
Token.USAGE_IDENTIFIER = 'usage-identifier';

module.exports = Token;
