/**
 * Start the nodejs server with the following command:
 * SUBSCRIBE_KEY=<value> node app.js
 */

var util = require('util');
var gpio = require('pi-gpio');

/****************************************
 ** Subscription to pubnub. *
 ****************************************/

var pubnub = require('pubnub')({
    ssl: true,  // <- enable TLS Tunneling over TCP
    subscribe_key: process.env.SUBSCRIBE_KEY || 'ID'
});

/***************
 ** Callbacks. *
 ***************/

pubnub.subscribe({
    channel  : "door",
    connect  : function() {
        console.log("Ready To Receive Messages");
    },
    message: function(message){
      open();
    },
    disconnect  : function() {
        console.log("Disconnected");
    },
    reconnect: function(){
      console.log("Reconnected")
    },
    error: function (error) {
      // Handle error here
      console.log(JSON.stringify(error));
    }
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
