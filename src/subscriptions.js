/**
 * Manages a list of subscriptions, ensures subscription indexing and wild character (*) support.
 */
var Subscriptions = function() {
    this._subscriptions = {};
};

/**
 * Add a new subscription to subscription list.
 *
 * @param  {String} topic   Subscription topic, hierarchy separated with slash '/' character, for example /update/incidents/1, /delete/incidents/1 etc.
 *                          Use wildcard character (*) for pattern match, for example /update/incidents/*, or (#) for all hierarchy items match, for example /update/#
 *
 * @param  {Function} callback Subscription callback method.
 */
Subscriptions.prototype.add = function add(topic, callback) {
    var levelTopics = topic.split('/');
    if (levelTopics.indexOf('_subscriptions') >= 0) {
        throw '_subscriptions is a reserved word for topic';
    }
    var levelTopic;
    var level = this._subscriptions;
    while ((levelTopic = levelTopics.shift())) {
        level[levelTopic] = level[levelTopic] || {};
        level = level[levelTopic];
    }
    level._subscriptions = level._subscriptions || [];
    level._subscriptions.push(callback);
};

/**
 * Removes subscription from subscription list.
 *
 * @param  {String} topic      Subscription topic.
 * @param  {Function} callback Subscription callback method.
 */
Subscriptions.prototype.remove = function remove(topic, callback) {
    var levelTopics = topic.split('/');
    var levelTopic;
    var level = this._subscriptions;
    while ((levelTopic = levelTopics.shift())) {
        level = level[levelTopic];
        if (!level) {
            throw 'Cannot find subscription on the subscription list';
        }
    }
    var subscriptions = level._subscriptions;
    var index = subscriptions.indexOf(callback);
    if (index < 0) {
        throw 'Cannot find subscription on the subscription list';
    }
    subscriptions.splice(index, 1);
};

function getLevelSubscriptions(topicParts, levelSubscriptions) {
    var topicPart = topicParts.shift();
    if (!levelSubscriptions) {
        return [];
    }
    if (!topicPart) {
        return levelSubscriptions._subscriptions ? levelSubscriptions._subscriptions : [];
    }
    var result = [];
    if (levelSubscriptions['#']) {
        Array.prototype.push.apply(result, levelSubscriptions['#']._subscriptions);
    }
    if (levelSubscriptions['*']) {
        var wildCardResult = getLevelSubscriptions(topicParts.slice(), levelSubscriptions['*']);
        Array.prototype.push.apply(result, wildCardResult);
    }
    var subLevelSubscriptions = levelSubscriptions[topicPart] || [];
    var exactResult = getLevelSubscriptions(topicParts.slice(), subLevelSubscriptions);
    Array.prototype.push.apply(result, exactResult);
    return result;
}

/**
 * Gets all subscriptions assigned to the topic.
 *
 * @param  {String} topic Subscription topic, hierarchy separated with slash '/' character,
 * @return {Array}        Array of subscription callback methods.
 */
Subscriptions.prototype.get = function get(topic) {
    return getLevelSubscriptions(topic.split('/'), this._subscriptions);
};

module.exports = Subscriptions;
