'use strict';

const main = document.querySelector('.main');
const levelElem = document.getElementById('level');
const scoreElem = document.getElementById('score');
const nextTetroElem = document.getElementById('next-tetro');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');

const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');

let playfield = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let score = 0;
let currentLevel = 1;
let isPaused = false;
let possibleLevels = {
	1: {
		scorePerLine: 100,
		speed: 400,
		nextLevelScore: 500,
	},
	2: {
		scorePerLine: 150,
		speed: 300,
		nextLevelScore: 1500,
	},
	3: {
		scorePerLine: 250,
		speed: 200,
		nextLevelScore: 3000,
	},
	4: {
		scorePerLine: 450,
		speed: 100,
		nextLevelScore: 7000,
	},
	5: {
		scorePerLine: 700,
		speed: 50,
		nextLevelScore: Infinity,
	},
};

let figures = {
	O: [
		[1, 1],
		[1, 1],
	],
	I: [
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	S: [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	Z: [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
	L: [
		[0, 0, 0],
		[0, 0, 1],
		[1, 1, 1],
	],
	J: [
		[0, 0, 0],
		[1, 0, 0],
		[1, 1, 1],
	],
	T: [
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
	],
};

let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

function draw() {
	let mainInnerHtml = '';
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] === 1) {
				mainInnerHtml += `<div class="cell movingCell"></div>`;
			} else if (playfield[y][x]) {
				mainInnerHtml += `<div class="cell fixedCell"></div>`;
			} else {
				mainInnerHtml += `<div class="cell"></div>`;
			}
		}
	}
	main.innerHTML = mainInnerHtml;
}

function drawNextTetro() {
	let nextTetroInnerHtml = '';
	for (let y = 0; y < nextTetro.shape.length; y++) {
		for (let x = 0; x < nextTetro.shape[y].length; x++) {
			if (nextTetro.shape[y][x]) {
				nextTetroInnerHtml += `<div class="cell movingCell"></div>`;
			} else {
				nextTetroInnerHtml += `<div class="cell"></div>`;
			}
		}
		nextTetroInnerHtml += `<br>`;
	}
	nextTetroElem.innerHTML = nextTetroInnerHtml;
}

function hasCollisions() {
	// console.log(12)
	for (let y = 0; y < activeTetro.shape.length; y++) {
		for (let x = 0; x < activeTetro.shape[y].length; x++) {
			if (
				activeTetro.shape[y][x] &&
				(playfield[activeTetro.y + y] === undefined ||
					playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
					playfield[activeTetro.y + y][activeTetro.x + x] === 2)
			) {
				return true;
			}
		}
	}

	return false;
}

function removePrevActiveTetro() {
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] === 1) {
				playfield[y][x] = 0;
			}
		}
	}
}

function addActiveTetro() {
	removePrevActiveTetro();
	for (let y = 0; y < activeTetro.shape.length; y++) {
		for (let x = 0; x < activeTetro.shape[y].length; x++) {
			if (activeTetro.shape[y][x] === 1) {
				playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
			}
		}
	}
}

function rotateTetro() {
	const prevTetroState = activeTetro.shape;

	activeTetro.shape = activeTetro.shape[0].map((val, index) => activeTetro.shape.map((row) => row[index]).reverse());

	if (hasCollisions()) {
		activeTetro.shape = prevTetroState;
	}
}

function removeFullLines() {
	let canRemoveLine = true,
		filledLines = 0;
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] !== 2) {
				canRemoveLine = false;
				break;
			}
		}
		if (canRemoveLine) {
			playfield.splice(y, 1);
			playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
			filledLines++;
		}
		canRemoveLine = true;
	}

	switch (filledLines) {
		case 1:
			score += possibleLevels[currentLevel].scorePerLine;
			break;
		case 2:
			score += possibleLevels[currentLevel].scorePerLine * 3;
			break;
		case 3:
			score += possibleLevels[currentLevel].scorePerLine * 7;
			break;
		case 4:
			score += possibleLevels[currentLevel].scorePerLine * 15;
			break;
		default:
			score += 0;
			break;
	}

	scoreElem.innerHTML = score;
	if (score >= possibleLevels[currentLevel].nextLevelScore) {
		currentLevel++;
		levelElem.innerHTML = currentLevel;
	}
}

function getNewTetro() {
	const possibleFigures = 'OISZLJT';
	const rand = Math.floor(Math.random() * 7);
	const newTetro = figures[possibleFigures[rand]];

	return {
		x: Math.floor((10 - newTetro[0].length) / 2),
		y: 0,
		shape: newTetro,
	};
}

function fixTetro() {
	for (let y = 0; y < playfield.length; y++) {
		for (let x = 0; x < playfield[y].length; x++) {
			if (playfield[y][x] === 1) {
				playfield[y][x] = 2;
			}
		}
	}
}

function moveTetroDown() {
	activeTetro.y += 1;
	if (hasCollisions()) {
		activeTetro.y -= 1;
		fixTetro();
		removeFullLines();
		activeTetro = nextTetro;
		if (hasCollisions()) {
			alert('Game over');
		}
		nextTetro = getNewTetro();
	}
}

function dropTetro() {
	for (let y = activeTetro.y; y < playfield.length; y++) {
		activeTetro.y++;
		if (hasCollisions()) {
			activeTetro.y -= 1;
			break;
		}
	}
}

document.onkeydown = (e) => {
	if (!isPaused) {
		console.log(e.keyCode);
		if (e.keyCode === 37) {
			activeTetro.x -= 1;
			if (hasCollisions()) {
				activeTetro.x += 1;
			}
		} else if (e.keyCode === 39) {
			activeTetro.x += 1;
			if (hasCollisions()) {
				activeTetro.x -= 1;
			}
		} else if (e.keyCode === 40) {
			moveTetroDown();
		} else if (e.keyCode === 38) {
			rotateTetro();
		} else if (e.keyCode === 32) {
			dropTetro();
		}
		addActiveTetro();
		draw();
		drawNextTetro();
	}
};

btnLeft.addEventListener('click', (e) => {
	activeTetro.x -= 1;
	if (hasCollisions()) {
		activeTetro.x += 1;
	}
});
btnRight.addEventListener('click', (e) => {
	activeTetro.x += 1;
	if (hasCollisions()) {
		activeTetro.x -= 1;
	}
});
btnUp.addEventListener('click', (e) => {
	rotateTetro();
});
btnDown.addEventListener('click', (e) => {
	moveTetroDown()
});

pauseBtn.addEventListener('click', (e) => {
	if (e.target.innerHTML == 'Pause') {
		e.target.innerHTML = 'Keep Playing...';
	} else {
		e.target.innerHTML = 'Pause';
	}
	isPaused = !isPaused;
});

//startBtn.addEventListener('click', (e) => {
//	setTimeout(startGame, possibleLevels[currentLevel].speed);
//});

scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

//addActiveTetro();
draw();
//drawNextTetro();

function startGame() {
	if (!isPaused) {
		moveTetroDown();
		addActiveTetro();
		draw();
		drawNextTetro();
	}
	setTimeout(startGame, possibleLevels[currentLevel].speed);
}

setTimeout(startGame, possibleLevels[currentLevel].speed);
