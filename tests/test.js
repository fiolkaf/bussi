define(['node_modules/unexpected/unexpected'], function(expect) {
    describe('karma tests with expect', function() {
        it('should expose expect method', function() {
            expect('foo', 'not to equal', 'bar');
        });
    });
});
