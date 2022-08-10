(function () {
	SOCKET_OBJ = io('http://localhost:8111', {transports: ['websocket', 'polling']});
	let event = 'pong';
	SOCKET_OBJ.emit('attach_event', {
		event: event
	});
	SOCKET_OBJ.on('console', function (data) {
		console.log(data);
	});
	SOCKET_OBJ.on('message', function (d) {
		console.log(d);
		if (!window.CPingPongTEST && d.data) {
			switch (d.data.action) {
				case "change_mode" : {
					CPingPongOBJ.changeMode();
					break;
				}
				case "start" : {
					CPingPongOBJ.start();
					break;
				}
				case "score_left" : {
					CPingPongOBJ.scoreLeft();
					break;
				}
				case "score_right" : {
					CPingPongOBJ.scoreRight();
					break;
				}
				case "unscore_left" : {
					CPingPongOBJ.unscoreLeft();
					break;
				}
				case "unscore_right" : {
					CPingPongOBJ.unscoreRight();
					break;
				}
				case "confirm" : {
					CPingPongOBJ.onConfirm();
					break;
				}
				case "dismiss" : {
					CPingPongOBJ.onDismiss();
					break;
				}
			}
		}
	});
	SOCKET_OBJ.on('reconnect', function (d) {
		SOCKET_OBJ.emit('reattach_event', {
			event: event
		});
	});
})()