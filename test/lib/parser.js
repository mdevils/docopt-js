var Parser = require('../../lib/parser');
var Token = require('../../lib/token');

describe('Parser', function () {
    describe('next()', function () {
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
});
