'use strict';

var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var ALPHABETCODES = new Object();
for (var i = 0; i < 26; i++) {
  ALPHABETCODES[ALPHABET[i]] = 65 + i;
}

var letterCount = 0;
var formingWord = [];
var wordsCompleted = 0;

var Game = React.createClass({ displayName: 'Game',

  getInitialState: function getInitialState() {
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
      shuffledWord: shuffledWord
    };
  },

  componentDidMount: function componentDidMount() {
    document.addEventListener('keydown', this.keyDown);
    this.interval = setInterval(this.tick, 1000);
  },

  tick: function tick() {
    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1
    });

    if (this.state.gameOver) {
      clearInterval(this.interval);
    } else if (this.state.secondsElapsed === 60) {
      this.setState({
        gameOver: 'Lose'
      });
      clearInterval(this.interval);
    }
  },

  keyDown: function keyDown(event) {
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

  computeScore: function computeScore() {
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

    return (wordsCompleted * 50 + bonus) * multiplier;
  },

  moveLetter: function moveLetter(keyCode) {
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

  checkWordCompleted: function checkWordCompleted() {
    if (formingWord.join('') === this.state.currentWord) {
      wordsCompleted += 1;
      if (wordsCompleted === 10) {
        this.setState({
          gameOver: 'Win'
        });
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
          shuffledWord: this.shuffleWord(this.props.words[wordsCompleted].toLowerCase())
        });
        formingWord = [];
        letterCount = 0;
      }
    } else if (letterCount === this.state.currentWord.length) {
      alert('wrong');
    }
  },

  removeLetter: function removeLetter() {
    if (letterCount > 0) {
      letterCount -= 1;
      formingWord.pop();
    }
  },

  shuffleWord: function shuffleWord(word) {
    var o = word.split('');
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o.join('');
  },

  makeBoxes: function makeBoxes() {
    var shuffledWord = this.state.shuffledWord;
    if (this.state.gameOver === 'Win') {
      shuffledWord = 'You Win!';
    } else if (this.state.gameOver === 'Lose') {
      shuffledWord = 'Time Up!';
    }

    var letters = [];
    console.log(this.state.currentWord);
    for (var i = 0; i < shuffledWord.length; i++) {
      var letter = shuffledWord[i];
      letters.push(React.createElement('div', { className: 'letter-box' }, React.createElement('div', { className: 'letter' }, letter)));
    }
    return { letters: letters };
  },

  render: function render() {
    return React.createElement('div', { className: 'container' }, React.createElement('div', { className: 'wordShow' }, this.makeBoxes()), React.createElement('div', { className: 'stats-container' }, React.createElement('div', { className: 'score' }, this.computeScore()), React.createElement('div', { className: 'timer' }, 60 - this.state.secondsElapsed)));
  }

});
'use strict';

var Welcome = React.createClass({ displayName: 'Welcome',

  getInitialState: function getInitialState() {
    return {
      difficulty: false,
      clicked: false,
      words: false
    };
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.state.difficulty) {
      var fetchWords = function fetchWords(difficulty) {
        var min = 0;
        var max = 0;
        if (difficulty === 'hard') {
          min = '6';
          max = '10';
        } else if (difficulty === 'medium') {
          min = '5';
          max = '8';
        } else if (difficulty === 'easy') {
          min = '4';
          max = '6';
        }
        var url = 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=' + min + '&maxLength=' + max + '&limit=10&api_key=74cda975756707817800802c86206415d567812799f8139d5';

        $.getJSON(url, function (result) {
          var words = [];
          for (var i = 0; i < result.length; i++) {
            words.push(result[i].word);
          }
          self.state.words = words.sort(function (a, b) {
            return a.length - b.length;
          });
        });
      };

      var self = this;

      fetchWords(this.state.difficulty);
    }
  },

  difficultyClick: function difficultyClick(event) {
    this.setState({ difficulty: event.target.className });
  },

  render: function render() {
    if (this.state.words) {
      return React.createElement(Game, { words: this.state.words, difficulty: this.state.difficulty });
    } else {
      return React.createElement('div', { className: 'container' }, React.createElement('div', { className: 'welcome' }, 'Unscramble!'), React.createElement('div', { className: 'difficulties' }, React.createElement('div', { className: 'easy', onClick: this.difficultyClick }), React.createElement('div', { className: 'medium', onClick: this.difficultyClick }), React.createElement('div', { className: 'hard', onClick: this.difficultyClick })));
    }
  }
})

// 74cda975756707817800802c86206415d567812799f8139d5
//
// http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&limit=20&api_key=74cda975756707817800802c86206415d567812799f8139d5 | python -mjson.tool
;
"use strict";

var Main = React.createClass({ displayName: "Main",

  render: function render() {
    return React.createElement("div", { className: "background" }, React.createElement(Welcome, null));
  }
});

React.render(React.createElement(Main, null), document.body);