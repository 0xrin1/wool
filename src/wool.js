var async = require("async");

var io = require('socket.io')();
io.on('connection', function(client){
	console.log('client ' + client.id + ' connected to server');
	client.emit('connectionInfo', client.id);
});
io.listen(3000);

var ipList = [];
//3000 as test for connecting to itself for now
for(var x = 1; x < 2; x++){
	for(var y = 100; y <= 110; y++){
		ipList.push('http://192.168.'+x+'.'+y+':3000');
	}
}

var socketClient;
async.each(ipList, function(file, callback) {
	// Perform operation on file here.
	console.log('checking ' + file);
	socketClient = require('socket.io-client')(file);
}, function(err) {
	// if any of the file processing produced an error, err would equal that error
	if( err ) {
	// One of the iterations produced an error.
	// All processing will now stop.
		console.log('callback error');
	} else {
		console.log('callback success');
	}
});

socketClient.on('connect_error', onError );
function onError(message){
	console.log('errorr message ' + message);
}
socketClient.on('connect', function(){
	console.log('--------------------------');
	console.log('client connected to server');
});
socketClient.on('connectionInfo', function(data){
	console.log('client has received an event from the server');
	console.log(data);
});
socketClient.on('disconnect', function(){
	console.log('client server connection has disconnected');
});
