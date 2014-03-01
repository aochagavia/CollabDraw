var http = require('http');
var express = require('express');
var socketIO = require('socket.io');

var app = express();
app.configure(function() {
    app.use(express.static(__dirname + '/client'));
});

// Listen for static files (html)
var server = http.createServer(app);
server.listen(process.env.PORT || 80);

// Listen for incoming socket connections
var io = socketIO.listen(server);

// Events for the different user actions
var lines = [];
io.sockets.on('connection', function(socket) {
	var userData = { username: 'Unknown' };
	socket.emit('receive:lines', { 'lines': lines });

	socket.on('send:name', function(data) {
		userData.username = data.username;
        socket.emit('receive:message', { author: 'Server', content: 'You have logged in with username "' + data.username + '"'});
		socket.broadcast.emit('receive:message', { author: 'Server', content: data.username + ' has logged in'});
	});

    socket.on('send:message', function(data) {
        io.sockets.emit('receive:message', { author: userData.username, content: data.message });
    });

    socket.on('send:line', function(data) {
    	socket.broadcast.emit('receive:line', data);
    	lines.push(data.line);
    });

    socket.on('delete:lines', function() {
    	lines = [];
    	io.sockets.emit('deleted:lines');
    });

    socket.on('disconnect', function(data) {
        socket.broadcast.emit('receive:message', { author: 'Server', content: userData.username + ' has logged out' });
    });
});