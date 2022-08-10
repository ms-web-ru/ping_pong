CPingPong = function () {
	this.leftCol = $('#left-col');
	this.rightCol = $('#right-col');
	this.modeCol = $('#mode');

	this.mode = CPingPong.MODE.QUICK;
	this.leftScore = 0;
	this.rightScore = 0;
	this.counter = 0;
	this.gameOver = false;
	this.overScore_ = false;


	this.audioEnabled = false;

	this.audio = {
		0: new Audio('audio/0.ogg'),
		1: new Audio('audio/1.ogg'),
		2: new Audio('audio/2.ogg'),
		3: new Audio('audio/3.ogg'),
		4: new Audio('audio/4.ogg'),
		5: new Audio('audio/5.ogg'),
		6: new Audio('audio/6.ogg'),
		7: new Audio('audio/7.ogg'),
		8: new Audio('audio/8.ogg'),
		9: new Audio('audio/9.ogg'),
		10: new Audio('audio/10.ogg'),
		11: new Audio('audio/11.ogg'),
		12: new Audio('audio/12.ogg'),
		13: new Audio('audio/13.ogg'),
		14: new Audio('audio/14.ogg'),
		15: new Audio('audio/15.ogg'),
		16: new Audio('audio/16.ogg'),
		17: new Audio('audio/17.ogg'),
		18: new Audio('audio/18.ogg'),
		19: new Audio('audio/19.ogg'),
		20: new Audio('audio/20.ogg'),
		30: new Audio('audio/30.ogg'),
		40: new Audio('audio/40.ogg'),
		50: new Audio('audio/50.ogg'),
		60: new Audio('audio/60.ogg'),
		70: new Audio('audio/70.ogg'),
		80: new Audio('audio/80.ogg'),
		90: new Audio('audio/90.ogg'),
		100: new Audio('audio/100.ogg'),
		winLeft: new Audio('audio/win_left.ogg'),
		winRight: new Audio('audio/win_right.ogg')
	};

	for (let i in this.audio) {
		this.audio[i].addEventListener('ended', this.onAudioEnd.bind(this));
	}

	this.audioDeffereds = [];
	this.audioDefferedsIdx = 0;

	this.modeCol.text('Быстрая партия');

	this.confirmCallback = null;
	this.enableAudioBtn = $('#enable_audio');
	this.enableAudioBtn.click(this.onEnableAudioBtnClick.bind(this));

};

CPingPong.MODE = {
	QUICK: 11,
	LONG: 25
};

CPingPong.SUPPLY_COUNT = {
	QUICK: 2,
	LONG: 5
};

CPingPong.prototype.changeMode = function () {
	let mode = this.isQuickMode() ? CPingPong.MODE.LONG : CPingPong.MODE.QUICK;
	if (this.counter >= CPingPong.SUPPLY_COUNT.QUICK) {
		let confirm = function () {
			swal.close();
			this.mode = mode;
			this.updateModeCol();
			this.start();
		}.bind(this);
		this.confirmCallback = confirm;
		swal({
			title: 'Начать игру заново?',
			text: "Текущий счёт больше допустимого для смены режима",
			buttons: {
				y: 'Подтвердить',
				n: 'Отклонить'
			}
		}).then(function (a) {
			if (a === 'y') {
				confirm();
			}
			this.confirmCallback = null;
		}.bind(this));
		return;
	}
	this.mode = mode;
	this.updateModeCol();
};

CPingPong.prototype.updateModeCol = function () {
	let text = this.isQuickMode() ? 'Быстрая партия' : 'Длинная партия';
	this.modeCol.text(text);
};

CPingPong.prototype.start = function () {
	this.leftScore = 0;
	this.rightScore = 0;
	this.counter = 0;
	this.gameOver = false;
	this.overScore_ = false;
	this.leftCol.removeClass('winner');
	this.rightCol.removeClass('winner');
	this.updateModeCol();
	this.updateScore();
};

CPingPong.prototype.scoreLeft = function () {
	if (this.gameOver) {
		return;
	}
	this.leftScore++;
	this.counter++;
	this.updateScore();
};

CPingPong.prototype.scoreRight = function () {
	if (this.gameOver) {
		return;
	}
	this.rightScore++;
	this.counter++;
	this.updateScore();
};

CPingPong.prototype.updateScore = function () {
	this.leftCol.text(this.leftScore);
	this.rightCol.text(this.rightScore);
	let overScore = this.isQuickMode() ? 10 : 24;
	if (this.leftScore === overScore && this.rightScore === overScore) {
		this.overScore_ = true;
	}

	let col;
	if (this.counter === 1) {
		if (this.leftScore) {
			col = this.leftCol;
		}
		else {
			col = this.rightCol;
		}
		col.addClass('pitcher');
	}
	else if (this.counter) {
		this.togglePitcher();
	}
	else {
		this.leftCol.removeClass('pitcher');
		this.rightCol.removeClass('pitcher');
	}

	if (this.overScore_) {
		if (Math.abs(this.leftScore - this.rightScore) === 2) {
			if (Math.max(this.leftScore, this.rightScore) === this.leftScore) {
				this.wining(this.leftCol);
			}
			else {
				this.wining(this.rightCol);
			}
		}
	}
	else {
		let winScore = this.mode;
		if (this.leftScore === winScore) {
			this.wining(this.leftCol);
		}
		else if (this.rightScore === winScore) {
			this.wining(this.rightCol);
		}
	}
	if (!this.gameOver) {
		this.playScore();
	}
	else {
		this.playWinner();
	}
};

CPingPong.prototype.togglePitcher = function (fromUnscore) {
	let divisible = !fromUnscore ? this.counter : this.counter + 1;
	let divider = this.overScore_ ? 1 : this.mode === CPingPong.MODE.QUICK ? CPingPong.SUPPLY_COUNT.QUICK : CPingPong.SUPPLY_COUNT.LONG;

	if (!(divisible % divider)) {
		this.leftCol.toggleClass('pitcher');
		this.rightCol.toggleClass('pitcher');
	}
};

CPingPong.prototype.isQuickMode = function () {
	return this.mode === CPingPong.MODE.QUICK;
};

CPingPong.prototype.unscoreLeft = function () {
	if (this.leftScore) {
		this.leftScore--;
		this.counter--;
		this.togglePitcher(true);
		if (this.gameOver && this.leftCol.hasClass('winner')) {
			this.leftCol.removeClass('winner');
			this.gameOver = false;
		}
		this.updateScore();
	}
};

CPingPong.prototype.unscoreRight = function () {
	if (this.rightScore) {
		this.rightScore--;
		this.counter--;
		this.togglePitcher(true);
		if (this.gameOver && this.rightCol.hasClass('winner')) {
			this.rightCol.removeClass('winner');
			this.gameOver = false;
		}
		this.updateScore();
	}
};

CPingPong.prototype.wining = function (col) {
	this.gameOver = true;
	col.addClass('winner');
	this.modeCol.text('Победитель!');
};

CPingPong.prototype.onConfirm = function () {
	if (typeof this.confirmCallback === 'function') {
		this.confirmCallback();
	}
	this.confirmCallback = null;
};

CPingPong.prototype.onDismiss = function () {
	this.confirmCallback = null;
	swal.close();
};

CPingPong.prototype.onEnableAudioBtnClick = function () {
	this.audioEnabled = !this.audioEnabled;
	this.enableAudioBtn.text(this.audioEnabled ? 'Выключить звуки' : 'Включить звуки');
};

CPingPong.prototype.playScore = function () {
	let first = this.leftCol.hasClass('pitcher') ? this.leftScore : this.rightScore;
	let second = this.leftCol.hasClass('pitcher') ? this.rightScore : this.leftScore;
	this.playScore_(first, second);
}

CPingPong.prototype.playScore_ = function (first, second) {
	if (!this.audioEnabled) {
		return;
	}

	this.audioDeffereds = [];
	this.audioDefferedsIdx = 0;

	if (first > 20) {
		let arr1 = String(first).split('');
		this.audioDeffereds.push(+(arr1[0] + '0'));
		this.audioDeffereds.push(+(arr1[1]));
	}
	else {
		this.audioDeffereds.push(first);
	}
	if (second > 20) {
		let arr2 = String(second).split('');
		this.audioDeffereds.push(+(arr2[0] + '0'));
		this.audioDeffereds.push(+(arr2[1]));
	}
	else {
		this.audioDeffereds.push(second);
	}
	this.onAudioEnd();
};

CPingPong.prototype.onAudioEnd = function () {
	if (!this.audio[this.audioDeffereds[this.audioDefferedsIdx]]) {
		return;
	}
	this.audio[this.audioDeffereds[this.audioDefferedsIdx]].play();
	this.audioDefferedsIdx++;
};

CPingPong.prototype.playWinner = function () {
	if (this.leftCol.hasClass('winner')) {
		this.audio.winLeft.play();
	}
	else {
		this.audio.winRight.play();
	}
};

CPingPongOBJ = new CPingPong();
