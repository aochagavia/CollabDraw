var app = function() {
	var socket = io.connect();

	var that = {
		login: function(username) {
			socket.emit('send:name', { 'username': username });
            $('#login').hide();
            $('#application').slideDown();
		},

        logout: function() {
            $('#application').hide();
            $('#login').slideDown();
        },

		sendMessage: function(msg) {
            if (msg != '')
			    socket.emit('send:message', { message: msg });
		},

		sendLine: function(line) {
			socket.emit('send:line', { 'line': line });
		},

        clearLines: function() {
            socket.emit('delete:lines');
        },

		on: function(eventName, callback) {
			socket.on(eventName, callback);
		}
	};

	return that;
}();