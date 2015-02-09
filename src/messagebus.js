var Channel = require('./channel');

var _channels = {};

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

var MessageBus = {

    /**
     * Returns MessageBus channel specified by the name.
     *
     * @param  {String} name The name of a channel to publish/subscribe.
     *                       It returns a handle to the default channel if not specified.
     * @return {Object}      Logical channel for messaging system.
     */
    channel: function(name) {
        var senderId = guid();
        var channelName = name || ''; // Default channel
        var channel = _channels[channelName];
        channel = channel || new Channel(channelName);
        _channels[channelName] = channel;

        return {
            publish: function(topic, payload) {
                return channel.publish(senderId, topic, payload);
            },
            subscribe: function(topic, callback, configuration) {
                var receive = function(envelope) {
                    if (envelope.senderId !== senderId) {
                        callback(envelope);
                    }
                };
                return channel.subscribe(topic, receive, configuration);
            }
        };
    }
};

module.exports = MessageBus;
