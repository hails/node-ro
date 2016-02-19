var net = require('net');

const numberOfRequests = 10000;

var clients = [];

for(var i = 0; i < numberOfRequests; i++) {
	clients.push(
		net.connect({ port: 6900 }, function( _client ) {
			console.log("Connected to login-server");
		})
	);
};

for(var i = 0; i < clients.length; i++) {
	var buf = new Buffer(55);
	buf.fill(0);

	//packet type/id
	buf.writeUInt16BE(0x51);

	clients[i].write(buf);

	clients[i].on('data', function(data) {
		console.log("LoginResponse:: ", data.toString());
	});
}