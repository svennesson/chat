var express = require('express'),
	app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var usernames = {};
var addedUsers = false;


io.on('connection', function (socket) {

	socket.on('chat message', function (msg) {
		io.emit('chat message', {
			username: socket.username,
			message: msg.message,
			mColor: msg.color,
			color: socket.color
		});
		socket.broadcast.emit('play sound');
	});

	socket.on('username input', function (data) {
		var tempNum = 0;
		for (var key in usernames) {
			if (data.username === key) {
				socket.emit('login error');
				tempNum++;
			}
		}

		if (tempNum === 0) {
			socket.username = data.username;
			socket.color = data.color;
			usernames[data.username] = data;
			addedUsers = true;

			socket.emit('login sucess');
			io.emit('update list', usernames);
			io.emit('update numOfUsers');
			socket.broadcast.emit('connected', data);
		}

	});

	socket.on('disconnect', function () {

		if (addedUsers) {
			delete usernames[socket.username];
		}

		io.emit('update list', usernames);
		io.emit('update numOfUsers');
		socket.broadcast.emit('disconnected', socket.username);
	});
});

http.listen(8080, function () {
	console.log('listening on *:8080');
});