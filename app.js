var faye = require('faye');
var util = require('util');

/** URL of the OpenIt backend. */
var URL = 'http://localhost:3000/faye';

/** The device ID. */
var DEVICE_ID = 'ID'; 

/** The channel to listen. */
var CHANNEL = '/control/' + DEVICE_ID;

/** The device key. */
var KEY = 'KEY';

/****************************************
 ** Subscription to the OpenIt backend. *
 ****************************************/
 
var client = new faye.Client(URL, {
    retry: 5,
    timeout: 120
});

var clientAuth = {
  outgoing: function(message, callback) {
    // Again, leave non-subscribe messages alone
    if (message.channel !== '/meta/subscribe')
      return callback(message);

    // Add ext field if it's not present
    if (!message.ext) message.ext = {};

    // Set the auth token
    message.ext.authToken = KEY;

    // Carry on and send the message to the server
    callback(message);
  }
};

client.addExtension(clientAuth);

/***************
 ** Callbacks. *
 ***************/
 
var subscription = client.subscribe(CHANNEL, function(message) {
  console.log("[NEW MESSAGE]: " + util.inspect(message));
});

subscription.callback(function() {
  console.log('[SUBSCRIBE SUCCEEDED]');
});

subscription.errback(function(error) {
  console.log('[SUBSCRIBE FAILED]', error);
});
