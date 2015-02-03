var Channel = require('./channel');
var _channels = {};

var MessageBus = {
    /**
     * Returns MessageBus channel specified by the name.
     *
     * @param  {String} name The name of a channel to publish/subscribe.
     *                       It returns a handle to the default channel if not specified.
     * @return {Object}      Logical channel for messaging system.
     */
    channel: function(name) {
        var channelName = name || ''; // Default channel
        var channel = _channels[channelName];
        channel = channel || new Channel(channelName);
        _channels[channelName] = channel;
        return channel;
    }
};

module.exports = MessageBus;
