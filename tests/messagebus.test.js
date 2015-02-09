var MessageBus = require('../src/messagebus');
var expect = require('unexpected/unexpected');

describe('MessageBus', function() {
    describe('channel', function() {
        it('should return default channel', function() {
            var channel = MessageBus.channel();
            expect(channel, 'to be defined');
        });
        it('should be able to return channel with name', function() {
            var channel = MessageBus.channel('sayMyName');
            expect(channel, 'to be defined');
        });
        it('should publish senderId', function() {
            var senderChannel = MessageBus.channel('flower');
            var receiverChannel = MessageBus.channel('flower');

            var spy = sinon.spy();
            var unsubscribe = receiverChannel.subscribe('topic', spy);
            senderChannel.publish('topic', {});

            expect(spy.called, 'to be true');
            expect(spy.getCall(0).args[0].senderId, 'to be defined');
            unsubscribe();
        });
        it('should publish with different senderIds', function() {
            var client1Channel = MessageBus.channel('flower');
            var client2Channel = MessageBus.channel('flower');

            var unsubscribe;
            var spy = sinon.spy();
            client1Channel.subscribe('topic', spy);
            client2Channel.publish('topic', {});

            client2Channel.subscribe('topic', spy);
            client1Channel.publish('topic', {});

            expect(spy.getCall(0).args[0].senderId, 'not to equal', spy.getCall(1).args[0].senderId);
        });
        it('should not receive its own messages', function() {
            var channel = MessageBus.channel('flower');

            var spy = sinon.spy();
            channel.subscribe('topic', spy);
            channel.publish('topic', {});

            expect(spy.called, 'to be false');
        });
        it('should receive other client messages', function() {
            var channelSender = MessageBus.channel('flower');
            var channelReceiver = MessageBus.channel('flower');

            var spy = sinon.spy();
            channelReceiver.subscribe('topic', spy);
            channelSender.publish('topic', {});

            expect(spy.called, 'to be true');
        });
    });
});
