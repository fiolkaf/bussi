define(function(require) {
    'use strict';

    var Subscriptions = require('./subscriptions');

    var Channel = function() {
        this._subscriptions = new Subscriptions();
    };

    /**
     * Publish a message on the MessageBus channel.
     *
     * @param  {String} topic   Message topic. Subscribers receive all messages published to the topic.
     * @param  {Object} payload Payload data to be send.
     */
    Channel.prototype.publish = function publish(topic, payload) {
        var subscriptions = this._subscriptions.get(topic);
        subscriptions.forEach(function(callback) {
            callback({
                timestamp: Date.now(),
                topic: topic,
                payload: payload
            });
        });
    };

    /** Subscribe to all topic messages on the MessageBus channel.
     *
     * @param  {String} topic           Message topic. All messages on the channel will be filtered by the topic.
     * @param  {Function} callback      Callback method to receive a message.
     * @param  {Object} configuration   Subscription configuration parameters.
     * @return {Function}               Unsubscribe method - stops subscription.
     */
    Channel.prototype.subscribe = function subscribe(topic, callback, configuration) {
        var subscriptions = this._subscriptions;
        configuration = configuration || {};
        var receiver = !configuration.once ? callback : function() {
            callback();
            subscriptions.remove(topic, receiver);
        };

        subscriptions.add(topic, receiver);

        return function() {
            subscriptions.remove(topic, receiver);
        };
    };

    return Channel;
});
