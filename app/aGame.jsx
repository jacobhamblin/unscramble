
var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var ALPHABETCODES = new Object;
for (var i = 0; i < 26; i++) {
  ALPHABETCODES[ALPHABET[i]] = 65 + i;
}

var letterCount = 0;
var formingWord = [];
var wordsCompleted = 0;

var Game = React.createClass({

  getInitialState: function() {
    var keyCodes = new Object();
    var currentWord = this.props.words[0].toLowerCase();

    for (var i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === '-') {
        keyCodes[189] = true;
      } else {
        keyCodes[ALPHABETCODES[currentWord[i]]] = true;
      }
    }

    var shuffledWord = this.shuffleWord(currentWord);

    return {
      currentWord: currentWord,
      keyCodes: keyCodes,
      gameOver: false,
      secondsElapsed: 0,
      shuffledWord: shuffledWord,
    }
  },

  componentDidMount: function() {
    document.addEventListener('keydown', this.keyDown);
    this.interval = setInterval(this.tick, 1000);
  },

  tick: function() {
    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1
    })

    if (this.state.gameOver) {
      clearInterval(this.interval);
    } else if (this.state.secondsElapsed === 60) {
      this.setState({
        gameOver: 'Lose'
      });
      clearInterval(this.interval);
    }
  },

  keyDown: function (event) {
    if (event.which === 17 || this.state.gameOver) {
      return;
    }
    if (this.state.keyCodes[event.which]) {
      this.moveLetter(event.which);
    } else if (event.which === 8) {
      event.preventDefault();
      this.removeLetter();
    }
  },

  computeScore: function() {
    var difficulty = this.props.difficulty;
    var multiplier = 0;
    var bonus = 0;

    if (difficulty === 'easy') {
      multiplier = 0.5;
    } else if (difficulty === 'medium') {
      multiplier = 1.0;
    } else if (difficulty === 'hard') {
      multiplier = 1.5;
    }

    if (this.state.gameOver) {
      bonus = (60 - this.state.secondsElapsed) * 5;
    }

    return (
      ((wordsCompleted * 50) + bonus) * multiplier
    )
  },

  moveLetter: function (keyCode) {
    if (letterCount < this.state.currentWord.length) {
      letterCount += 1;
      if (keyCode === 189) {
        formingWord.push('-');
      } else {
        formingWord.push(ALPHABET[keyCode - 65]);
      }
      this.checkWordCompleted();
      console.log(formingWord.join(''));
    }
  },

  checkWordCompleted: function() {
    if (formingWord.join('') === this.state.currentWord) {
      wordsCompleted += 1;
      if (wordsCompleted === 10) {
        this.setState({
          gameOver: 'Win'
        })
      } else {
        var keyCodes = new Object();
        var curWord = this.props.words[wordsCompleted].toLowerCase();

        for (var i = 0; i < curWord.length; i++) {
          if (curWord[i] === '-') {
            keyCodes[189] = true;
          } else {
            keyCodes[ALPHABETCODES[curWord[i]]] = true;
          }
        }

        this.setState({
          currentWord: this.props.words[wordsCompleted].toLowerCase(),
          keyCodes: keyCodes,
          shuffledWord: this.shuffleWord(this.props.words[wordsCompleted].toLowerCase()),
        });
        formingWord = [];
        letterCount = 0;
      }
    } else if (letterCount === this.state.currentWord.length) {
      alert('wrong');
    }
  },

  removeLetter: function() {
    if (letterCount > 0) {
      letterCount -= 1;
      formingWord.pop();
    }
  },

  shuffleWord: function (word) {
    var o = word.split('');
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o.join('');
  },

  makeBoxes: function() {
    var shuffledWord = this.state.shuffledWord;
    if (this.state.gameOver === 'Win') {
      shuffledWord = 'You Win!';
    } else if (this.state.gameOver === 'Lose') {
      shuffledWord = 'Time Up!'
    }

    var letters = [];
    console.log(this.state.currentWord);
    for (var i = 0; i < shuffledWord.length; i++) {
      var letter = shuffledWord[i];
      letters.push(
        <div className='letter-box'>
          <div className='letter'>
            {letter}
          </div>
        </div>
      )
    }
    return (
      {letters}
    )
  },

  render: function() {
    return (
      <div className='container'>
        <div className='wordShow'>
          {this.makeBoxes()}
        </div>
        <div className='stats-container'>
          <div className='score'>
            {this.computeScore()}
          </div>
          <div className='timer'>
            {60 - this.state.secondsElapsed}
          </div>
        </div>
      </div>
    )
  }


});
