var http = require('http');
var express = require('express');

var app = express();
app.configure(function() {
    app.use(express.static(__dirname + '/client'));
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(80);

var lines = [];
io.sockets.on('connection', function(socket) {
	socket.data = { username: 'Unknown' };
	socket.emit('receive:lines', { 'lines': lines });

	socket.on('send:name', function(data) {
		socket.data.username = data.username;
		socket.broadcast.emit('receive:message', { author: 'Server', content: data.username + ' has logged in'});
	});

    socket.on('send:message', function(data) {
        io.sockets.emit('receive:message', { author: socket.data.username, content: data.message });
    });

    socket.on('send:line', function(data) {
    	socket.broadcast.emit('receive:line', data);
    	lines.push(data.line);
    	console.log(data.line);
    });

    socket.on('delete:lines', function() {
    	lines = [];
    	socket.broadcast.emit('deleted:lines');
    });

    socket.on('disconnect', function(data) {
        socket.broadcast.emit('receive:message', { author: 'Server', content: socket.data.username + ' has logged out' });
    });
});