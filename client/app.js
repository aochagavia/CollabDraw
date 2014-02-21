var app = function() {
	var socket = io.connect();

	var that = {
		// Methods
		login: function(username) {
			socket.emit('send:name', { 'username': username });

		},

		sendMessage: function(msg) {
			socket.emit('send:message', { message: msg });
		},

		sendLine: function(line) {
			socket.emit('send:line', { 'line': line });
		},

		on: function(eventName, callback) {
			socket.on(eventName, callback);
		}
	};

	return that;
}();