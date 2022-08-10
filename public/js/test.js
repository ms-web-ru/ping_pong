PongTest = function () {
};


PongTest.prototype.changeMode = function () {
	this.sendToSocket('change_mode');
};

PongTest.prototype.start = function () {
	this.sendToSocket('start');
};

PongTest.prototype.scoreLeft = function () {
	this.sendToSocket('score_left');
};

PongTest.prototype.scoreRight = function () {
	this.sendToSocket('score_right');
};

PongTest.prototype.unscoreLeft = function () {
	this.sendToSocket('unscore_left');
};

PongTest.prototype.unscoreRight = function () {
	this.sendToSocket('unscore_right');
};

PongTest.prototype.confirm = function () {
	this.sendToSocket('confirm');
};

PongTest.prototype.dismiss = function () {
	this.sendToSocket('dismiss');
};

/**
 * @param {string} [action=change_mode|start|score_left|score_right|unscore_left|unscore_right|confirm|dismiss] action
 */
PongTest.prototype.sendToSocket = function (action) {
	SOCKET_OBJ.emit('send_message', {
		event: 'pong',
		data: {
			action: action
		}
	});
};

CPingPongTEST = true;
PongTestOBJ = new PongTest();