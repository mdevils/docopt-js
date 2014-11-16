var Parser = require('../../lib/parser');
var Token = require('../../lib/token');

describe('Parser', function () {
    describe('next()', function () {
        describe('Usage and Options sections', function () {
            it('should return TEXT for one-line text', function () {
                var parser = new Parser('Hello World');
                var token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('Hello World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should return TEXT tokens for multiline text', function () {
                var parser = new Parser('Hello\nWorld');
                var token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('Hello');
                token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should return USAGE when applicable', function () {
                var parser = new Parser('Usage:\nWorld');
                var token = parser.next();
                token.type.should.equal(Token.USAGE);
                token.value.should.equal('Usage:');
                token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should return USAGE for lower case', function () {
                var parser = new Parser('usage:');
                var token = parser.next();
                token.type.should.equal(Token.USAGE);
                token.value.should.equal('usage:');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should return OPTIONS when applicable', function () {
                var parser = new Parser('Options:\nWorld');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should return OPTIONS for lower case', function () {
                var parser = new Parser('options:');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('options:');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should return USAGE and OPTIONS when applicable', function () {
                var parser = new Parser('Usage:\nHello\nOptions:\nWorld');
                var token = parser.next();
                token.type.should.equal(Token.USAGE);
                token.value.should.equal('Usage:');
                token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('Hello');
                token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });
        });

        describe('Options', function () {
            it('should process option text in options section', function () {
                var parser = new Parser('Options:\n  World');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should stop on outside text in options section', function () {
                var parser = new Parser('Options:\nWorld');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.TEXT);
                token.value.should.equal('World');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should process option name in options section', function () {
                var parser = new Parser('Options:\n  -X');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-X');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should process all option names in options section', function () {
                var parser = new Parser('Options:\n  --extract, -X');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('--extract');
                token = parser.next();
                token.type.should.equal(Token.OPTION_SEPARATOR);
                token.value.should.equal(',');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-X');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should process option info for a single option name', function () {
                var parser = new Parser('Options:\n  -X hello');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-X');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('hello');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should process multiline option info for a single option name', function () {
                var parser = new Parser('Options:\n  -X hello\n     world');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-X');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('hello');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('world');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should process option info for a multiple option name', function () {
                var parser = new Parser('Options:\n  --extract, -X - extracts data');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('--extract');
                token = parser.next();
                token.type.should.equal(Token.OPTION_SEPARATOR);
                token.value.should.equal(',');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-X');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('- extracts data');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });

            it('should process multiple options', function () {
                var parser = new Parser('Options:\n --extract, -X - extracts data\n --delete, -d - delete');
                var token = parser.next();
                token.type.should.equal(Token.OPTIONS);
                token.value.should.equal('Options:');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('--extract');
                token = parser.next();
                token.type.should.equal(Token.OPTION_SEPARATOR);
                token.value.should.equal(',');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-X');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('- extracts data');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('--delete');
                token = parser.next();
                token.type.should.equal(Token.OPTION_SEPARATOR);
                token.value.should.equal(',');
                token = parser.next();
                token.type.should.equal(Token.OPTION_NAME);
                token.value.should.equal('-d');
                token = parser.next();
                token.type.should.equal(Token.OPTION_TEXT);
                token.value.should.equal('- delete');
                token = parser.next();
                token.type.should.equal(Token.EOF);
            });
        });
    });
});
