var Channel = require('../src/channel');
var expect = require('unexpected/unexpected');

describe('Channel', function() {
    describe('publish', function() {
        it('should be able to publish to a channel', function() {
            var channel = new Channel();
            channel.publish('id', 'topic', {
                test: 'ok'
            });
        });
    });
    describe('subscribe', function() {
        it('should be able to subscribe to a channel', function() {
            var channel = new Channel();
            channel.subscribe('topic', function() {});
        });
        it('should callback subscriber when publishing a message', function() {
            var channel = new Channel();
            var spy = sinon.spy();
            channel.subscribe('topic', spy);
            channel.publish('id', 'topic', {
                test: 'ok'
            });
            expect(spy.callCount, 'to equal', 1);
        });
        it('should callback multiple subscribers when publishing a message', function() {
            var channel = new Channel();
            var spy = sinon.spy();
            channel.subscribe('topic', spy);
            channel.subscribe('topic', spy);
            channel.publish('id', 'topic', {
                test: 'ok'
            });
            expect(spy.callCount, 'to equal', 2);
        });
        it('should not callback subscriber if topic does not match', function() {
            var channel = new Channel();
            var spy = sinon.spy();
            channel.subscribe('topic.diff', spy);
            channel.publish('id', 'topic', {
                test: 'ok'
            });
            expect(spy.callCount, 'to equal', 0);
        });
        it('should receive a payload', function() {
            var channel = new Channel();
            var subscribedEnvelope;
            var callback = function(envelope) {
                subscribedEnvelope = envelope;
            };
            channel.subscribe('topic', callback);
            channel.publish('id', 'topic', {
                test: 'ok'
            });
            expect(subscribedEnvelope.payload.test, 'to equal', 'ok');
        });
        it('should receive multiple messages published on the bus', function() {
            var channel = new Channel();
            var spy = sinon.spy();
            channel.subscribe('topic', spy);
            channel.publish('id', 'topic', {
                test: 'call me first'
            });
            channel.publish('id', 'topic', {
                test: 'call me second'
            });
            expect(spy.calledTwice, 'to be true');
        });
    });
    describe('unsubscribe', function() {
        it('does not call subscriber callback after unsubscribe is called', function() {
            var channel = new Channel();
            var callCount = 0;
            var unsubscribe = channel.subscribe('topic', function() {
                callCount++;
            });
            unsubscribe();
            channel.publish('id', 'topic', {
                test: 'ok'
            });
            expect(callCount, 'to equal', 0);
        });

        describe('subscribe configuration', function() {
            it('should support one time subscription', function() {
                var channel = new Channel();
                var callCount = 0;
                var callback = function() {
                    callCount++;
                };
                channel.subscribe('subscribe/me/once', callback, {
                    once: true
                });
                channel.publish('id', 'subscribe/me/once', {});
                channel.publish('id', 'subscribe/me/once', {});
                expect(callCount, 'to equal', 1);
            });
        });
    });
});
