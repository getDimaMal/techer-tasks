document.addEventListener('DOMContentLoaded', () => {
  new GameController(new GameModel(), new GameView());
});

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.startButton = document.getElementById('start');
    this.timeInput = document.getElementById('game-time');

    this.initGame();
  }

  initGame() {
    this.startButton.addEventListener('click', () => this.startGame());
  }

  startGame() {
    const time = parseInt(this.timeInput.value);
    this.model.time = time;
    this.model.score = 0;

    this.view.hideScore();
    this.view.showTimer();
    this.view.hideButton();
    this.view.updateTimer(this.model.time);

    this.model.startTimer((newTime) => {
      if (newTime <= 0) {
        this.view.hideTimer();
        this.view.hideTimer();
        this.view.showScore();
        this.view.showButton();
        this.view.clearGameArea();
        this.view.updateScore(`Ваш Результат: ${this.model.score}`);
      }
      this.view.updateTimer(`Время Игры: ${newTime}`);
    });

    this.renderTile();
  }

  renderTile() {
    if (!this.model.isRunning) return;
    this.view.createRandomTile(() => {
      this.model.incrementScore();
      this.renderTile();
    });
  }
}

class GameModel {
  constructor() {
    this.score = 0;

    this.time = 0;
    this.timerId = null;
    this.isRunning = false;
  }

  setTime(time) {
    this.time = time;
  }

  stopTimer() {
    this.isRunning = false;
    clearInterval(this.timerId);
  }

  startTimer(callback) {
    this.isRunning = true;
    this.timerId = setInterval(() => {
      callback(this.time.toFixed(1));
      this.time -= 0.1;

      if (this.time <= 0) {
        this.stopTimer();
        callback(0);
      }

    }, 100);
  }

  incrementScore() {
    this.score++;
  }
}

class GameView {
  constructor() {
    this.tile = null;
    this.gameArea = document.getElementById('game');
    this.timeElement = document.getElementById('time');
    this.startButton = document.getElementById('start');
    this.scoreElement = document.getElementById('score');
  }

  updateTimer(time) {
    this.timeElement.textContent = time;
  }

  hideTimer() {
    this.timeElement.classList.add('hide');
  }

  showTimer() {
    this.timeElement.classList.remove('hide');
  }

  updateScore(score) {
    this.scoreElement.textContent = score;
  }

  hideScore() {
    this.scoreElement.classList.add('hide');
  }

  showScore() {
    this.scoreElement.classList.remove('hide');
  }

  hideButton() {
    this.startButton.classList.add('hide');
  }

  showButton() {
    this.startButton.classList.remove('hide');
  }

  clearGameArea() {
    this.gameArea.innerHTML = '';
  }

  createRandomTile(onClick) {
    this.clearGameArea();

    const tile = document.createElement('div');
    tile.addEventListener('click', onClick);
    tile.classList.add('tile');

    const size = getRandomIntInRange(40, 80);
    const top = Math.random() * (this.gameArea.offsetHeight - size);
    const left = Math.random() * (this.gameArea.offsetWidth - size);
    const color = getRandomRGBColor();

    tile.style.top = `${top}px`;
    tile.style.left = `${left}px`;
    tile.style.width = `${size}px`;
    tile.style.height = `${size}px`;
    tile.style.backgroundColor = color;

    this.gameArea.append(tile);
  }
}

function getRandomIntInRange(min, max) {
  let thisMin = Math.ceil(min);
  let thisMax = Math.floor(max);
  return Math.floor(Math.random() * (thisMax - thisMin + 1)) + thisMin;
}

function getRandomRGBColor() {
  const rgb = Array.from({length: 3}, () => getRandomIntInRange(0, 256));
  return `rgb(${rgb.join(',')})`;
}
