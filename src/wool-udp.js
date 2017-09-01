// ---- server-side ----

var PORT = 6024;
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('listening', function () {
	    var address = client.address();
			    console.log('UDP Client listening on ' + address.address + ":" + address.port);
					    client.setBroadcast(true);
});

client.on('message', function (message, rinfo) {
	    console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message);
});

client.bind(PORT);

// ---- client-side ----

var PORT = 6024;
var BROADCAST_ADDR = "192.168.1.255";
var dgram = require('dgram'); 
var server = dgram.createSocket("udp4"); 

server.bind(function() {
		server.setBroadcast(true);
		setInterval(broadcastNew, 3000);
});

function broadcastNew() {
	var message = new Buffer("Broadcast message!");
		server.send(message, 0, message.length, PORT, BROADCAST_ADDR, function() {
		console.log("Sent '" + message + "'");
	});
}
