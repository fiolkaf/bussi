console.log('loaded');
var unexpected = require('unexpected');
var expect = weknowhow.expect;
describe('karma tests with expect', function() {
    it('should expose expect method', function() {
        expect('foo', 'not to equal', 'bar');
    });
});
