var MessageBus = require('../src/messagebus');
var expect = require('unexpected/unexpected');

describe('MessageBus', function() {
    it('should return default channel', function() {
        var channel = MessageBus.channel();
        expect(channel, 'to be defined');
    });
    it('should be able to return channel with name', function() {
        var channel = MessageBus.channel('sayMyName');
        expect(channel, 'to be defined');
    });
    it('should return the same channel for equal names', function() {
        var flowerChannel = MessageBus.channel('flower');
        var theSameFlowerChannel = MessageBus.channel('flower');
        expect(flowerChannel, 'to be', theSameFlowerChannel);
    });
    it('should return different channels for different names', function() {
        var flowerChannel = MessageBus.channel('flower');
        var fishChannel = MessageBus.channel('fish');
        expect(flowerChannel, 'not to be', fishChannel);
    });
});
