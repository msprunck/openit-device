/**
 * Start the nodejs server with the following command:
 * OPENIT_DEVICE_ID=<value> OPENIT_KEY=<value> node app.js
 */

var faye = require('faye');
var util = require('util');
var gpio = require("pi-gpio");

/** URL of the OpenIt backend. */
var URL = 'http://openit.appspot.fr/faye';

/** The device ID. */
var DEVICE_ID = process.env.OPENIT_DEVICE_ID || 'ID'; 

/** The channel to listen. */
var CHANNEL = '/control/' + DEVICE_ID;

/** The device key. */
var KEY = process.env.OPENIT_KEY || 'KEY';

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

    console.log('Subscription (KEY:' + KEY) + ')';

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
  open();
});

subscription.callback(function() {
  console.log('[SUBSCRIBE SUCCEEDED]');
});

subscription.errback(function(error) {
  console.log('[SUBSCRIBE FAILED]', error);
});

/**
 * Open the door connected to the Raspberry Pi.
 */
var open = function(){
  gpio.open(11, "output", function(err) {  // Open pin 17 for output
    gpio.write(11, 1, function() {         // Set pin 17 high (1)
        setTimeout(function(){openRespond()}, 1000);
    });
  });
};

/**
 * To release the door switch after 1 second.
 */
var openRespond = function() {
  gpio.write(11, 0, function() {            // Set pin 17 high (1)
        gpio.close(11);                     // Close pin 17
  });
}