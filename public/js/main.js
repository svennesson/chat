$(function () {

	var loginPage = $('.login');
	var messagePage = $('.chat');
	var username;
	var messageId = 0;
	var audio = document.querySelector('audio');

	$('.usernameInput').focus();

	var socket = io();

	var setInput = function (input) {
		var value = input.val();
		return value;
	};

	var clearInput = function (input) {
		input.val('');
	};

	var addMessage = function (msg) {
		var inputColor = $('.inputColor').val();
		$('.messages').prepend('<li> <span class="username" id="u' + messageId + '"" style="color: ' + msg.color + '"></span><span id="m' + messageId + '" style="color: ' + msg.mColor + '"></span></li>');
		$('#m' + messageId).text(msg.message);
		$('#u' + messageId).text(msg.username);
		messageId++;
	};

	$('.soundOn').click(function () {
		$('.soundOn').hide();
		$('.soundOff').show();
		audio.muted = true;
	});

	$('.soundOff').click(function () {
		$('.soundOff').hide();
		$('.soundOn').show();
		audio.muted = false;
	});

	$('.wrapper').on('keydown', function () {
		if (username) {
			if (event.which === 13 && $('.inputMessage').val() !== '') {
				var inputval = setInput($('.inputMessage'));
				var mcid = setInput($('.inputColor'));
				socket.emit('chat message', {
					message: inputval,
					color: mcid
				});
				clearInput($('.inputMessage'));
			}
		} else {
			if (event.which === 13 && $('.usernameInput').val() !== '') {
				username = setInput($('.usernameInput'));

				var cid = setInput($('.colorPicker'));
				socket.emit('username input', {
					username: username,
					color: cid,
				});

				clearInput($('.usernameInput'));
			}
		}
	});

	socket.on('login error', function () {
		$('.usernameError').fadeIn();
	});

	socket.on('login sucess', function () {
		$('.login').hide();
		$('.chatArea').show();
		$('.usernameError').hide();
		$('.inputMessage').focus();
	});

	socket.on('connected', function (user) {
		$('.log').append('<li>' + user.username + ' logged in</li>');
	});

	socket.on('chat message', function (msg) {
		addMessage(msg);
	});

	socket.on('update list', function (usernames) {
		$('.users').empty();
		for (var key in usernames) {
			var userColor = usernames[key].color;
			$('.users').append('<li style="color:' + userColor + '">' + key + '</li>');
		}
	});

	socket.on('play sound', function () {
		audio.load();
		audio.play();
	});

	socket.on('update numOfUsers', function () {
		var tempNum = 1;

		$('.users li').each(function (index) {
			tempNum = index + 1;
		});
		$('.numOfUsers').text(tempNum);
	});

	socket.on('disconnected', function (username) {
		$('.log').append('<li>' + username + ' logged out</li>');
	});
});