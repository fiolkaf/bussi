[![Build Status](https://travis-ci.org/fiolkaf/bussi.svg?branch=master)](https://travis-ci.org/fiolkaf/bussi)

# Bussi.js

### Javascript In-process Message Bus

## Overview

Bussi.js is a simple message bus written in Javascript.

## Usage

Publisher:
```javascript
var channel = MessageBus.channel('flower');
channel.publish('topic/subTopic', {
  waterMe: true
});
```

Subscriber:
```javascript
var channel = MessageBus.channel('flower');
var unsubscribe = channel.subscribe('topic/subTopic', function(envelope) {
    var payload = envelope.payload;
    assert(payload.waterMe, 'is true');
});

// Stop subscription
unsubscribe();
```

## Features

##### One time subscription:

```javascript
// No need to unsubscribe
channel.subscribe('topic/subTopic', callback, { once: true });
```

##### Wildcard characters:
```javascript
// matches level0/[all topics]/level2
channel.subscribe('level0/*/level2', callback);

// matches all subscriptions in level0 hierarchy, for example:
// level0/level1
// level0/level1.1
// level0/level1/level2, etc.
channel.subscribe('level0/#', callback);
```

## How to use ?

Install bussi.js CommonJS module into your project node_modules:
```
$ npm install bussi
```
and use it:

```javascript
var MessageBus = require('bussi');

MessageBus.channel('data').subscribe(...);
```
