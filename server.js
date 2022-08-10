(function () {

	const debug = true;
	const http = require('http');
	const express = require('express');
	const server = http.createServer();
	server.listen(8111);
	const io = require('socket.io').listen(server);

	const app = express();
	app.get('/', function (req, res) {
		if (req.query.action) {
			const socks = events['pong'];
			if (socks) {
				socks.forEach(function (item) {
					sendMessage(item, {
						event: 'pong',
						data: {
							action: req.query.action
						}
					});
				});
			}
		}
		res.send('Нужно передавать параметр "action". Значения:<br>' +
			'<a href="http://localhost:8112/?action=change_mode">change_mode</a><br>' +
			'<a href="http://localhost:8112/?action=start">start</a><br>' +
			'<a href="http://localhost:8112/?action=score_left">score_left</a><br>' +
			'<a href="http://localhost:8112/?action=score_right">score_right</a><br>' +
			'<a href="http://localhost:8112/?action=unscore_left">unscore_left</a><br>' +
			'<a href="http://localhost:8112/?action=unscore_right">unscore_right</a><br>' +
			'<a href="http://localhost:8112/?action=confirm">confirm</a><br>' +
			'<a href="http://localhost:8112/?action=dismiss">dismiss</a><br>');
	});
	app.listen(8112);

	console.log('io listening on 8111');
	console.log('http listening on 8112');


// Массив со всеми подключениями
	let connections = [];
	let events = {};

	const sendMessage = function (sockKey, d, toConsole) {
		if (debug) {
			console.log('begin sendMessage');
		}
		if (typeof d.event === 'object') {
			d.event = d.event[0];
		}
		if (debug) {
			console.log(d.event);
		}
		const ev = toConsole ? 'console' : 'message';
		if (debug) {
			console.log('begin emitting ' + (toConsole ? 'to console' : 'message'));
		}
		io.to(sockKey).emit(ev, d);
		if (debug) {
			console.log('sendMessage complete');
		}
	};

// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
	io.sockets.on('connection', function (socket) {

		// Добавление нового соединения в массив
		connections.push(socket);
		const sockKey = connections.length - 1;

		if (debug) {
			console.log("new connection");
			console.log(sockKey);
			console.log('total ' + (connections.length));
		}

		// Функция, которая срабатывает при отключении от сервера
		socket.on('disconnect', function (sockKey) {
			// Удаления пользователя из массива
			connections.splice(sockKey, 1);
			if (debug) {
				console.log('disconnected ' + sockKey);
				console.log('total ' + (connections.length));
			}
		}.bind(this, sockKey));


		socket.on('send_message', function (d) {
			if (debug) {
				console.log(d);
			}

			if (typeof d.event === 'string') {
				d.event = [d.event];
			}

			if (debug) {
				console.log(d);
			}

			d.event.forEach(function (event) {
				// отправка сообщения пользователю
				const socks = events[event];
				if (socks) {
					socks.forEach(function (item) {
						sendMessage(item, d);
					});
				}
			});

		});

		// Функция получающая сообщение
		socket.on('attach_event', function (d) {
			if (!d)
				return;

			if (typeof d === 'string') {
				try {
					d = JSON.parse(d);
				} catch (e) {
					return;
				}
			}

			if (debug) {
				console.log(d.event);
			}

			if (!d || !d.event)
				return;

			if (!events[d.event])
				events[d.event] = [];
			events[d.event].push(this.id);
			d.status = 'attached';
			sendMessage(this.id, d, true);
		});

		socket.on('reattach_event', function (d) {
			if (!d || !d.event)
				return;
			if (!events[d.event])
				events[d.event] = [];
			events[d.event].push(this.id);
			d.status = 'reattached';
			sendMessage(this.id, d, true);
		});

		socket.on('detach_event', function (d) {
			if (!d || !d.event || !events[d.event])
				return;
			delete events[d.event];
			d.status = 'detached';
			sendMessage(this.id, d, true);
		});

	});

})();