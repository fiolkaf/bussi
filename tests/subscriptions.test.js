define(['src/subscriptions', 'unexpected'], function(Subscriptions, expect) {

    describe('Subscriptions', function() {
        describe('add', function() {
            it('can add a single subscription to subscription list', function() {
                var subscriptions = new Subscriptions();
                subscriptions.add('add/incident/1', function() {});
            });

            it('can add multiple subscriptions to subscription list', function() {
                var subscriptions = new Subscriptions();
                subscriptions.add('add/incident/1', function() {});
                subscriptions.add('add/incident/1', function() {});
            });
        });

        describe('remove', function() {
            it('can remove subscription from one item subscription list', function() {
                var subscriptions = new Subscriptions();
                var callback = function() {};
                subscriptions.add('add/incident/1', callback);
                subscriptions.remove('add/incident/1', callback);
                var result = subscriptions.get('add/incident/1');

                expect(result.length, 'to equal', 0);
            });

            it('can remove subscription from multiple items subscription list', function() {
                var subscriptions = new Subscriptions();
                var callback = function() {};
                subscriptions.add('add/incident/1', callback);
                subscriptions.add('add/incident/1', function() {});
                subscriptions.remove('add/incident/1', callback);
                var result = subscriptions.get('add/incident/1');

                expect(result.length, 'to equal', 1);
            });
        });

        describe('get', function() {
            it('can get a single subscription from subscription list', function() {
                var subscriptions = new Subscriptions();
                var callback = function() {};
                subscriptions.add('add/incident/1', callback);
                var result = subscriptions.get('add/incident/1');

                expect(callback, 'to be', result[0]);
            });

            it('can get multiple subscriptions from subscription list', function() {
                var subscriptions = new Subscriptions();
                var first_callback = function() {};
                subscriptions.add('add/incident/1', first_callback);

                var second_callback = function() {};
                subscriptions.add('add/incident/1', second_callback);
                var result = subscriptions.get('add/incident/1');

                expect(result.length, 'to equal', 2);
            });

            it('preserves subscription order', function() {
                var subscriptions = new Subscriptions();
                var first_callback = function() {};
                subscriptions.add('add/incident/1', first_callback);

                var second_callback = function() {};
                subscriptions.add('add/incident/1', second_callback);

                var result = subscriptions.get('add/incident/1');
                expect(result[0], 'to equal', first_callback);
                expect(result[1], 'to equal', second_callback);
            });

            it('supports subscriptions on different topic hierarchy', function() {
                var subscriptions = new Subscriptions();
                var first_callback = function() {};
                subscriptions.add('add/incident/1', first_callback);

                var second_callback = function() {};
                subscriptions.add('add/incident', second_callback);

                var result = subscriptions.get('add/incident/1');
                expect(result[0], 'to equal', first_callback);

                result = subscriptions.get('add/incident');
                expect(result[0], 'to equal', second_callback);
            });

            it('returns empty array if no subscriptions found', function() {
                var subscriptions = new Subscriptions();
                var result = subscriptions.get('add/incident');
                expect(result, 'to equal', []);
            });

        });

        describe('get.wildcard.*', function() {
            it('supports wild * character at the end of a topic', function() {
                var subscriptions = new Subscriptions();
                var callback = function() {};
                subscriptions.add('add/incident/*', callback);

                var result = subscriptions.get('add/incident/1');
                expect(result.length, 'to equal', 1);
            });

            it('supports wild * character in the middle of a topic', function() {
                var subscriptions = new Subscriptions();
                var first_callback = function() {};
                subscriptions.add('add/*/1', first_callback);
                var second_callback = function() {};
                subscriptions.add('add/*/1', second_callback);
                subscriptions.add('add/*/2', function() {});

                var result = subscriptions.get('add/incident/1');
                expect(result.length, 'to equal', 2);
            });
        });

        describe('get.wildcard.#', function() {
            it('will get all subscriptions for wildcard # character', function() {
                var subscriptions = new Subscriptions();
                var callback = function() {};
                subscriptions.add('#', callback);

                var result = subscriptions.get('add/incident/1');
                expect(result.length, 'to equal', 1);
            });
        });
    });
});
